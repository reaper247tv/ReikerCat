const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const router = express.Router();

// Utility function to upload an image to Catbox
const uploadToCatbox = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", fs.createReadStream(filePath));

    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: formData.getHeaders(),
    });

    // Response from Catbox contains the hosted image URL
    if (response.status === 200) {
      return response.data.trim(); // Return the Catbox URL
    } else {
      throw new Error("Failed to upload image to Catbox.");
    }
  } catch (error) {
    console.error("Error uploading to Catbox:", error.message);
    throw error;
  }
};

// Utility function to generate text effects and upload to Catbox
const textMaker = async (effect_url, text, background = null) => {
  try {
    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("text[]", text); // Input text
    if (background) formData.append("radio0[radio]", background); // Optional background
    formData.append("token", "da350dfbad6903a02bd78d6e461ff942");
    formData.append("build_server", "https://e1.yotools.net");
    formData.append("build_server_id", "2");
    formData.append("submit", "GO");

    // Send the POST request to the effect URL
    const response = await axios.post(effect_url, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        Referer: effect_url,
      },
      responseType: "arraybuffer", // Ensure we get the image as a buffer
    });

    // Save the image to the server temporarily
    const fileName = `generated_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, "images", fileName);
    fs.writeFileSync(filePath, response.data);

    // Upload the image to Catbox
    const catboxUrl = await uploadToCatbox(filePath);

    // Remove the temporary image file
    fs.unlinkSync(filePath);

    return { status: true, url: catboxUrl }; // Return the Catbox URL
  } catch (error) {
    console.error("Error in textMaker:", error.message);
    return { status: false, error: error.message };
  }
};

// Route handler to dynamically generate effects
router.get("/generate-effect", async (req, res) => {
  try {
    const { text, effect, background } = req.query;

    // Validate input
    if (!text || !effect) {
      return res.status(400).json({ error: "Text and effect are required" });
    }

    // Define effect URLs
    const effectUrls = {
      sed: "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
      steel: "https://en.ephoto360.com/steel-text-effect-66.html",
      metallic: "https://textpro.me/create-a-metallic-text-effect-free-online-1041.html",
      glitch: "https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html",
      burn: "https://photooxy.com/logo-and-text-effects/write-text-on-burn-paper-388.html",
      "8bit": "https://photooxy.com/logo-and-text-effects/8-bit-text-on-arcade-rift-175.html",
    };

    // Validate the effect type
    const effect_url = effectUrls[effect.toLowerCase()];
    if (!effect_url) {
      return res.status(400).json({ error: "Invalid effect type" });
    }

    // Generate the effect and fetch the hosted download link
    const { status, url, error } = await textMaker(effect_url, text, background);
    if (status && url) {
      return res.status(200).json({ success: true, text, effect, download_link: url });
    } else {
      return res.status(500).json({ error: "Failed to generate effect", details: error });
    }
  } catch (error) {
    console.error("Error in /generate-effect route:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
