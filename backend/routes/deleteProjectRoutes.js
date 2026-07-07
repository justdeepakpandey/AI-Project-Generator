const express = require("express");

const router = express.Router();

const { deleteProject } = require("../controllers/deleteProjectController");

router.delete("/:id", deleteProject);

module.exports = router;