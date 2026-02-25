const Product = require("../models/product.model");

exports.createProduct = async (req, res) => {
  try {
    const { shoeName, price, sizes, shoeBrand } = req.body;

    if (!shoeName || !price || !shoeBrand) {
      return res.status(400).json({ message: "shoeName , price and shoeBrand are required" });
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "Sizes must be a non-empty array" });
    }
    

    for (const size of sizes) {
      if (!size.country || !["UK", "US", "EU"].includes(size.country)) {
        return res.status(400).json({ message: "Invalid or missing country in sizes" });
      }

      if (!Array.isArray(size.values) || size.values.length === 0) {
        return res.status(400).json({ message: "Values must be a non-empty array" });
      }
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { sizes } = req.body;

    if (sizes) {
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return res.status(400).json({ message: "Sizes must be a non-empty array" });
      }

      for (const size of sizes) {
        if (!size.country || !["UK", "US", "EU"].includes(size.country)) {
          return res.status(400).json({ message: "Invalid or missing country in sizes" });
        }

        if (!Array.isArray(size.values) || size.values.length === 0) {
          return res.status(400).json({ message: "Values must be a non-empty array" });
        }
      }
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// /api/products?search=air&minPrice=100&page=1&limit=5
exports.getProducts = async (req, res) => {
  try {
    const { search, brand, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = {};

    // 🔍 Search by shoeName or shoeBrand
    if (search) {
      query.$or = [
        { shoeName: { $regex: search, $options: "i" } },
        { shoeBrand: { $regex: search, $options: "i" } }
      ];
    }

    // 🎯 Filter by brand
    if (brand) {
      query.shoeBrand = brand;
    }

    // 💰 Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "Products fetched successfully",
      totalProducts: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

