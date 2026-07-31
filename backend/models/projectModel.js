const db = require("../config/db");

class ProjectModel {
    static async saveProject({ userId, language, experience, difficulty, skills, project }) {
        const [result] = await db.query(
            `INSERT INTO projects (user_id, language, experience, difficulty, skills, project)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId || null, language, experience, difficulty, skills, project]
        );
        return result.insertId;
    }

    static async getProjectsByUser(userId) {
        // If user ID is provided, query by user_id; if user_id column doesn't exist yet, fallback query gracefully
        try {
            if (userId) {
                const [rows] = await db.query(
                    "SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC",
                    [userId]
                );
                return rows;
            } else {
                const [rows] = await db.query(
                    "SELECT * FROM projects WHERE user_id IS NULL ORDER BY id DESC"
                );
                return rows;
            }
        } catch (err) {
            // Fallback for legacy tables prior to migration
            const [rows] = await db.query("SELECT * FROM projects ORDER BY id DESC");
            return rows;
        }
    }

    static async deleteProject(id, userId) {
        try {
            if (userId) {
                const [result] = await db.query(
                    "DELETE FROM projects WHERE id = ? AND (user_id = ? OR user_id IS NULL)",
                    [id, userId]
                );
                return result.affectedRows > 0;
            } else {
                const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);
                return result.affectedRows > 0;
            }
        } catch (err) {
            const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);
            return result.affectedRows > 0;
        }
    }
}

module.exports = ProjectModel;
