import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const user = session.user;
  const userId = user._id;
  const userEmail = user.email;
  // const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        $or: [{ _id: userId }, { email: userEmail }],
      },
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while updating user",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const user = session.user;
  const userId = user._id;
  const userEmail = user.email;

  try {
    const dbUser = await UserModel.findOne({
      $or: [{ email: userEmail }, { _id: userId }],
    });
    // console.log(dbUser);
    if (!dbUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessage: dbUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching user",
      },
      { status: 500 }
    );
  }
}
