import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model } from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";

export interface IPostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes: string[];
}

export interface IPost extends IPostBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Define the document methods (for each instance of a post)
interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: ICommentBase): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {} // singular instance of post
interface IPostModel extends IPostStatics, Model<IPostDocument> {} // all posts

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], refId: "Comment", default: [] }, // array of Id from the Comment Schema Objects : fetch with a Populate call - so it becomes like an INNER JOIN
    likes: { type: [String] },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    throw new Error("Error when liking post ", error);
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log("error when unliking post ", error);
  }
};

PostSchema.methods.removePost = async function (userId: string) {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("error when removing post ", error);
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    const comment = await Comment.create(commentToAdd);
    this.comments.push(comment._id);
  } catch (error) {
    console.log("error when commenting on  post ", error);
  }
};

PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }, // sort comments by newest first
    });
    return this.comments;
  } catch (error) {
    console.log("error when getting all comments ", error);
  }
};

PostSchema.methods.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      })
      // similarly chain other schema like 'Likes'
      .lean(); // converts mongoose object to plain JS object
    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: comment._id.toString(),
      })),
    }));
  } catch (error) {
    console.log("error when getting all posts ", error);
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

