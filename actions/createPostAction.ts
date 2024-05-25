"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import multer, { StorageEngine } from "multer";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import connectDB from "@/mongodb/db";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

connectDB();

// Validate that environment variables are available and type assert to string
const accessKeyId = process.env.MY_AWS_KEY_ID as string;
const secretAccessKey = process.env.MY_AWS_SECRET_KEY as string;
const region = process.env.MY_AWS_S3_REGION as string;
const bucketName = process.env.MY_AWS_BUCKET_NAME as string;

if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
  throw new Error(
    "Missing required environment variables for AWS configuration"
  );
}

// Configure AWS SDK with your credentials
const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

function randomImageName(bytes = 32) {
  crypto.randomBytes(bytes).toString("hex");
}

const storage: StorageEngine = multer.memoryStorage();

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url: string = "";

  if (!postInput) {
    throw new Error("Post input is required");
  }

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (image) {
      // Convert the File to a Buffer using arrayBuffer and Buffer.from
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      // Data to send to S3 bucket
      const imageName = `IMG_${randomImageName()}`;
      const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: imageBuffer,
      };
      const putCommand = new PutObjectCommand(params); // command to create object in bucket
      await s3.send(putCommand);

      // create a signed public URL from the uploaded image name
      // and to save the same in post_image in DB
      const getObjectParams = {
        Bucket: bucketName,
        Key: imageName,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      image_url = await getSignedUrl(s3, getCommand);
    }

    // Create the post in the database
    const body: AddPostRequestBody = {
      user: userDB,
      text: postInput,
      imageUrl: image_url || "",
    };

    await Post.create(body);
  } catch (error: any) {
    throw new Error("Failed to create post: " + error.message);
  }

  revalidatePath("/");
}
