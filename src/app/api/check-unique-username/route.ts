import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schema/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // const { username } = UsernameQuerySchema.parse(request.query)
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    // console.log(result);

    if (!result.success) {
      const userNameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameError?.length > 0
              ? userNameError.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error in checking unique username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking unique username",
      },
      {
        status: 500,
      }
    );
  }
}
