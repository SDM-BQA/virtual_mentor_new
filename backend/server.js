const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
console.log("app.js: starting execution");
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "indianMentor",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/mentors", require("./routes/mentorRoutes"));
app.use("/api/mentees", require("./routes/menteeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


// Default route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
