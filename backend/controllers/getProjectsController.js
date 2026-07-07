const db = require("../config/db");

const getProjects = (req, res) => {

    const sql = "SELECT * FROM projects ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        res.json({
            success: true,
            projects: result
        });

    });

};

module.exports = {
    getProjects
};