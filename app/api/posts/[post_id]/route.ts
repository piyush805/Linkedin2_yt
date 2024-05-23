import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();
  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching the post",
      },
      { status: 500 }
    );
  }
}

export interface DeletePostRequestBody {
  userId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    await connectDB();
    // const user = await currentUser(); // safer way - user will have to be authorized
    const { userId }: DeletePostRequestBody = await request.json(); // someone could pretend by passing userId in body
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.user.userId !== userId) {
      throw new Error("Post does not belong to the user");
    }
    await post.removePost();
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while deleting the post",
      },
      { status: 500 }
    );
  }
}
