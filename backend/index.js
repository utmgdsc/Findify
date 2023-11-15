const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true, // Allow credentials (cookies, authorization headers)
    exposedHeaders: ["Authorization"], // Expose additional headers if needed
  })
);

// Parse JSON request body
app.use(express.json());

// Define user routes
app.use("/user", userRoutes);

// Define item routes
app.use("/item", itemRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
