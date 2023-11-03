<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/user");
=======
const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');
>>>>>>> 4794eab7d2342778d3e147362a84bea2816c1829

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

// Define item routes
app.use('/item', itemRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
