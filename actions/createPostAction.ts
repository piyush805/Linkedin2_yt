"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { auth, currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  //   auth().protect()
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;

  let image_url: string | undefined = undefined;

  if (!postInput) {
    throw new Error("post input is required");
  }

  // define user
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };
  try {
    if (image.size > 0) {
      // 1. upload image if there is one - MS Blob storage
      console.log("Uploading image to Azure Blob Storage...", image);
      const accountName = process.env.AZURE_STORAGE_NAME;
      const sasToken = await generateSASToken();
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;

      console.log("File uploaded successfully!", image_url);

      // 2. create a post in database
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };
    } else {
      // 1. create a post in database without image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error: any) {
    throw new Error("Failed to create post ", error);
  }

  revalidatePath("/"); // update the data on this path-page because we have updated it
}
