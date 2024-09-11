import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await dbConnect();
  
  const messageId = params.messageId; // Use correct case for params
  console.log("Message Id for delete: ", messageId);
  
  const session = await getServerSession(authOptions);
  const userId = session.user._id;
  console.log("__user: ",userId);
  
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
}


  try {
    const updateResult = await User.updateOne(
      { _id: userId},
      { $pull: { messages: { _id: messageId } } } // Ensure messages field is correctly referenced
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
