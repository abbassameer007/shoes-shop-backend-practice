const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,cart: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }
],

favourites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);