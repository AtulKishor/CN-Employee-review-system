import dotenv from "dotenv";
dotenv.config();

// import mongoose
import mongoose from "mongoose";
// mongoDB url stored in env variable
const Url = "mongodb://0.0.0.0:27017/ersDB";

export default async () => {
  try {
    await mongoose.connect(Url);
    console.log("MongoDB connected successfully using mongoose");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
