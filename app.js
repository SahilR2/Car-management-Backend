const express = require('express');
const connectDB = require('../server/config/db');
const authRoutes = require('../server/routes/authRoutes');
const carRoutes = require('../server/routes/carRoutes');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Car Management API",
      version: "1.0.0",
      description: "API for managing cars, including CRUD operations and user authentication.",
      contact: {
        name: "Developer Support",
        email: "support@example.com",
      },
      servers: [
        {
          url: "http://localhost:5000",
          description: "Development server",
        },
      ],
    },
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// Environment variable check
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables");
  process.exit(1);
}

module.exports = app;
