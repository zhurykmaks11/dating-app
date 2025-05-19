console.log('AUTH FILE LOADED');

const AUTH_KEY = 'friendFinderUser';

export function checkAuth() {
    return localStorage.getItem(AUTH_KEY);
}

export function login(username) {
    localStorage.setItem(AUTH_KEY, username);
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

export function renderAuthForm() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

export function hideAuthForm() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

export function bindAuthEvents(onLogin, onLogout) {
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        if (username) {
            login(username);
            hideAuthForm();
            if (typeof onLogin === 'function') onLogin();
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        renderAuthForm();
        if (typeof onLogout === 'function') onLogout();
    });
}
