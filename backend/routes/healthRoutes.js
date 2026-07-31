const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        message: "Render Backend Server is awake and healthy"
    });
});

router.get("/ping", (req, res) => {
    res.status(200).json({ status: "ok", message: "pong" });
});

module.exports = router;
