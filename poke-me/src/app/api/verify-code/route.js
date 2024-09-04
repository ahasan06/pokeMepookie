import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";
await dbConnect()


export async function POST(request) {
    try {
        console.log("Received POST request for user verification");
       const {username,code} = await request.json()
       const decodedUsername = decodeURIComponent(username)
       console.log("Decoded username:", decodedUsername);

      const user = await User.findOne({username: decodedUsername});
      console.log("Lookup result for user:", user);


     if (!user) {
        console.log("User not found for username:", decodedUsername);
        return NextResponse.json(
            {
                success: false,
                message: "User not found!",
            },
            {
                status:400
            }
        )
     }

     const isCodevalid = user.verifyCode === code
     const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
     console.log("Code validation status:", { isCodevalid, isCodeNotExpired });

     if (isCodevalid && isCodeNotExpired) {
        user.isVerified = true
        await user.save()
        console.log("User verified and updated in database:", user);

        return NextResponse.json(
            {
                success: true,
                message: "account verified successfully",
            },
            {
                status:200
            }
        )
     }
     
     else if(!isCodeNotExpired) {
        console.log("Verification code expired for user:", decodedUsername);
        return NextResponse.json(
            {
                success: false,
                message: "verification code expired! please signup again to get a new code",
            },
            {
                status:400
            }
        )
     }

     else{
        console.log("Incorrect verification code provided for user:", decodedUsername);
        return NextResponse.json(
            {
                success: false,
                message: "incorrect verification code",
            },
            {
                status:400
            }
        )
     }
        
    } catch (error) {
        console.error("Error occurred during user verification:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error verifying user",
            },
            {
                status:400
            }
        )
    }
}