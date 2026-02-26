const multer = require("multer");

const storage = multer.memoryStorage();//for storing in cloudinary etc

const upload = multer({ storage });

module.exports = upload;

//for storing image locally in our system/pc uploads directory
// const multer = require("multer");
// const path = require("path");

// // storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },

//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;