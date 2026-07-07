const express = require("express");

const router = express.Router();

const { saveProject } = require("../controllers/saveController");

router.post("/", saveProject);

module.exports = router;