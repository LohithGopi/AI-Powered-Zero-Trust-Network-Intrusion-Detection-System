/**
 * Main JavaScript Handler for Enterprise Full-Width Zero Trust Platform
 */

const NIDS = {
    getToken: function() {
        return localStorage.getItem('jwt_token');
    },

    setAuth: function(token, user) {
        if (token) localStorage.setItem('jwt_token', token);
        if (user) localStorage.setItem('user_info', JSON.stringify(user));
    },

    clearAuth: function() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_info');
    },

    apiFetch: async function(url, options = {}) {
        const token = NIDS.getToken();
        
        options.headers = options.headers || {};
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (!(options.body instanceof FormData) && !options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, options);
            if (response.status === 401 || response.status === 403) {
                const data = await response.json();
                if (data.error && data.error.includes("Unauthorized")) {
                    NIDS.showToast("Session Expired", "Please sign in again.", "danger");
                    setTimeout(() => { window.location.href = "/login"; }, 1200);
                }
            }
            return response;
        } catch (err) {
            console.error("API Network Error:", err);
            NIDS.showToast("Network Error", "Failed to connect to server.", "danger");
            throw err;
        }
    },

    showToast: function(title, message, type = "info") {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'danger' ? 'bg-danger text-white' : (type === 'success' ? 'bg-success text-white' : 'bg-primary text-white');
        
        const html = `
            <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 mb-2 shadow-sm" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}:</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
        toast.show();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Active link underline highlighter
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link-blue-underline').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
