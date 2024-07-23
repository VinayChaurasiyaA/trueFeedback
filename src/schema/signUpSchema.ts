import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be between 3 and 20 characters")
  .max(20, "Username must be between 3 and 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must not include special characters except underscore"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email({ message: "Invalid email" })
    .regex(/.com$/, "Not valid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  // confirmPassword: z.string(),
});
