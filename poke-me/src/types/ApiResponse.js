import { MessageSchema } from "@/model/User"; // Assuming MessageSchema is a Mongoose schema

export const ApiResponse = {
  success: true, // or false, depending on your implementation
  message: "", // Initialize as an empty string or any default message
  isAcceptanceMessage: true, // or false, depending on your implementation
  messages: [], // Initialize as an empty array or include default MessageSchema objects
};

// Example of how to add messages using MessageSchema
ApiResponse.messages.push(new MessageSchema({ content: "Example message" }));

export default ApiResponse;
