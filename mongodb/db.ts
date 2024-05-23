import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@linkedin-yt1.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) {
  throw new Error("Please provide a valid connection string");
}
// Enable Mongoose debugging for more insights
mongoose.set("debug", true);
// const connectDB = async () => {
//   if (mongoose.connection?.readyState >= 1) {
//     // console.log("---- Already connected to MongoDB ----")
//     return;
//   }

//   try {
//     console.log("---- Connecting to MongoDB ----", connectionString);
//     await mongoose.connect(connectionString);
//   } catch (error) {
//     console.log("Error connecting to MongoDB: ", error);
//   }
// };

const connectdb = async () => {
  if (mongoose.connection?.readyState >= 1) {
    // console.log("---- Already connected to MongoDB ----");
    return;
  }
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}`
    );
    console.log(
      `\nMongoDB connect !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("MONGODB connection error ", err);
  }
};

export default connectdb;
