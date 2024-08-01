const { Schema, model, default: mongoose } = require("mongoose");
const { bookDefaultCoverPath } = require("../secret");

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "book title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    published_date: {
      type: Date,
      required: [true, "published date is required!"],
    },
    cover: {
      type: String,
      default: bookDefaultCoverPath,
    },
    author_id: {
      type: mongoose.ObjectId,
      ref: "Authors",
      required: true,
    },
  },
  { timestamps: true }
);

const Books = model("Books", booksSchema);

module.exports = Books;
