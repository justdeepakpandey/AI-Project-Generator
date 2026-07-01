const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/generate", (req, res) => {

    const { language, experience, difficulty, skills } = req.body;

    res.json({

        projectName: `${language} Project`,

        description: `A ${difficulty} level ${language} project for ${experience} developers.`,

        skills

    });

});

app.listen(5000, () => {

    console.log("Server running on port 5000");

});