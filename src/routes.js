const express = require("express");
const axios = require("axios");
const router = express.Router();

// Helper function to extract the download link
const extractDownloadLink = (html) => {
  // Adjust regex to match the correct URL pattern
  const match = html.match(/https:\/\/e[0-9]\.yotools\.net\/save-image\/[a-zA-Z0-9]+\.jpg\/\d+/);
  return match ? match[0] : null;
};

// Define the /api/generate-effect route
router.get("/generate-effect", async (req, res) => {
  try {
    const { text, background } = req.query;

    // Validate the request
    if (!text || !background) {
      return res.status(400).json({ error: "Text and background are required" });
    }

    // Prepare form data for the API request
    const formData = new URLSearchParams();
    formData.append("text[]", text); // Text input
    formData.append("radio0[radio]", background); // Background selection
    formData.append("token", "da350dfbad6903a02bd78d6e461ff942"); // Token
    formData.append("build_server", "https://e1.yotools.net");
    formData.append("build_server_id", "2");
    formData.append("submit", "GO");

    // Send the POST request to ePhoto360
    const response = await axios.post(
      "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
      formData.toString(), // Form data as a string
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          Referer: "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
        },
      }
    );

    // Extract the download link
    const downloadLink = extractDownloadLink(response.data);
    if (!downloadLink) {
      return res.status(500).json({ error: "Failed to extract download link" });
    }

    // Respond with the generated image link
    res.status(200).json({
      success: true,
      text,
      background,
      download_link: downloadLink,
    });
  } catch (error) {
    console.error("Error generating effect:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
