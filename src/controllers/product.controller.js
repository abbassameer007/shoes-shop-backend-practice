const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    let { shoeName, price, sizes, shoeBrand, shoeColor } = req.body;

    // Basic required fields
    if (!shoeName || !price || !shoeBrand) {
      return res.status(400).json({
        message: "shoeName, price and shoeBrand are required"
      });
    }

    // Image validation
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Sizes validation
    if (!sizes) {
      return res.status(400).json({ message: "Sizes are required" });
    }

    try {
      sizes = JSON.parse(sizes);
    } catch (err) {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        message: "Sizes must be a non-empty array"
      });
    }

    for (const size of sizes) {
      if (!size.country || !["UK", "US", "EU"].includes(size.country)) {
        return res.status(400).json({
          message: "Country must be UK, US, or EU"
        });
      }

      if (!Array.isArray(size.values) || size.values.length === 0) {
        return res.status(400).json({
          message: "Size values must be a non-empty array"
        });
      }

      if (!size.values.every(v => typeof v === "number")) {
        return res.status(400).json({
          message: "All size values must be numbers"
        });
      }
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        const product = await Product.create({
          shoeName,
          price,
          shoeBrand,
          shoeColor,
          sizes,
          image: result.secure_url
        });

        return res.status(201).json({
          message: "Product created successfully",
          product
        });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//for storing image locally in our system/pc uploads directory
// exports.createProduct = async (req, res) => {
//   try {
//     let { shoeName, price, sizes, shoeBrand, shoeColor } = req.body;

//     if (!shoeName || !price || !shoeBrand) {
//       return res.status(400).json({ message: "shoeName, price and shoeBrand are required" });
//     }

//     // 🔥 Parse sizes (because form-data sends string)
//     sizes = JSON.parse(sizes);

//     if (!Array.isArray(sizes) || sizes.length === 0) {
//       return res.status(400).json({ message: "Sizes must be a non-empty array" });
//     }

//     for (const size of sizes) {
//       if (!size.country || !["UK", "US", "EU"].includes(size.country)) {
//         return res.status(400).json({ message: "Invalid or missing country in sizes" });
//       }

//       if (!Array.isArray(size.values) || size.values.length === 0) {
//         return res.status(400).json({ message: "Values must be a non-empty array" });
//       }
//     }

//     const productData = {
//       shoeName,
//       price,
//       shoeBrand,
//       shoeColor,
//       sizes,
//       image: req.file ? req.file.filename : null
//     };

//     const product = await Product.create(productData);

//     res.status(201).json({
//       message: "Product created successfully",
//       product
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



exports.updateProduct = async (req, res) => {
  try {
    let { shoeName, price, sizes, shoeBrand, shoeColor } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate sizes if provided
    if (sizes !== undefined) {
      try {
        sizes = JSON.parse(sizes);
      } catch (err) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }

      if (!Array.isArray(sizes) || sizes.length === 0) {
        return res.status(400).json({ message: "Sizes must be non-empty array" });
      }

      for (const size of sizes) {
        if (!size.country || !["UK", "US", "EU"].includes(size.country)) {
          return res.status(400).json({ message: "Invalid country in sizes" });
        }

        if (!Array.isArray(size.values) || size.values.length === 0) {
          return res.status(400).json({ message: "Values must be non-empty array" });
        }

        if (!size.values.every(v => typeof v === "number")) {
          return res.status(400).json({ message: "Size values must be numbers" });
        }
      }
    }

    let imageUrl = product.image;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        shoeName: shoeName ?? product.shoeName,
        price: price ?? product.price,
        shoeBrand: shoeBrand ?? product.shoeBrand,
        shoeColor: shoeColor ?? product.shoeColor,
        sizes: sizes ?? product.sizes,
        image: imageUrl
      },
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // 🔥 Delete images from Cloudinary
      if(product.image){

        const publicId = product?.image?.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};