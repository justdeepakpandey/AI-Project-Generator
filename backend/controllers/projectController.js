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

        return res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        console.error("FULL ERROR OBJECT:");
        console.error(error);

        console.error("ERROR MESSAGE:");
        console.error(error.message);

        console.error("ERROR CAUSE:");
        console.error(error.cause);

        console.error("ERROR STACK:");
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateProject
};