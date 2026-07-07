const db = require("../config/db");

const saveProject = (req, res) => {

    const {
        language,
        experience,
        difficulty,
        skills,
        project
    } = req.body;

    const sql = `
        INSERT INTO projects
        (language, experience, difficulty, skills, project)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [language, experience, difficulty, skills, project],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                message: "Project Saved Successfully"
            });

        }
    );

};

module.exports = {
    saveProject
};