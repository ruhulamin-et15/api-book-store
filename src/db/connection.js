const mongoose = require("mongoose");
const { mongoURI } = require("../secret");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
