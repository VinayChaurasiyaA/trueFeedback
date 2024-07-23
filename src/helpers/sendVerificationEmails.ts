import { resend } from "@/lib/resend";

import VerificationEmail from "@/components/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: `Verification email sent to ${email}`,
    };
  } catch (error) {
    console.log("error in sending verification email", error);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
};
