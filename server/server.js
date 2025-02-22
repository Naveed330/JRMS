import express from "express";
import morgan from "morgan";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import testRouter from './routes/testRoutes.js'
import propertyRouter from "./routes/propertyRoutes.js";
import tenantRouter from "./routes/tenantRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


// Set port
const PORT = process.env.PORT || 8080;

// Basic route
app.get('/', (req, res) => {
  res.send('API is Working. Continue Your Spirits of the application.');
});


// Test Routes

app.use('/api/test', testRouter);
// API routes
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/tenants', tenantRouter);




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});