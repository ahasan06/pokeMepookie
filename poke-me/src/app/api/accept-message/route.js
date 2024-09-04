import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";

// Send to database
export async function POST(request) {
    await dbConnect();
    console.log("Database connected for POST request.");

    const session = await getServerSession(authOptions);
    console.log("Session retrieved:", session);

    if (!session || !session.user) {
        console.log("No user session found.");
        return NextResponse.json(
            {
                success: false,
                message: "User not logged in."
            },
            {
                status: 401
            }
        );
    }

    const { acceptMessage } = await request.json();
    console.log("Request to accept/reject messages:", acceptMessage);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            session.user._id,
            { isAcceptingMessages: acceptMessage },
            { new: true }
        );
        console.log("User update attempt:", updatedUser);

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update user's message acceptance status."
                },
                {
                    status: 400
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    message: "Message acceptance status updated successfully.",
                    data: updatedUser
                },
                {
                    status: 200
                }
            );
        }
    } catch (error) {
        console.error("Error updating user status:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user's message acceptance status.",
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}

// Take data from database

export async function GET(request) {
    await dbConnect();
    console.log("Database connected for GET request.");

    const session = await getServerSession(request, request.headers, authOptions);
    console.log("Session retrieved:", session);

    if (!session || !session.user) {
        console.log("No user session found.");
        return NextResponse.json(
            {
                success: false,
                message: "User not logged in."
            },
            {
                status: 401
            }
        );
    }

    try {
        const foundUser = await User.findById(session.user._id);
        console.log("User lookup result:", foundUser);

        if (!foundUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessages
                },
                {
                    status: 200
                }
            );
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error retrieving user data.",
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}
