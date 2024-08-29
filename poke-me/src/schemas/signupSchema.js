import { z } from "zod";

export const usernameValidation = z
        .string() //check empty string
        .min(2,"username must be at leasr two characters")
        .max(20,"username must be not more then 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");


export const signUpSchema = z.object({
    username : usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z
        .string()
        .min(6,{message:"Password must be at least 6 characters"})
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one Uppercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number (0-9)" }),
})