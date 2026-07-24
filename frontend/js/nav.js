const API = 'http://localhost:8080';

function renderNav() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');

    const nav = document.getElementById('mainNav');
    if (!nav) return;

    let rightSide = '';

    if (token && name) {
        const dashLink = role === 'company' ? 'company-dashboard.html' : 'dashboard.html';
        const dashLabel = role === 'company' ? '🏢 Dashboard' : '👤 Dashboard';

        rightSide = `
            <span class="navbar-text text-white-50 me-3 small d-none d-lg-inline">
                ${role === 'company' ? '🏢' : '👤'} ${name}
            </span>
            <a href="${dashLink}" class="btn btn-outline-light btn-sm me-2">${dashLabel}</a>
            <a href="listings.html" class="btn btn-outline-light btn-sm me-2">
                <i class="bi bi-search"></i> Listings
            </a>
            ${role === 'student' ? `<a href="my-applications.html" class="btn btn-outline-light btn-sm me-2">📋 My Applications</a>` : ''}
            ${role === 'company' ? `<a href="post-listing.html" class="btn btn-light btn-sm me-2">+ Post Internship</a>` : ''}
            <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
        `;
    } else {
        rightSide = `
            <a href="login.html" class="btn btn-outline-light btn-sm me-2">Login</a>
            <a href="register.html" class="btn btn-light btn-sm">Register</a>
        `;
    }

    nav.innerHTML = `
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.html">
            <i class="bi bi-briefcase-fill"></i> InternHub
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link text-white" href="listings.html">Browse Internships</a>
                </li>
            </ul>
            <div class="d-flex flex-wrap gap-2 align-items-center">
                ${rightSide}
            </div>
        </div>
    </div>`;
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

renderNav();