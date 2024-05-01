"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
  //   auth().protect()
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;

  let imageUrl: string | undefined;
  if (!postInput) {
    throw new Error("post input is required");
  }

  // define user

  // upload image if there is one

  // create post in database

  // revalidate '/' - home page
}
