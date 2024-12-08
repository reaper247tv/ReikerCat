const express = require("express");
const axios = require("axios");

const router = express.Router();

// Helper function to extract the download link
const extractDownloadLink = (html) => {
  const match = html.match(/href="(https:\/\/[^"]+\.jpg)"/); // Regex for extracting the image URL
  return match ? match[1] : null;
};

// Define the /api/generate-effect route
router.get("/generate-effect", async (req, res) => {
  try {
    const { text, background } = req.query; // Access query parameters

    // Validate the request
    if (!text || !background) {
      return res.status(400).json({ error: "Text and background are required" });
    }

    // Prepare form data for the API request
    const formData = new URLSearchParams();
    formData.append("text[]", text);
    formData.append("radio0[radio]", background);
    formData.append("token", "da350dfbad6903a02bd78d6e461ff942");
    formData.append("build_server", "https://e1.yotools.net");
    formData.append("build_server_id", "2");
    formData.append("submit", "GO");

    // Send the POST request to the ePhoto360 API
    const response = await axios.post(
      "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Extract the download link from the response HTML
    const downloadLink = extractDownloadLink(response.data);
    if (!downloadLink) {
      return res.status(500).json({ error: "Failed to extract download link" });
    }

    // Respond with the extracted download link
    res.status(200).json({
      success: true,
      text,
      background,
      download_link: downloadLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
