const savedProjects = document.getElementById("savedProjects");

async function loadProjects() {

    savedProjects.innerHTML = `
        <div class="placeholder-state" style="grid-column: 1 / -1;">
            <div class="placeholder-icon">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <h3>Loading Saved Projects...</h3>
            <p>Fetching data from database.</p>
        </div>
    `;

    try {

        // apiClient automatically adds JWT header if user is logged in
        const response = await window.apiClient("/api/projects/all");

        const data = await response.json();

        // 401 with requiresAuth — apiClient already opened the login modal
        if (response.status === 401 && data.requiresAuth) {
            savedProjects.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1;">
                    <div class="placeholder-icon"><i class="fa-solid fa-lock"></i></div>
                    <h3>Login Required</h3>
                    <p>${data.message || "Please login to view your saved projects."}</p>
                    <button class="modal-submit-btn" style="margin-top:16px;max-width:220px;"
                            onclick="AuthManager.openModal('loginModal')">
                        <i class="fa-solid fa-right-to-bracket"></i> Login
                    </button>
                </div>
            `;
            return;
        }

        if (!data.success) {
            savedProjects.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1;">
                    <div class="placeholder-icon"><i class="fa-solid fa-folder-open"></i></div>
                    <h3>No Projects Found</h3>
                    <p>Failed to retrieve saved projects.</p>
                </div>
            `;
            return;
        }

        if (data.projects.length === 0) {
            savedProjects.innerHTML = `
                <div class="placeholder-state" style="grid-column: 1 / -1;">
                    <div class="placeholder-icon"><i class="fa-solid fa-folder-plus"></i></div>
                    <h3>No Saved Projects Yet</h3>
                    <p>Generate a project idea on the homepage and save it to view it here.</p>
                </div>
            `;
            return;
        }

        let html = "";

        data.projects.forEach(project => {
            const diffClass = (project.difficulty || '').toLowerCase() === 'hard'   ? 'diff-hard' :
                             (project.difficulty || '').toLowerCase() === 'medium' ? 'diff-medium' : 'diff-easy';

            html += `
            <div class="project-card">

                <div>
                    <h2><i class="fa-solid fa-code"></i> ${project.language} Project</h2>

                    <div class="project-meta-badge">
                        <span class="meta-chip"><i class="fa-solid fa-user-graduate"></i> ${project.experience}</span>
                        <span class="meta-chip ${diffClass}"><i class="fa-solid fa-gauge-high"></i> ${project.difficulty}</span>
                    </div>

                    <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
                        <strong><i class="fa-solid fa-layer-group"></i> Skills:</strong> ${project.skills}
                    </p>

                    <details>
                        <summary>
                            <i class="fa-solid fa-eye"></i> View Generated Details
                        </summary>
                        <pre style="white-space:pre-wrap;">${project.project}</pre>
                    </details>
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteProject(${project.id})"
                >
                    <i class="fa-solid fa-trash-can"></i> Delete Project
                </button>

            </div>
            `;
        });

        savedProjects.innerHTML = html;

    } catch (error) {

        console.error("Saved Projects Error:", error);

        savedProjects.innerHTML = `
            <div class="placeholder-state" style="grid-column: 1 / -1;">
                <div class="placeholder-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h3>Server Error</h3>
                <p>${error.message}</p>
            </div>
        `;

    }

}

async function deleteProject(id) {

    const confirmDelete = confirm("Delete this project?");
    if (!confirmDelete) return;

    try {

        // apiClient adds JWT header automatically; requireAuth on backend will block if not logged in
        const response = await window.apiClient(`/api/projects/delete/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (data.success) {
            if (window.Toast) {
                Toast.success(data.message || "Project Deleted Successfully");
            } else {
                alert(data.message);
            }
            loadProjects();
        } else if (!data.requiresAuth) {
            // requiresAuth case is handled by apiClient already (opens login modal)
            if (window.Toast) {
                Toast.error(data.message || "Could not delete project.");
            } else {
                alert(data.message);
            }
        }

    } catch (error) {
        console.error("Delete Error:", error);
        savedProjects.innerHTML = `
            <div class="placeholder-state" style="grid-column: 1 / -1;">
                <h3>Server Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }

}

// Load projects on page init
loadProjects();