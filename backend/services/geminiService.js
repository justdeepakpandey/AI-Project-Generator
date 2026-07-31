console.log("geminiService loaded");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateProjectIdea = async (language, experience, difficulty, skills) => {

    const prompt = `
Generate one software project idea based on the following details.

Programming Language: ${language}
Experience Level: ${experience}
Difficulty: ${difficulty}
Skills: ${skills}

Return ONLY in this format:

Project Title:
Description:
Features:
Tech Stack:
Estimated Time:
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
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