const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "category slug is required"],
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Categories = model("Categories", categorySchema);

module.exports = Categories;
