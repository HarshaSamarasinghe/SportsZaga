import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("DB Connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};

export default connectDB;
