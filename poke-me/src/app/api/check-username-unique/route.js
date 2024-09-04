import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";
await dbConnect()

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


// localhost:3000/api/cuu?username=ahasan
export async function GET(request) {

    try {
    const {searchParams} = new URL(request.url)
    const queryparams = {
        username:searchParams.get('username')
    }
    console.log("Query parameters received:", queryparams);
    //validation with zod
    const result = UsernameQuerySchema.safeParse(queryparams)
    console.log("Username Validation result:", result);

    if (!result.success) {
        console.log("Validation failed:", result.error); 
        const errorMessages = result.error.issues.map(issue => issue.message);
        console.log("get username error :",errorMessages[0].toString());
        
        return NextResponse.json(
            {
                success: false,
                message: "Validation error",
                errors: errorMessages
            },
            {
                status:400
            }
        )
    }

    const {username} = result.data
    //if username is found in database
    const existingVerifiedUser = await User.findOne({username,isVerified:true})
    if (existingVerifiedUser) {
        return NextResponse.json(
            {
                success: false,
                message: "Username is already taken",
            },
            {
                status:400
            }
        )
    }
    // if username is not found
    return NextResponse.json(
        {
            success: true,
            message: "username is unique",
        },
        {
            status:200
        }
    )



    } catch (error) {
        console.log("Error checking username : ", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )

    }
}