
async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/api/students/me`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const student = await response.json();

        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('profileContent').classList.remove('d-none');

        document.getElementById('avatarLetter').textContent = student.name.charAt(0).toUpperCase();
        document.getElementById('profileName').textContent = student.name;
        document.getElementById('profileEmail').textContent = student.email;

        document.getElementById('viewPhone').textContent = student.phone || 'Not set';
        document.getElementById('viewSkills').textContent = student.skills || 'Not set';

        const cvEl = document.getElementById('viewCvLink');
        if (student.cvLink) {
            cvEl.href = student.cvLink;
            cvEl.textContent = 'View CV';
        } else {
            cvEl.textContent = 'Not set';
            cvEl.removeAttribute('href');
        }

        document.getElementById('editName').value = student.name || '';
        document.getElementById('editPhone').value = student.phone || '';
        document.getElementById('editSkills').value = student.skills || '';
        document.getElementById('editCvLink').value = student.cvLink || '';

    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function toggleEdit() {
    document.getElementById('viewMode').classList.toggle('d-none');
    document.getElementById('editMode').classList.toggle('d-none');
}

async function updateProfile() {
    const token = localStorage.getItem('token');
    const errorEl = document.getElementById('updateError');
    const successEl = document.getElementById('updateSuccess');

    errorEl.classList.add('d-none');
    successEl.classList.add('d-none');

    const updated = {
        name: document.getElementById('editName').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        skills: document.getElementById('editSkills').value.trim(),
        cvLink: document.getElementById('editCvLink').value.trim()
    };

    try {
        const response = await fetch(`${API}/api/students/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updated)
        });

        if (!response.ok) {
            errorEl.textContent = 'Failed to update. Please try again.';
            errorEl.classList.remove('d-none');
            return;
        }

        successEl.textContent = '✅ Profile updated successfully!';
        successEl.classList.remove('d-none');
        localStorage.setItem('userName', updated.name);

        setTimeout(() => {
            loadProfile();
            toggleEdit();
        }, 1000);

    } catch (error) {
        errorEl.textContent = 'Cannot connect to server.';
        errorEl.classList.remove('d-none');
    }
}

loadProfile();