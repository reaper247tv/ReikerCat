const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Register API routes
app.use("/api", routes);

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Ephoto Effect Generator API!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
