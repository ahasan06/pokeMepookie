import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
    await dbConnect();
    console.log("Database connection established.");

    const session = await getServerSession(authOptions);
    // this user taker from auth option token inject user sessison
    const user = session?.user;

    //if user not found or not logged in
    if (!session || !session.user) {
        console.log("No user session found or user not logged in.");
        return NextResponse.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        );
    }

    //if user found
    const userId = mongoose.Types.ObjectId(session.user._id);
    console.log("Formatted userId for MongoDB query:", userId);

    try {
        const user = await User.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        console.log("Aggregation complete, result:", user);

        if (!user || user.length === 0) {
            console.log("No user or messages found for the provided userId.");
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 500
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    message: user[0].messages
                },
                {
                    status: 200
                }
            );
        }
    } catch (error) {
        console.error("Error occurred during aggregation:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );
    }
}
