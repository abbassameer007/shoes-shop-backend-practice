const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../src/config/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));//middleware for uploading files

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/user", require("./routes/user_product.route"));
app.get("/", (req, res) => {
  res.send("API Working");
});

//for swagger 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;