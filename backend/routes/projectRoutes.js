const express = require("express");
const router = express.Router();
const {
    generateProject

} = require("../controllers/projectController");
router.post("/generate", generateProject);
module.exports = router;