// Helper function to extract the download link from the response HTML
exports.extractDownloadLink = (html) => {
    const match = html.match(/href="(https:\/\/[^"]+\.jpg)"/);
    return match ? match[1] : null;
  };
  