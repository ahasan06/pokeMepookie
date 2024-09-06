import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
        }

        const userId = session.user._id;
        const user = await User.findById(userId).select("messages");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: user.messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}