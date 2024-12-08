const express = require("express");
const routes = require("./routes");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add support for URL-encoded form data if needed

// Register API routes
app.use("/api", routes);

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Ephoto Effect Generator API!");
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
