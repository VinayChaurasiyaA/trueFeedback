import React from "react";
import { Html, Button, Head, Preview, Section } from "@react-email/components";
export type VerificationEmailProps = {
  username: string;
  otp: string;
};
const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
      </Head>
      <Section>
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <h1>Hi {username},</h1>
        <p>
          Thanks for signing up! Here&apos;s your verification code:{" "}
          <strong>{otp}</strong>
        </p>
        <Button href={`https://localhost:3000/verify/${username}`}>
          Verify your email
        </Button>
      </Section>
    </Html>
  );
};

export default VerificationEmail;
