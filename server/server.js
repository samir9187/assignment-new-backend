import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.routes.js";
import itemRoutes from "./routes/item.routes.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// Connect to MongoDB using environment variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v2/items", itemRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTY0NjNlNWYyYTEyOGU1MjQ5M2I1ZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMjE3MzAwMSwiZXhwIjoxNzIyMTc2NjAxfQ.6fkghO4aarmtszJsdpDvH_Fz9qnmXsWJTSpmStCV-lU

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTYzNmRmYWI5NmQ2ZDczNmM4ZThkZiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MjIxNzMxMzAsImV4cCI6MTcyMjE3NjczMH0.q3piBHA45UmEqe2yb4FgBHcuOgM0OhQJapjK8NgMRv0
