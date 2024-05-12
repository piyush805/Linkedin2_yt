import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models } from "mongoose";

// for the client side
export interface ICommentBase {
  user: IUser;
  text: string;
}

// For the server side
export interface IComment extends Document, ICommentBase {
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// check if already initialize, if not, initialize one
export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
