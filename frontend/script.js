const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const saveBtn = document.getElementById("saveBtn");

const API_URL = "https://ai-project-generator-1-7qz8.onrender.com";

let currentProject = "";

generateBtn.addEventListener("click", async function () {

    const language = document.getElementById("language").value;
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;
    const skills = document.getElementById("skills").value;

    if (
        language === "" ||
        experience === "" ||
        difficulty === "" ||
        skills.trim() === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    result.innerHTML = `
        <div class="placeholder-state">
            <div class="placeholder-icon">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <h3>Forging Project Idea...</h3>
            <p>Asking Google Gemini AI to craft your custom project spec.</p>
        </div>
    `;

    saveBtn.style.display = "none";

    try {

        const response = await fetch(`${API_URL}/api/projects/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language,
                experience,
                difficulty,
                skills
            })
        });

        const data = await response.json();

        console.log(data);

        if (!data.success) {

            result.innerHTML = `
                <div class="placeholder-state">
                    <h3>Generation Failed</h3>
                    <p>${data.message}</p>
                </div>
            `;

            return;
        }

        currentProject = data.project;

        result.innerHTML = `
            <div class="generated-content-box">
                <pre style="white-space: pre-wrap;">${data.project}</pre>
            </div>
        `;

        saveBtn.style.display = "flex";

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="placeholder-state">
                <h3>Server Connection Error</h3>
                <p>${error.message}</p>
            </div>
        `;

    }

});

saveBtn.addEventListener("click", async function () {

    const language = document.getElementById("language").value;
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;
    const skills = document.getElementById("skills").value;

    try {

        const response = await fetch(`${API_URL}/api/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language,
                experience,
                difficulty,
                skills,
                project: currentProject
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Project Saved Successfully ✅");
        } else {
            alert(data.message);
        }

    } catch (error) {

        console.error(error);
        alert("Unable to Save Project.");

    }

});