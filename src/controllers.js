const axios = require("axios");
const { extractDownloadLink } = require("./helpers");

exports.generateEffect = async (req, res) => {
  const { text, background } = req.body;

  if (!text || !background) {
    return res.status(400).json({ error: "Text and background are required" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("text[]", text);
    formData.append("radio0[radio]", background);
    formData.append("token", "da350dfbad6903a02bd78d6e461ff942");
    formData.append("build_server", "https://e1.yotools.net");
    formData.append("build_server_id", "2");
    formData.append("submit", "GO");

    const response = await axios.post(
      "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const downloadLink = extractDownloadLink(response.data);
    if (!downloadLink) {
      return res.status(500).json({ error: "Failed to extract download link" });
    }

    res.status(200).json({ download_link: downloadLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
