const db = require("../config/db");

const deleteProject = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM projects WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        res.json({
            success: true,
            message: "Project Deleted Successfully"
        });

    });

};

module.exports = {
    deleteProject
};