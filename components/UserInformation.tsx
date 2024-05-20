import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

async function UserInformation({ posts }: { posts: IPostDocument[] }) {
  const user = await currentUser();

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  const userPosts = posts.filter((post) => post.user.userId === user?.id);

  const userComments = posts.flatMap(
    (post) =>
      post?.comments?.filter((comment) => comment.user.userId === user?.id) ||
      []
  );

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
      <Avatar>
        {user?.id ? (
          <AvatarImage src={imageUrl} />
        ) : (
          <AvatarImage src="https://github.com/shadcn.png" />
        )}
        <AvatarFallback>
          {firstName?.charAt(0)}
          {lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {firstName} {lastName}
          </p>
          <p className="text-xs">
            @{firstName}
            {lastName}-{user?.id?.slice(-4)}
          </p>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-center space-x-2">
          <p className="font-semibold">You are not signed in</p>
          <Button asChild className="bg-[#0B63C4] text-white">
            <SignInButton>Sign in</SignInButton>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <hr className="w-full border-gray-200 my-5" />
        <div className="flex justify-between w-full px-4 text-sm">
          <p className="flex justify-between w-full px-4 text-sm">Posts</p>
          <p className="text-blue-400">{userPosts.length}</p>
        </div>

        <div className="flex justify-between w-full px-4 text-sm">
          <p className="flex justify-between w-full px-4 text-sm">Comments</p>
          <p className="text-blue-400">{userComments.length}</p>
        </div>
      </SignedIn>
    </div>
  );
}

export default UserInformation;
