import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    // console.log(username, code);
    const decodedUsername = decodeURIComponent(username);

    const existingUser = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid = existingUser.verifyCode === code;
    const isCodeNotExpired = new Date() < existingUser.verifyCodeExpiry;

    if (isCodeValid && isCodeNotExpired) {
      existingUser.isVerified = true;
      await existingUser.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code is expired",
        },
        {
          status: 404,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      {
        status: 500,
      }
    );
  }
}
