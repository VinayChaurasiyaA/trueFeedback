import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  // confirmPassword: string;
  messages: Message[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
}

const UserSchema: Schema<User> = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please fill a valid email address",
    ],
  },
  password: { type: String, required: [true, "password code is required"] },
  // confirmPassword: {
  //   type: String,
  //   required: [true, "password is required"],
  //   validate: {
  //     validator: function (this: User) {
  //       return this.password === this.confirmPassword;
  //     },
  //     message: "Password does not match",
  //   },
  // },
  messages: [MessageSchema],
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isAcceptingMessage: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
