import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  // console.log(process.env.MONGODB_URI);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "MONGODB_URI is not defined. Please set it in your environment variables."
    );
    process.exit(1);
  }

  try {
    const db = await mongoose.connect(uri, {});
    // console.log(db.connections);

    connection.isConnected = db.connections[0].readyState;
    // console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;
