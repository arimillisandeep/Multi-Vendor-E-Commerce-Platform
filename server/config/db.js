require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (
      !mongoURI ||
      mongoURI.includes("username:password") ||
      mongoURI.includes("xxxxx")
    ) {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      global.__mongoServer = mongoServer;
      console.log("Using in-memory MongoDB for development");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
