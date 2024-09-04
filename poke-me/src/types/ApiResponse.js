import { MessageSchema } from "@/model/User"; // Assuming MessageSchema is a Mongoose schema

export const ApiResponse = {
  success: true, // or false, depending on your implementation
  message: "", // Initialize as an empty string or any default message
  isAcceptanceMessage: true, // or false, depending on your implementation
  messages: [], // Initialize as an empty array or include default MessageSchema objects
};

// Add a new message object to the messages array (matching the MessageSchema structure)
ApiResponse.messages.push({ content: "Example message", createdAt: new Date() });

export default ApiResponse;
