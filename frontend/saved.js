const savedProjects = document.getElementById("savedProjects");

async function loadProjects() {

    savedProjects.innerHTML = "<h3>Loading...</h3>";

    try {

        const response = await fetch("http://localhost:5000/api/projects/all");

        const data = await response.json();

        if (!data.success) {

            savedProjects.innerHTML = "<h3>No Projects Found</h3>";

            return;

        }

        if (data.projects.length === 0) {

            savedProjects.innerHTML = "<h3>No Saved Projects</h3>";

            return;

        }

        let html = "";

        data.projects.forEach(project => {

            html += `

            <div class="project-card">

                <h2>${project.language} Project</h2>

                <p><strong>Experience :</strong> ${project.experience}</p>

                <p><strong>Difficulty :</strong> ${project.difficulty}</p>

                <p><strong>Skills :</strong> ${project.skills}</p>

                <details style="margin-top:15px;">

                    <summary style="cursor:pointer;font-weight:bold;">
                        👁 View Generated Project
                    </summary>

                    <pre style="white-space:pre-wrap;margin-top:15px;">
${project.project}
                    </pre>

                </details>

                <button
                    onclick="deleteProject(${project.id})"
                    style="
                        margin-top:20px;
                        width:100%;
                        padding:12px;
                        background:#ff4d4d;
                        color:white;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >

                    🗑 Delete Project

                </button>

            </div>

            `;

        });

        savedProjects.innerHTML = html;

    }

    catch (error) {

        console.log(error);

        savedProjects.innerHTML = "<h3>Server Error</h3>";

    }

}

async function deleteProject(id) {

    const confirmDelete = confirm("Delete this project?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(

            `http://localhost:5000/api/projects/delete/${id}`,

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        alert(data.message);

        loadProjects();

    }

    catch (error) {

        console.log(error);

        alert("Unable to Delete.");

    }

}

loadProjects();