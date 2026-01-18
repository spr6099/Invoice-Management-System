import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("Database connected");
  } catch (error) {
    console.error(error);
  }
};

export default db;
