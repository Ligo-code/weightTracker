import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maximum number of connections in the pool
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Full error:", error);

    // Don't exit process in production, just log the error
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    } else {
      console.log("⚠️ Running without database connection in production");
    }
  }

  // Handle connection events
  mongoose.connection.on("connected", () => {
    console.log("✅ Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Mongoose disconnected from MongoDB");
  });
};

export default connectDB;
