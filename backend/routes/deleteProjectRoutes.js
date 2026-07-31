const express = require("express");
const router = express.Router();
const { deleteProject } = require("../controllers/deleteProjectController");
const { requireAuth } = require("../middleware/authMiddleware");

// requireAuth: hard blocks unauthenticated requests with 401
router.delete("/:id", requireAuth, deleteProject);

module.exports = router;