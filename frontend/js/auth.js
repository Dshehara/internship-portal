
let currentRole = 'student';

function selectRole(role) {
    currentRole = role;
    const studentBtn = document.getElementById('studentBtn');
    const companyBtn = document.getElementById('companyBtn');
    const nameLabel = document.getElementById('nameLabel');

    if (role === 'student') {
        studentBtn.className = 'btn btn-primary flex-fill';
        companyBtn.className = 'btn btn-outline-primary flex-fill';
        if (nameLabel) nameLabel.textContent = 'Full Name';
    } else {
        studentBtn.className = 'btn btn-outline-primary flex-fill';
        companyBtn.className = 'btn btn-primary flex-fill';
        if (nameLabel) nameLabel.textContent = 'Company Name';
    }
}

async function register() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    errorMsg.classList.add('d-none');
    successMsg.classList.add('d-none');

    if (!name || !email || !password) {
        errorMsg.textContent = 'Please fill in all fields.';
        errorMsg.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API}/api/auth/${currentRole}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMsg.textContent = data.message || 'Registration failed. Email may already be registered.';
            errorMsg.classList.remove('d-none');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', currentRole);

        successMsg.textContent = `Account created! Redirecting...`;
        successMsg.classList.remove('d-none');

        setTimeout(() => {
            window.location.href = currentRole === 'company' ? 'company-dashboard.html' : 'dashboard.html';
        }, 1000);

    } catch (error) {
        errorMsg.textContent = 'Cannot connect to server. Make sure IntelliJ is running.';
        errorMsg.classList.remove('d-none');
    }
}

async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.classList.add('d-none');

    if (!email || !password) {
        errorMsg.textContent = 'Please enter your email and password.';
        errorMsg.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API}/api/auth/${currentRole}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMsg.textContent = 'Invalid email or password. Make sure you selected the right role (Student/Company).';
            errorMsg.classList.remove('d-none');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', currentRole);

        window.location.href = currentRole === 'company' ? 'company-dashboard.html' : 'dashboard.html';

    } catch (error) {
        errorMsg.textContent = 'Cannot connect to server. Make sure IntelliJ is running.';
        errorMsg.classList.remove('d-none');
    }
}