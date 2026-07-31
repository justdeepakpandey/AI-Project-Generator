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

        console.error("Generate Error:", error.message);

        // Map Gemini API errors to clean, readable messages
        let message = error.message || "An unexpected error occurred.";

        if (
            message.includes("API_KEY_INVALID") ||
            message.includes("API key not valid") ||
            message.includes("INVALID_ARGUMENT")
        ) {
            message =
                "❌ Invalid Gemini API Key — The GEMINI_API_KEY in your .env is missing or incorrect. " +
                "Get a free key at https://aistudio.google.com/apikey and paste it in backend/.env as GEMINI_API_KEY=AIzaSy...";
        } else if (
            message.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
            message.includes("UNAUTHENTICATED")
        ) {
            message =
                "❌ Wrong credential type — Your GEMINI_API_KEY looks like a Google OAuth token (starts with AQ.), " +
                "not a Gemini API key. Get a real key at https://aistudio.google.com/apikey";
        } else if (message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
            message = "⚠️ Gemini API quota exceeded. Please wait a minute and try again.";
        } else if (message.includes("PERMISSION_DENIED")) {
            message = "❌ API key does not have permission to use Gemini. Check your key at https://aistudio.google.com/apikey";
        }

        res.status(500).json({
            success: false,
            message
        });

    }

};

module.exports = {
    generateProject
};