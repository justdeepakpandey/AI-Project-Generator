const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", function () {

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
        <h2>${language} Project</h2>

        <p><strong>Experience:</strong> ${experience}</p>

        <p><strong>Difficulty:</strong> ${difficulty}</p>

        <p><strong>Skills:</strong> ${skills}</p>

        <hr>

        <p>This is a sample project preview.</p>
    `;
});