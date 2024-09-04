import mongoose from "mongoose";

let isConnected = false; // Track the connection status
export async function dbConnect() {

    if (isConnected) {
        console.log("MongoDB is already connected!");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
    
        isConnected = true;
        console.log("MongoDB connected successfully.");

        mongoose.connection.on("connected",()=>{
          console.log("MongoDB connection established.");
        })
        mongoose.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err.message);
        });
        mongoose.connection.on("disconnected", () => {
          console.warn("MongoDB connection disconnected.");
        });
        
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process with an error code
      }
    
   
}