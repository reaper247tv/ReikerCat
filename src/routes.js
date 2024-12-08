const express = require("express");
const router = express.Router();

// Define the /api/generate-effect route
router.get("/generate-effect", async (req, res) => {
  try {
    const { text, background } = req.query; // Access query parameters

    // Validate the request
    if (!text || !background) {
      return res.status(400).json({ error: "Text and background are required" });
    }

    // Placeholder logic for generating the effect
    const imageUrl = `https://example.com/generated-image?text=${encodeURIComponent(text)}&background=${background}`;
    const downloadUrl = `${imageUrl}&download=true`; // Simulate a downloadable link

    const result = {
      success: true,
      image_url: imageUrl, // Display generated image URL
      download_url: downloadUrl, // Display downloadable image URL
    };

    res.json(result); // Respond with the result
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
