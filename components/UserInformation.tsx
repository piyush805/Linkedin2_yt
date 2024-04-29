import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { SignedIn } from "@clerk/nextjs";

async function UserInformation() {
  const user = await currentUser();
  return (
    <div>
      <Avatar>
        {user?.id ? (
          <AvatarImage src={user?.imageUrl} />
        ) : (
          <AvatarImage src="https://github.com/shadcn.png" />
        )}
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <SignedIn>
        <div className="text-center"></div>
      </SignedIn>
    </div>
  );
}

export default UserInformation;
