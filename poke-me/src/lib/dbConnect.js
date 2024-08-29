import mongoose from "mongoose";

let isConnected = false; // Track the connection status
export async function dbConnect() {

    if (isConnected) {
        console.log("MongoDB is already connected!");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // Add any other options you might need here
        });
    
        isConnected = true;
        console.log("MongoDB connected successfully.");
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process with an error code
      }
    
      mongoose.connection.on("connected",()=>{
        console.log("MongoDB connection established.");
      })
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
      });
      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB connection disconnected.");
      });
}