const User = require("../models/user.model");
const Product = require("../models/product.model");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: user.cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addToFavourite = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    const alreadyExists = user.favourites.some(
      fav => fav.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Product already in favourites"
      });
    }

    user.favourites.push(productId);
    await user.save();

    res.status(200).json({
      message: "Product added to favourites successfully",
      favourites: user.favourites
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};