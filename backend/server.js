require("dotenv").config();
console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "Cloudinary API secret exists:",
  !!process.env.CLOUDINARY_API_SECRET
);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

connectDB();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed."));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "3W Social API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.message?.includes("Only JPG")) {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5MB or smaller." });
  }

  return res.status(500).json({ message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
