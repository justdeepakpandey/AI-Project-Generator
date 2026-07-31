const ProjectModel = require("../models/projectModel");

/**
 * DELETE /api/projects/delete/:id
 * Requires authentication (requireAuth applied at route level).
 * Deletes only if the project belongs to the requesting user.
 */
const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // requireAuth guarantees this exists

        const deleted = await ProjectModel.deleteProject(id, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you do not have permission to delete it."
            });
        }

        res.json({
            success: true,
            message: "Project Deleted Successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "Database error while deleting project."
        });
    }
};

module.exports = { deleteProject };