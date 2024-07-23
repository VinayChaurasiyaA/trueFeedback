import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(req: Request) {
  await dbConnect();
  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  // console.log(username);
  try {
    const response = await UserModel.findOne({
      username,
    });

    // console.log(response);
    if (response) {
      return Response.json(
        {
          success: true,
          message: "User found",
          isAcceptingMessage: response.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while getting user",
      },
      { status: 500 }
    );
  }
}
