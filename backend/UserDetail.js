const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    // New fields from the profile step
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    activityLevel: String,
    goal: String,

    healthConditions: [String],
    allergies: [String],

    foodHistory: {
      type: Array,
      default: [],
    },

    resetCode: String,
    resetCodeExpiry: Number,
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsSchema);
