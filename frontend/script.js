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

    result.innerHTML = "<h3>Generating Project...</h3>";
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
                <h3>Error</h3>
                <p>${data.message}</p>
            `;

            return;
        }

        currentProject = data.project;

        result.innerHTML = `
            <pre style="white-space:pre-wrap;">${data.project}</pre>
        `;

        saveBtn.style.display = "block";

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `
            <h3>Server Error</h3>
            <p>${error.message}</p>
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