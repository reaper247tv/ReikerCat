const express = require("express");
const routes = require("./routes");

const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api", routes);

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Ephoto Effect Generator API!");
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found. Please check the URL.",
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong. Please try again later.",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
