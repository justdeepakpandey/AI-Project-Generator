const express = require("express");
const router = express.Router();
const { saveProject } = require("../controllers/saveController");
const { optionalAuth } = require("../middleware/authMiddleware");

// optionalAuth: attaches req.user if token present, passes through regardless
// saveController checks req.user and gates accordingly
router.post("/", optionalAuth, saveProject);

module.exports = router;