import VerifyEmail from "@/emails/VerifyEmail";
import { resend } from "../lib/resend";


export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationUrl: string
) {
  return resend.emails.send({
    from: "Festo <onboarding@resend.dev>",
    to: email,
    subject: "Verify your Festo account",
    react: (
    <VerifyEmail
        name={name}
        verificationUrl={verificationUrl}
    />
    )
  });
}