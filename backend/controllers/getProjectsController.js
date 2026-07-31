const ProjectModel = require("../models/projectModel");

/**
 * GET /api/projects/all
 * Requires authentication (optionalAuth applied at route level).
 * Guests receive 401 with requiresAuth: true → frontend shows login modal.
 * Logged-in users see only their own saved projects.
 */
const getProjects = async (req, res) => {
    try {
        // Guest — prompt login
        if (!req.user) {
            return res.status(401).json({
                success: false,
                requiresAuth: true,
                message: "Please login to view your saved projects."
            });
        }

        const projects = await ProjectModel.getProjectsByUser(req.user.id);

        res.json({
            success: true,
            projects
        });

    } catch (error) {
        console.error("Get Projects Error:", error);
        res.status(500).json({
            success: false,
            message: "Database error while fetching projects."
        });
    }
};

module.exports = { getProjects };