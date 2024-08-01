const { Schema, model } = require("mongoose");
const { authorDefaultImagePath } = require("../secret");

const authorsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "authors name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    birthdate: {
      type: Date,
      required: [true, "birth date is required"],
    },
    avatar: {
      type: String,
      default: authorDefaultImagePath,
    },
    address: {
      type: String,
      required: [true, "Author address is required!"],
      trim: true,
    },
    books: {
      type: Array,
      ref: "Books",
      default: [],
    },
  },
  { timestamps: true }
);

const Authors = model("Authors", authorsSchema);

module.exports = Authors;
