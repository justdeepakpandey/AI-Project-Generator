require("dotenv").config();
console.log("Current Directory:", process.cwd());
console.log("Gemini Key prefix :", (process.env.GEMINI_API_KEY || "").substring(0, 6) || "⚠️  MISSING — update .env!");
require("./config/db");

const express = require("express");
const corsMiddleware = require("./config/corsConfig");

const projectRoutes       = require("./routes/projectRoutes");
const saveRoutes          = require("./routes/saveRoutes");
const getProjectsRoutes   = require("./routes/getProjectsRoutes");
const deleteProjectRoutes = require("./routes/deleteProjectRoutes");
const authRoutes          = require("./routes/authRoutes");
const healthRoutes        = require("./routes/healthRoutes");
const errorHandler        = require("./middleware/errorHandler");

const app = express();

// Use the configured CORS middleware (allows Vercel + local origins)
app.use(corsMiddleware);
app.use(express.json());

// Health check — Render cold-start ping, keep alive
app.use("/", healthRoutes);

// Auth routes (register, login, google, me, forgot/reset password)
app.use("/api/auth", authRoutes);

// Core project routes — paths unchanged so existing frontend still works
app.use("/api/projects",        projectRoutes);       // POST /api/projects/generate
app.use("/api/save",            saveRoutes);          // POST /api/save
app.use("/api/projects/all",    getProjectsRoutes);   // GET  /api/projects/all
app.use("/api/projects/delete", deleteProjectRoutes); // DELETE /api/projects/delete/:id

// Root welcome route
app.get("/", (req, res) => {
    res.json({ success: true, message: "ProjectForge AI Backend is Running 🚀" });
});

// Global error handler (must be LAST middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});