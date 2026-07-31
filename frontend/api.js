/**
 * API Client — ProjectForge AI
 *
 * Design:
 * - Normal API calls (auth, save, delete, history) use direct fetch — NO cold-start overlay.
 * - Only Generate Project passes { wakeBackend: true } which shows the overlay.
 * - Render Free Tier cold-start (30-60s) is handled ONLY for Generate.
 */

const API_BASE_URL = (function () {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:5000";
    }
    return "https://ai-project-generator-1-7qz8.onrender.com";
})();

// ─── Wakeup overlay (only used during Generate) ──────────────────────────────

let _overlayEl = null;

function _getOverlay() {
    if (_overlayEl) return _overlayEl;
    _overlayEl = document.createElement("div");
    _overlayEl.id = "serverWakeupOverlay";
    _overlayEl.style.cssText = [
        "display:none",
        "position:fixed",
        "inset:0",
        "z-index:99999",
        "background:rgba(0,0,0,0.75)",
        "align-items:center",
        "justify-content:center",
        "flex-direction:column",
        "gap:14px",
        "font-family:inherit",
        "color:#fff"
    ].join(";");
    _overlayEl.innerHTML = `
        <div style="font-size:2.5rem;animation:spin 1.2s linear infinite">⚙️</div>
        <div style="font-size:1.1rem;font-weight:600">Starting backend server…</div>
        <div id="wakeupStatusText" style="font-size:0.9rem;opacity:0.7">Render free tier is waking up. Please wait.</div>
    `;
    document.body.appendChild(_overlayEl);
    return _overlayEl;
}

function _showOverlay(msg) {
    const el = _getOverlay();
    el.style.display = "flex";
    const status = el.querySelector("#wakeupStatusText");
    if (status && msg) status.textContent = msg;
}

function _hideOverlay() {
    if (_overlayEl) _overlayEl.style.display = "none";
}

// ─── Simple fetch helpers ─────────────────────────────────────────────────────

/**
 * Direct fetch — no overlay, no retry, used for all non-generate calls.
 * Timeout: 30s (enough for a warm backend response).
 */
async function _directFetch(url, options = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Wake fetch — used ONLY for Generate Project.
 * Shows overlay, waits up to 120s for Render cold-start, then makes the real call.
 */
async function _wakeAndFetch(url, options = {}) {
    // 1. Ping health with a long timeout (mirrors opening Render URL in browser)
    _showOverlay("Connecting to backend…");
    try {
        const pingRes = await _directFetch(`${API_BASE_URL}/health`, {}, 120000);
        if (pingRes.ok) {
            _hideOverlay();
        } else {
            _showOverlay("Backend responded but returned an error. Trying anyway…");
        }
    } catch (_) {
        // Ping failed — backend may still come up; proceed with the real call
        _showOverlay("Backend is starting up, making request now…");
    }

    // 2. Make the actual API call (90s timeout for AI generation)
    _hideOverlay();
    return _directFetch(url, options, 90000);
}

// ─── Public API client ────────────────────────────────────────────────────────

/**
 * Main API helper used by all frontend code.
 *
 * Options:
 *   wakeBackend {boolean} — pass true ONLY for Generate Project to enable
 *                           the cold-start overlay + long timeout.
 */
async function apiClient(endpoint, options = {}) {
    const { wakeBackend = false, ...fetchOptions } = options;

    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    const token = localStorage.getItem("pf_auth_token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {})
    };

    const mergedOptions = { ...fetchOptions, headers };

    let response;
    if (wakeBackend) {
        response = await _wakeAndFetch(url, mergedOptions);
    } else {
        response = await _directFetch(url, mergedOptions);
    }

    // Handle 401 for protected endpoints (not auth routes themselves)
    if (
        response.status === 401 &&
        endpoint !== "/api/auth/login" &&
        endpoint !== "/api/auth/register"
    ) {
        const data = await response.clone().json().catch(() => ({}));
        if (data.requiresAuth && window.AuthManager) {
            window.AuthManager.showLoginPrompt(data.message);
        }
    }

    return response;
}

// Expose globally
window.API_BASE_URL = API_BASE_URL;
window.apiClient = apiClient;
