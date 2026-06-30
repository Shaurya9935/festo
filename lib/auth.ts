import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index"; // your drizzle instance
import * as schema from "@/db/schema"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    emailAndPassword: {
    enabled: true,

    plugins: [
        // emailOTP({ 
        //     async sendVerificationOTP({ email, otp, type }) { 
        //         if (type === "sign-in") { 
        //             // Send the OTP for sign in
        //         } else if (type === "email-verification") { 
        //             // Send the OTP for email verification
        //         } else { 
        //             // Send the OTP for password reset
        //         } 
        //     }, 
        // })
        ]

  },
});