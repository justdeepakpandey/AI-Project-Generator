const { generateProjectIdea } = require("../services/geminiService");

const generateProject = async (req, res) => {
    console.log("Generate API Hit");

    try {

        const { language, experience, difficulty, skills } = req.body;

        const project = await generateProjectIdea(
            language,
            experience,
            difficulty,
            skills
        );

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    generateProject
};