import VerificationEmail from "@/components/emails/VerificationEmail";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists with this username",
        }),
        {
          status: 400,
        }
      );
    }

    let verifyCode;
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists with this email",
          }),
          {
            status: 400,
          }
        );
      } else {
        // update the existing user with the new data
        // TODO: hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        expiryDate.setHours(expiryDate.getHours() + 1);
        await UserModel.findOneAndUpdate(
          { email },
          {
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          }
        );
      }
    } else {
      // create a new user entirely
      // FIX: hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        messages: [],
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
      });
      await user.save();
      // console.log("User created successfully");
    }

    // send verification email
    const emailVerificationSend = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    // console.log(emailVerificationSend);

    if (emailVerificationSend.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "User created successfully, please verify your email",
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailVerificationSend.message,
        }),
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error in sending verification email", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error sending verification email",
      }),
      {
        status: 500,
      }
    );
  }
}
