import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index"; // your drizzle instance
import * as schema from "@/db/schema"
import { emailOTP } from "better-auth/plugins"
import { sendVerificationEmail } from "@/services/email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url}) => {
            const verificationUrl = new URL(url);
            verificationUrl.searchParams.set("callbackURL", `${verificationUrl.origin}/login`);
            await sendVerificationEmail(user.email, user.name, verificationUrl.toString());
        },
    },
  
});