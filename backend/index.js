const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true, // Allow credentials (cookies, authorization headers)
    exposedHeaders: ["Authorization"], // Expose additional headers if needed
  })
);

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define user routes
app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
