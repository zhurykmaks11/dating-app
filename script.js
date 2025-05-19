
import {
    checkAuth,
    renderAuthForm,
    hideAuthForm,
    bindAuthEvents,
} from './auth.js';
import {
    debounce,
    sortUsers,
    filterUsers
} from './utils.js';

let allUsers = [];
let currentPage = 1;
let perPage = 30;
let filters = {
    search: '',
    sort: '',
};

function initApp() {
    loadUsers().then(() => {
        render();
        bindUIEvents();
    });
}

function loadUsers() {
    return fetch('https://randomuser.me/api/?results=200')
        .then(res => res.json())
        .then(data => {
            allUsers = data.results;
        })
        .catch(() => {
            document.getElementById('user-list').innerHTML = '<p>Помилка завантаження користувачів </p>';
        });
}

function render() {
    const filtered = filterUsers(allUsers, filters);
    const sorted = sortUsers(filtered, filters.sort);
    const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

    renderUsers(paginated);
    renderPagination(sorted.length);
}

function renderUsers(users) {
    const container = document.getElementById('user-list');
    container.innerHTML = users.map(user => `
    <div class="user-card">
      <img src="${user.picture.large}" alt="${user.name.first}" />
      <div class="info">
        <h2>${user.name.first} ${user.name.last}</h2>
        <p>Вік: ${user.dob.age}</p>
        <p>Телефон: ${user.phone}</p>
        <p>Email: ${user.email}</p>
        <p>Місто: ${user.location.city}</p>
      </div>
    </div>
  `).join('');
}

function renderPagination(total) {
    const pagination = document.getElementById('pagination');
    const pages = Math.ceil(total / perPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            render();
        });
        pagination.appendChild(btn);
    }
}

function bindUIEvents() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    searchInput.addEventListener('input', debounce((e) => {
        filters.search = e.target.value.toLowerCase();
        currentPage = 1;
        render();
    }, 300));

    sortSelect.addEventListener('change', (e) => {
        filters.sort = e.target.value;
        currentPage = 1;
        render();
    });

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            if ((currentPage * perPage) < filterUsers(allUsers, filters).length) {
                currentPage++;
                render();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        hideAuthForm();
        initApp();
    } else {
        renderAuthForm();
    }

    bindAuthEvents(initApp, () => {
        document.getElementById('user-list').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
    });
});
