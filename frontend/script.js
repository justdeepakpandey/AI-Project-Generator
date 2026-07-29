const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const saveBtn = document.getElementById("saveBtn");

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
            <div class="placeholder-icon"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3>Forging Project Idea...</h3>
            <p>Asking Google Gemini AI to craft your custom project spec.</p>
        </div>
    `;
    saveBtn.style.display = "none";

    try {

        const response = await fetch("http://localhost:5000/api/projects/generate", {

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
                <div class="placeholder-state" style="border-color: rgba(239, 68, 68, 0.3);">
                    <div class="placeholder-icon" style="color: var(--danger);"><i class="fa-solid fa-circle-exclamation"></i></div>
                    <h3 style="color: var(--danger);">Generation Failed</h3>
                    <p>${data.message}</p>
                </div>
            `;

            return;
        }

        currentProject = data.project;

        result.innerHTML = `
            <div class="generated-content-box">
                <pre style="white-space:pre-wrap;">${data.project}</pre>
            </div>
        `;

        saveBtn.style.display = "flex";

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="placeholder-state" style="border-color: rgba(239, 68, 68, 0.3);">
                <div class="placeholder-icon" style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h3 style="color: var(--danger);">Server Connection Error</h3>
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

        const response = await fetch("http://localhost:5000/api/save", {

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

    }

    catch (error) {

        console.log(error);

        alert("Unable to Save Project.");

    }

});