const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    shoeName: { type: String, required: true },
    shoeBrand: { type: String },
    shoeColor: { type: String },
    image: { type: String, required: true }, // product image URL
    price: { type: Number, required: true },

    sizes: [
      {
        country: {
          type: String,
          enum: ["UK", "US", "EU"],
          required: true
        },
        values: {
          type: [Number],
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);