const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateProjectIdea(language, experience, difficulty, skills) {

    const prompt = `
Generate one software project idea.

Programming Language: ${language}
Experience: ${experience}
Difficulty: ${difficulty}
Skills: ${skills}

Return the response in this format:

Project Name:
Description:
Features:
Tech Stack:
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;

}

module.exports = {
    generateProjectIdea
};