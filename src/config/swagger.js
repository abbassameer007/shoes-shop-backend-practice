const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Sameer's Authentication API documentation",
    },
   servers: [
  {
    url: "/",
  },
],
  },
apis: ["./src/routes/*.js"],};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;