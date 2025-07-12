const mongoose = require("mongoose");

const FoodHistorySchema = new mongoose.Schema({
  email: { type: String, required: true }, // or userId if you use ObjectId for users
  foodName: String,
  nutrients: Object,
  quantity: Number, // e.g., grams
  timestamp: { type: Date, default: Date.now },
});

mongoose.model("FoodHistory", FoodHistorySchema);
