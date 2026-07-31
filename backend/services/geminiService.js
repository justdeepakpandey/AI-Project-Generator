console.log("geminiService loaded");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateProjectIdea = async (language, experience, difficulty, skills) => {

    const prompt = `Your prompt here`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;

    } catch (err) {
        console.error("FULL ERROR:");
        console.error(err);
        throw err;
    }
};

module.exports = {
    generateProjectIdea
};