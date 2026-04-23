const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ VERY IMPORTANT
app.use(cors({
  // origin: ["http://localhost:5173", "http://localhost:5174"],
  origin: ["https://taskmanagerwithauth.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

// ✅ TEST ROUTE (must exist)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => {
    console.log("❌ DB Connection Error:", err);
  });

// start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});