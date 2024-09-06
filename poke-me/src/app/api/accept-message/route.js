import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";

// Handle POST request to update message acceptance status
export async function POST(request) {
    try {
        // Connect to the database
        await dbConnect();
        console.log("Database connected for POST request.");

        // Retrieve the session
        const session = await getServerSession(authOptions);
        console.log("Session retrieved:", session);

        // Check if session exists
        if (!session || !session.user) {
            console.log("No user session found.");
            return NextResponse.json(
                {
                    success: false,
                    message: "User not logged in.",
                },
                { status: 401 }
            );
        }

        // Extract data from the request body
        const { acceptMessage } = await request.json();
        console.log("Request to accept/reject messages:", acceptMessage);

        // Update the user's message acceptance status
        const updatedUser = await User.findByIdAndUpdate(
            session.user._id,
            { isAcceptingMessages: acceptMessage },
            { new: true }
        );

        // If user is not found
        if (!updatedUser) {
            console.log("Failed to update user's message acceptance status.");
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update user's message acceptance status.",
                },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully.",
                data: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user status:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user's message acceptance status.",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// Handle GET request to retrieve message acceptance status
export async function GET(request) {
    try {
        // Connect to the database
        await dbConnect();

        // Retrieve the session
        const session = await getServerSession(authOptions);

        // Check if session exists
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Find user by ID and retrieve `isAcceptingMessages` field
        const user = await User.findById(session.user._id).select("isAcceptingMessages");

        // If user is not found
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Return success response with the status of `isAcceptingMessages`
        return NextResponse.json(
            { success: true, isAcceptingMessages: user.isAcceptingMessages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching accept message status:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
