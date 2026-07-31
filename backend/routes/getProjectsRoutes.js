const express = require("express");
const router = express.Router();
const { getProjects } = require("../controllers/getProjectsController");
const { optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getProjects);

module.exports = router;