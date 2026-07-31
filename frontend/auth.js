/**
 * Auth Manager & UI Controller for ProjectForge AI
 */

const AuthManager = {
    user: null,

    init() {
        this.loadUserFromStorage();
        this.renderNavbarAuthUI();
        this.initThemeToggle();
        this.bindEvents();
    },

    loadUserFromStorage() {
        const storedUser = localStorage.getItem("pf_user");
        const token = localStorage.getItem("pf_auth_token");
        if (storedUser && token) {
            try {
                this.user = JSON.parse(storedUser);
            } catch (e) {
                this.clearSession();
            }
        } else {
            this.user = null;
        }
    },

    saveSession(token, user, remember = true) {
        this.user = user;
        if (remember) {
            localStorage.setItem("pf_auth_token", token);
            localStorage.setItem("pf_user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("pf_auth_token", token);
            sessionStorage.setItem("pf_user", JSON.stringify(user));
            localStorage.setItem("pf_auth_token", token);
            localStorage.setItem("pf_user", JSON.stringify(user));
        }
        this.renderNavbarAuthUI();
    },

    logout() {
        this.clearSession();
        this.renderNavbarAuthUI();
        if (window.Toast) Toast.info("Logged out successfully.");

        if (window.location.pathname.includes("saved.html")) {
            window.location.reload();
        }
    },

    clearSession() {
        this.user = null;
        localStorage.removeItem("pf_auth_token");
        localStorage.removeItem("pf_user");
        sessionStorage.removeItem("pf_auth_token");
        sessionStorage.removeItem("pf_user");
    },

    isLoggedIn() {
        return !!this.user && !!localStorage.getItem("pf_auth_token");
    },

    renderNavbarAuthUI() {
        const authContainer = document.getElementById("navbar-auth-container");
        if (!authContainer) return;

        if (this.isLoggedIn()) {
            const initial = this.user && this.user.name ? this.user.name.charAt(0).toUpperCase() : "U";
            const userName = this.user ? this.user.name : "User";
            const userEmail = this.user ? this.user.email : "";
            const provider = this.user ? this.user.provider : "local";

            authContainer.innerHTML = `
                <div class="profile-dropdown-wrapper">
                    <button class="profile-btn" id="profileBtn" onclick="AuthManager.toggleDropdown()">
                        <div class="user-avatar">${initial}</div>
                        <span class="user-name-text">${escapeHtml(userName)}</span>
                        <i class="fa-solid fa-chevron-down arrow-icon"></i>
                    </button>

                    <div class="profile-dropdown-menu" id="profileDropdown">
                        <div class="dropdown-header">
                            <strong>${escapeHtml(userName)}</strong>
                            <span class="dropdown-email">${escapeHtml(userEmail)}</span>
                            <span class="badge-provider"><i class="${provider === 'google' ? 'fa-brands fa-google' : 'fa-solid fa-user-check'}"></i> ${provider === 'google' ? 'Google Sign-In' : 'Email Account'}</span>
                        </div>
                        <hr class="dropdown-divider">
                        <a href="saved.html" class="dropdown-item"><i class="fa-solid fa-bookmark"></i> Saved Projects</a>
                        <a href="about.html" class="dropdown-item"><i class="fa-solid fa-circle-info"></i> About System</a>
                        <hr class="dropdown-divider">
                        <button class="dropdown-item logout-item" onclick="AuthManager.logout()">
                            <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="auth-btn-group">
                    <button class="guest-badge-btn" onclick="AuthManager.openModal('loginModal')" title="Continue as Guest — Generate projects freely">
                        <i class="fa-solid fa-user-ninja"></i> Guest Mode
                    </button>
                    <button class="btn-secondary-sm" onclick="AuthManager.openModal('loginModal')">
                        <i class="fa-solid fa-right-to-bracket"></i> Login
                    </button>
                    <button class="btn-primary-sm" onclick="AuthManager.openModal('registerModal')">
                        <i class="fa-solid fa-user-plus"></i> Sign Up
                    </button>
                </div>
            `;
        }
    },

    toggleDropdown() {
        const dropdown = document.getElementById("profileDropdown");
        if (dropdown) {
            dropdown.classList.toggle("show");
        }
    },

    openModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            // Focus first input
            setTimeout(() => {
                const input = modal.querySelector("input");
                if (input) input.focus();
            }, 100);
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    },

    closeAllModals() {
        document.querySelectorAll(".modal-overlay").forEach(m => m.style.display = "none");
        document.body.style.overflow = "";
    },

    switchModal(fromId, toId) {
        this.closeModal(fromId);
        this.openModal(toId);
    },

    showLoginPrompt(customMessage) {
        const modalText = document.getElementById("guest-save-msg");
        if (modalText && customMessage) {
            modalText.textContent = customMessage;
        } else if (modalText) {
            modalText.textContent = "Please login to save projects.";
        }
        this.openModal("guestSaveModal");
    },

    initThemeToggle() {
        const currentTheme = localStorage.getItem("pf_theme") || "dark";
        document.documentElement.setAttribute("data-theme", currentTheme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("pf_theme", newTheme);
        if (window.Toast) Toast.info(`Switched to ${newTheme} theme.`);
    },

    // ── Login form handler ────────────────────────────────────────────────
    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector("#loginSubmitBtn");
        const email = (form.querySelector("#loginEmail").value || "").trim();
        const password = form.querySelector("#loginPassword").value || "";
        const remember = form.querySelector("#rememberMe") ? form.querySelector("#rememberMe").checked : true;

        if (!email || !password) {
            if (window.Toast) Toast.warning("Please enter your email and password.");
            return;
        }

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';
        btn.disabled = true;

        try {
            const res = await window.apiClient("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                this.saveSession(data.token, data.user, remember);
                this.closeAllModals();
                if (window.Toast) Toast.success(`Welcome back, ${data.user.name}! 👋`);
                form.reset();
                // Reload saved page after login to show user's projects
                if (window.location.pathname.includes("saved.html")) {
                    if (typeof loadProjects === "function") loadProjects();
                }
            } else {
                if (window.Toast) Toast.error(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            if (window.Toast) Toast.error("Connection error. Please try again.");
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    },

    // ── Register form handler ─────────────────────────────────────────────
    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector("#registerSubmitBtn");
        const name     = (form.querySelector("#registerName").value || "").trim();
        const email    = (form.querySelector("#registerEmail").value || "").trim();
        const password = form.querySelector("#registerPassword").value || "";

        if (!name || !email || !password) {
            if (window.Toast) Toast.warning("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            if (window.Toast) Toast.warning("Password must be at least 6 characters.");
            return;
        }

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account…';
        btn.disabled = true;

        try {
            const res = await window.apiClient("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                this.saveSession(data.token, data.user, true);
                this.closeAllModals();
                if (window.Toast) Toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
                form.reset();
            } else {
                if (window.Toast) Toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Register error:", err);
            if (window.Toast) Toast.error("Connection error. Please try again.");
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    },

    // ── Google Sign-In ────────────────────────────────────────────────────
    async handleGoogleCredentialResponse(response) {
        try {
            const res = await window.apiClient("/api/auth/google", {
                method: "POST",
                body: JSON.stringify({ credential: response.credential })
            });
            const data = await res.json();
            if (data.success) {
                this.saveSession(data.token, data.user);
                this.closeAllModals();
                if (window.Toast) Toast.success(`Welcome, ${data.user.name}! 🎉`);
            } else {
                if (window.Toast) Toast.error(data.message);
            }
        } catch (err) {
            if (window.Toast) Toast.error("Google login failed. Please use email login.");
        }
    },

    triggerGoogleSignIn() {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt();
        } else {
            if (window.Toast) Toast.info("Google Login is not configured for this deployment. Please use email login.");
        }
    },

    // ── Global event bindings ─────────────────────────────────────────────
    bindEvents() {
        // Close profile dropdown on outside click
        window.addEventListener("click", (e) => {
            if (!e.target.closest(".profile-dropdown-wrapper")) {
                const dropdown = document.getElementById("profileDropdown");
                if (dropdown) dropdown.classList.remove("show");
            }
        });

        // Close modal when clicking backdrop
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal-overlay")) {
                this.closeAllModals();
            }
        });

        // Close modal on Escape key
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.closeAllModals();
        });

        // Form submit delegation — handles both pages
        document.addEventListener("submit", (e) => {
            if (e.target && e.target.id === "loginForm")    this.handleLogin(e);
            if (e.target && e.target.id === "registerForm") this.handleRegister(e);
        });
    }
};

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

// Make global callback for Google GSI
window.handleGoogleCredentialResponse = (r) => AuthManager.handleGoogleCredentialResponse(r);

window.AuthManager = AuthManager;
document.addEventListener("DOMContentLoaded", () => {
    AuthManager.init();
});
