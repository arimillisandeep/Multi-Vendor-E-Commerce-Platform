const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/../.env" });

async function startTestServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  console.log(`In-memory MongoDB started at: ${mongoUri}`);

  process.env.MONGODB_URI = mongoUri;

  const connectDB = require("./config/db");
  await connectDB();

  const app = require("./server");

  console.log("Server started for testing");

  return { app, mongoServer, close: async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  }};
}

if (require.main === module) {
  startTestServer().catch(console.error);
}

module.exports = { startTestServer };
