const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.set("strictQuery", true).connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("DB connection failed", error.message);
  }
};

dbConnect();
