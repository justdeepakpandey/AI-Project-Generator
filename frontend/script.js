const generateBtn = document.getElementById("generateBtn");
const result      = document.getElementById("result");
const saveBtn     = document.getElementById("saveBtn");

let currentProject = "";

// ── Generate Project ──────────────────────────────────────────────────────────

generateBtn.addEventListener("click", async function () {

    const language   = document.getElementById("language").value;
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;
    const skills     = document.getElementById("skills").value;

    if (
        language   === "" ||
        experience === "" ||
        difficulty === "" ||
        skills.trim() === ""
    ) {
        if (window.Toast) {
            Toast.warning("Please fill in all fields.");
        } else {
            alert("Please fill all fields.");
        }
        return;
    }

    result.innerHTML = `
        <div class="placeholder-state">
            <div class="placeholder-icon">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <h3>Forging Project Idea…</h3>
            <p>Asking Google Gemini AI to craft your custom project spec.</p>
        </div>
    `;

    saveBtn.style.display = "none";
    currentProject = "";

    try {

        // wakeBackend: true — shows cold-start overlay + uses 90s timeout
        const response = await window.apiClient("/api/projects/generate", {
            method: "POST",
            wakeBackend: true,
            body: JSON.stringify({ language, experience, difficulty, skills })
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

// ── Save Project ──────────────────────────────────────────────────────────────

saveBtn.addEventListener("click", async function () {

    // Guest check — if not logged in, open login prompt modal instead of saving
    if (window.AuthManager && !window.AuthManager.isLoggedIn()) {
        window.AuthManager.showLoginPrompt("Please login or create a free account to save your projects.");
        return;
    }

    const language   = document.getElementById("language").value;
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;
    const skills     = document.getElementById("skills").value;

    try {

        const response = await window.apiClient("/api/save", {
            method: "POST",
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
            if (window.Toast) {
                Toast.success("Project Saved Successfully ✅");
            } else {
                alert("Project Saved Successfully ✅");
            }
        } else {
            // 401 with requiresAuth is handled automatically by apiClient
            // Only show error for non-auth failures
            if (!data.requiresAuth) {
                if (window.Toast) {
                    Toast.error(data.message || "Unable to save project.");
                } else {
                    alert(data.message);
                }
            }
        }

    } catch (error) {

        console.error(error);
        if (window.Toast) {
            Toast.error("Unable to Save Project.");
        } else {
            alert("Unable to Save Project.");
        }

    }

});