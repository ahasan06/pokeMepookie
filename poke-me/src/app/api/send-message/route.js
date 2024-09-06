import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    console.log("Database connection established successfully.");

    // Parse the JSON body
    const body = await request.json();
    const { username, content } = body;

    // Check if both username and content are provided
    if (!username || !content) {
      console.log("Missing username or content");
      return NextResponse.json(
        {
          success: false,
          message: "Username and content are required.",
        },
        { status: 400 } // Bad request
      );
    }

    console.log(`Received message data: username = ${username}, content = ${content}`);

    // Look for the user in the database
    const user = await User.findOne({ username });
    console.log(`User lookup for username '${username}':`, user);

    if (!user) {
      console.log(`No user found for username '${username}'.`);
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 401 }
      );
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessages) {
      console.log(`User '${username}' is not accepting messages right now.`);
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages right now! Try again later.",
        },
        { status: 401 }
      );
    }

    // Add the message to the user's messages
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage);
    console.log(`New message pushed to user '${username}':`, newMessage);

    await user.save();
    console.log(`User '${username}' updated successfully with a new message.`);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("An unexpected error occurred while processing the request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
