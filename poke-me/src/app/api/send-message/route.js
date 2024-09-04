
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
await dbConnect()
console.log("Database connection established successfully.");

export async function POST(request) {
    
    const {username,content} = await request.json()
    console.log(`Received message data: username = ${username}, content = ${content}`);
    try {
        const user = await User.findOne({username})
        console.log(`User lookup for username '${username}':`, user);
        if (!user) {
            console.log(`No user found for username '${username}'.`);
            return NextResponse.json(
                {
                    success:false,
                    message:"User not found!"
                },
                {
                    status:401
                }
            )
        }
        // user found but not accpeting the message
        if (!user.isAcceptingMessages) {
            console.log(`User '${username}' is not accepting messages right now.`);

            return NextResponse.json(
                {
                    success:false,
                    message:"User is not accepting message right now! try again letter"
                },
                {
                    status:401
                }
            )
        }
        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage); 
        console.log(`New message pushed to user '${username}':`, newMessage)
        await user.save()
        console.log(`User '${username}' updated successfully with new message.`);
        return NextResponse.json(
            {
                success:true,
                message:"Message sent successfully!"
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.error("An unexpected error occurred while processing the request:", error);
        
        return NextResponse.json(
            {
                success:false,
                message:"Internal sever error!"
            },
            {
                status:500
            }
        )
    }
}