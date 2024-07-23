import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
//TODO: email can also be written as identifier
