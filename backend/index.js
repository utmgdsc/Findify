const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
<<<<<<< HEAD
var cors = require("cors");
=======
const cors = require("cors");
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999

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

app.use(cors());

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
