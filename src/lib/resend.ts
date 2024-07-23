import { Resend } from "resend";

// console.log(process.env.MONGODB_URI);
// console.log();
const resendUri = process.env.RESEND_API_KEY;
export const resend = new Resend(resendUri);
