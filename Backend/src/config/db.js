// Backend/src/config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
