const token = localStorage.getItem('token');
let editModal, applicantsModal;

async function loadCompanyDashboard() {
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    editModal = new bootstrap.Modal(document.getElementById('editListingModal'));
    applicantsModal = new bootstrap.Modal(document.getElementById('applicantsModal'));

    try {
        const [profileRes, listingsRes] = await Promise.all([
            fetch(`${API}/api/companies/me`, {
                headers: { 'Authorization': 'Bearer ' + token }
            }),
            fetch(`${API}/api/companies/my-listings`, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
        ]);

        if (!profileRes.ok) {
            window.location.href = 'login.html';
            return;
        }

        const company = await profileRes.json();
        const listings = await listingsRes.json();

        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('dashContent').classList.remove('d-none');

        document.getElementById('avatarLetter').textContent = company.name.charAt(0).toUpperCase();
        document.getElementById('companyName').textContent = company.name;
        document.getElementById('companyEmail').textContent = company.email;
        document.getElementById('companyIndustry').textContent = company.industry || 'Not set';
        document.getElementById('companyWebsite').textContent = company.website || 'Not set';

        document.getElementById('editName').value = company.name || '';
        document.getElementById('editIndustry').value = company.industry || '';
        document.getElementById('editWebsite').value = company.website || '';

        renderMyListings(listings);

    } catch (error) {
        console.error(error);
    }
}

function renderMyListings(listings) {
    const container = document.getElementById('myListingsContainer');

    if (listings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <p>No internships posted yet.</p>
                <a href="post-listing.html" class="btn btn-primary btn-sm">Post Your First Listing</a>
            </div>`;
        return;
    }

    container.innerHTML = listings.map(l => `
        <div class="border rounded p-3 mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="fw-bold mb-1">${l.title}</h6>
                    <small class="text-muted">📍 ${l.location} &nbsp;|&nbsp; ⏱ ${l.duration}</small>
                    <br>
                    <small class="text-muted">📅 Deadline: ${l.deadline
                        ? new Date(l.deadline).toLocaleDateString('en-LK') : 'Open'}</small>
                </div>
                <div class="d-flex flex-column gap-1 ms-2">
                    <button class="btn btn-outline-primary btn-sm"
                        onclick="openEditModal(${l.id}, '${escapeStr(l.title)}',
                        '${escapeStr(l.description)}', '${l.location}',
                        '${l.duration}', '${l.deadline || ''}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-outline-info btn-sm"
                        onclick="viewApplicants(${l.id}, '${escapeStr(l.title)}')">
                        👥 Applicants
                    </button>
                    <button class="btn btn-outline-danger btn-sm"
                        onclick="deleteListing(${l.id})">
                        🗑 Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeStr(str) {
    return str ? str.replace(/'/g, "\\'").replace(/\n/g, ' ') : '';
}

function openEditModal(id, title, desc, location, duration, deadline) {
    document.getElementById('editListingId').value = id;
    document.getElementById('editListingTitle').value = title;
    document.getElementById('editListingDesc').value = desc;
    document.getElementById('editListingLocation').value = location;
    document.getElementById('editListingDuration').value = duration;
    document.getElementById('editListingDeadline').value = deadline;
    editModal.show();
}

async function saveListingEdit() {
    const id = document.getElementById('editListingId').value;
    const updated = {
        title: document.getElementById('editListingTitle').value,
        description: document.getElementById('editListingDesc').value,
        location: document.getElementById('editListingLocation').value,
        duration: document.getElementById('editListingDuration').value,
        deadline: document.getElementById('editListingDeadline').value || null
    };

    try {
        const response = await fetch(`${API}/api/listings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updated)
        });

        if (response.ok) {
            editModal.hide();
            loadCompanyDashboard();
        }
    } catch (error) {
        alert('Failed to update listing.');
    }
}

async function deleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
        const response = await fetch(`${API}/api/listings/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            loadCompanyDashboard();
        }
    } catch (error) {
        alert('Failed to delete listing.');
    }
}

async function viewApplicants(listingId, title) {
    document.querySelector('#applicantsModal .modal-title').textContent = `👥 Applicants — ${title}`;
    document.getElementById('applicantsBody').innerHTML = 'Loading...';
    applicantsModal.show();

    try {
        const response = await fetch(`${API}/api/applications/listing/${listingId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const apps = await response.json();

        if (apps.length === 0) {
            document.getElementById('applicantsBody').innerHTML =
                '<p class="text-muted text-center">No applications yet for this listing.</p>';
            return;
        }

        document.getElementById('applicantsBody').innerHTML = apps.map(app => `
            <div class="border rounded p-3 mb-2">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${app.student.name}</strong>
                        <br>
                        <small class="text-muted">✉️ ${app.student.email}</small>
                        <br>
                        <small class="text-muted">🛠 ${app.student.skills || 'No skills listed'}</small>
                        ${app.student.cvLink ? `<br><a href="${app.student.cvLink}" target="_blank" class="small">📄 View CV</a>` : ''}
                    </div>
                    <div class="text-end">
                        <span class="badge ${app.status === 'PENDING' ? 'bg-warning' : 'bg-success'}">
                            ${app.status}
                        </span>
                        <br>
                        <small class="text-muted">Applied: ${new Date(app.appliedDate).toLocaleDateString('en-LK')}</small>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        document.getElementById('applicantsBody').innerHTML = '<p class="text-danger">Failed to load applicants.</p>';
    }
}

function toggleEdit() {
    document.getElementById('editCard').classList.toggle('d-none');
}

async function updateProfile() {
    const updated = {
        name: document.getElementById('editName').value.trim(),
        industry: document.getElementById('editIndustry').value.trim(),
        website: document.getElementById('editWebsite').value.trim()
    };

    try {
        const response = await fetch(`${API}/api/companies/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updated)
        });

        if (response.ok) {
            document.getElementById('editSuccess').textContent = 'Profile updated!';
            document.getElementById('editSuccess').classList.remove('d-none');
            localStorage.setItem('userName', updated.name);
            setTimeout(() => loadCompanyDashboard(), 1000);
        }
    } catch (error) {
        document.getElementById('editError').textContent = 'Failed to update.';
        document.getElementById('editError').classList.remove('d-none');
    }
}

loadCompanyDashboard();