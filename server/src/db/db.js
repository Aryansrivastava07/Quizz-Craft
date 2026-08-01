import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODBURI) {
    console.error("❌ MONGODB_URI not found in environment variables");
    console.log("💡 Please create a .env file in the server directory with:");
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODBURI);

    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log(`MongoDB Connection Failed:${err}`);
    process.exit(1);
  }
};

export default connectDB;
