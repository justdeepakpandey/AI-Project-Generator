/**
 * Toast Notification System for ProjectForge AI
 */

const Toast = {
    init() {
        if (!document.getElementById("toast-container")) {
            const container = document.createElement("div");
            container.id = "toast-container";
            container.className = "toast-container";
            document.body.appendChild(container);
        }
    },

    show(message, type = "info", duration = 4000) {
        this.init();
        const container = document.getElementById("toast-container");

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const icons = {
            success: "fa-solid fa-circle-check",
            error: "fa-solid fa-circle-exclamation",
            warning: "fa-solid fa-triangle-exclamation",
            info: "fa-solid fa-circle-info"
        };

        const iconClass = icons[type] || icons.info;

        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconClass}"></i></div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add("toast-show");
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove("toast-show");
            toast.addEventListener("transitionend", () => {
                if (toast.parentElement) toast.remove();
            });
        }, duration);
    },

    success(message, duration) {
        this.show(message, "success", duration);
    },

    error(message, duration) {
        this.show(message, "error", duration);
    },

    warning(message, duration) {
        this.show(message, "warning", duration);
    },

    info(message, duration) {
        this.show(message, "info", duration);
    }
};

window.Toast = Toast;
