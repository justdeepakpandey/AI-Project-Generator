const express = require("express");

const router = express.Router();

const { getProjects } = require("../controllers/getProjectsController");

router.get("/", getProjects);

module.exports = router;