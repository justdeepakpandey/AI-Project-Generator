const ProjectModel = require("../models/projectModel");

/**
 * POST /api/save
 * Requires authentication (optionalAuth applied at route level).
 * Guests receive 401 with requiresAuth: true → frontend shows login modal.
 * Logged-in users save with their user_id for full isolation.
 */
const saveProject = async (req, res) => {
    try {
        const { language, experience, difficulty, skills, project } = req.body;

        if (!language || !experience || !difficulty || !skills || !project) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to save a project."
            });
        }

        // Guest — prompt login
        if (!req.user) {
            return res.status(401).json({
                success: false,
                requiresAuth: true,
                message: "Please login or create a free account to save projects."
            });
        }

        await ProjectModel.saveProject({
            userId: req.user.id,
            language,
            experience,
            difficulty,
            skills,
            project
        });

        res.json({
            success: true,
            message: "Project Saved Successfully ✅"
        });

    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({
            success: false,
            message: "Database error while saving project."
        });
    }
};

module.exports = { saveProject };