
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const connectDB=require("./config/db.js");
const studentRoutes = require("./routes/studentRoutes.js");
app.use("/api/students", studentRoutes);
app.get("/", (req, res) => {
  res.send("Student Management Backend is Running!");
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();