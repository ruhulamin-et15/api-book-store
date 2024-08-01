const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "user password is required!"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    phone: {
      type: String,
      required: [true, "user phone number is required"],
    },
    avatar: {
      type: String,
      required: [true, "user avatar is required!"],
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Users = model("Users", userSchema);

module.exports = Users;
