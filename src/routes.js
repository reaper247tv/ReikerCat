const express = require("express");
const { generateEffect } = require("./controllers");

const router = express.Router();

// Route for generating the effect
router.post("/generate-effect", generateEffect);

module.exports = router;
