

import mongoose from "mongoose";
// import "dotenv/config"; 

// console.log("Mongo URI:", process.env.MONGODB_URI);
const connectDB = async()=>{
 await mongoose.connect(
    process.env.MONGODB_URI
);
}

export default connectDB;
