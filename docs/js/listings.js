let allListings = [];

async function loadListings() {
    try {
        const response = await fetch(`${API}/api/listings`);
        allListings = await response.json();
        document.getElementById('loadingSpinner').classList.add('d-none');
        renderListings(allListings);
    } catch (error) {
        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('listingsContainer').innerHTML =
            '<p class="text-danger">Cannot connect to server. Make sure IntelliJ is running.</p>';
    }
}

function renderListings(listings) {
    const container = document.getElementById('listingsContainer');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('listingCount');

    if (countEl) countEl.textContent = `${listings.length} internship(s) found`;

    if (listings.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    container.innerHTML = listings.map(listing => `
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm listing-card h-100">
                <div class="card-body p-4 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${listing.duration || 'Internship'}</span>
                        <small class="text-muted">
                            📍 ${listing.location || 'Sri Lanka'}
                        </small>
                    </div>
                    <h5 class="fw-bold mt-2 mb-1">${listing.title}</h5>
                    <p class="text-success fw-semibold mb-2 small">
                        🏢 ${listing.company ? listing.company.name : 'Company'}
                    </p>
                    <p class="text-muted small flex-grow-1">${listing.description || ''}</p>
                    <div class="mt-3">
                        <small class="text-muted d-block mb-2">
                            📅 Deadline: ${listing.deadline
                                ? new Date(listing.deadline).toLocaleDateString('en-LK')
                                : 'Open'}
                        </small>
                        ${token && role === 'student' ? `
                            <button class="btn btn-primary w-100 btn-sm"
                                onclick="applyForListing(${listing.id}, this)">
                                🚀 Apply Now
                            </button>
                        ` : token ? '' : `
                            <a href="login.html" class="btn btn-outline-primary w-100 btn-sm">
                                Login to Apply
                            </a>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function applyForListing(listingId, btn) {
    const token = localStorage.getItem('token');
    const msgEl = document.getElementById('applyMsg');

    btn.disabled = true;
    btn.textContent = 'Applying...';

    try {
        const response = await fetch(`${API}/api/applications/${listingId}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        msgEl.classList.remove('d-none', 'alert-success', 'alert-danger');

        if (response.ok) {
            msgEl.className = 'alert alert-success mb-3';
            msgEl.textContent = '✅ Application submitted! Check My Applications to track its status.';
            btn.textContent = '✅ Applied';
            btn.className = 'btn btn-success w-100 btn-sm';
        } else {
            const data = await response.json();
            msgEl.className = 'alert alert-warning mb-3';
            msgEl.textContent = data.message || '⚠️ You have already applied for this internship.';
            btn.disabled = false;
            btn.textContent = '🚀 Apply Now';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        msgEl.className = 'alert alert-danger mb-3';
        msgEl.textContent = 'Could not connect to server.';
        msgEl.classList.remove('d-none');
        btn.disabled = false;
        btn.textContent = '🚀 Apply Now';
    }
}

function filterListings() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const location = document.getElementById('locationFilter')?.value.toLowerCase() || '';
    const duration = document.getElementById('durationFilter')?.value || '';

    const filtered = allListings.filter(l => {
        const matchesSearch =
            (l.title && l.title.toLowerCase().includes(search)) ||
            (l.company && l.company.name && l.company.name.toLowerCase().includes(search));
        const matchesLocation =
            !location || (l.location && l.location.toLowerCase().includes(location));
        const matchesDuration =
            !duration || (l.duration && l.duration.includes(duration));

        return matchesSearch && matchesLocation && matchesDuration;
    });

    renderListings(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    if (document.getElementById('locationFilter'))
        document.getElementById('locationFilter').value = '';
    if (document.getElementById('durationFilter'))
        document.getElementById('durationFilter').value = '';
    renderListings(allListings);
}

async function postListing() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    errorMsg.classList.add('d-none');
    successMsg.classList.add('d-none');

    if (!token) {
        errorMsg.textContent = 'You are not logged in. Please login as a Company.';
        errorMsg.classList.remove('d-none');
        return;
    }

    if (role !== 'company') {
        errorMsg.textContent = 'Only companies can post internship listings. Please login as a Company.';
        errorMsg.classList.remove('d-none');
        return;
    }

    const listing = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        location: document.getElementById('location').value.trim(),
        duration: document.getElementById('duration').value,
        deadline: document.getElementById('deadline').value || null
    };

    if (!listing.title || !listing.description || !listing.location) {
        errorMsg.textContent = 'Please fill in title, description, and location.';
        errorMsg.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API}/api/listings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(listing)
        });

        if (!response.ok) {
            const err = await response.text();
            errorMsg.textContent = 'Failed to post: ' + (err || 'Server error');
            errorMsg.classList.remove('d-none');
            return;
        }

        successMsg.textContent = '✅ Internship posted successfully! Redirecting...';
        successMsg.classList.remove('d-none');
        setTimeout(() => window.location.href = 'company-dashboard.html', 1500);

    } catch (error) {
        errorMsg.textContent = 'Cannot connect to server. Make sure IntelliJ is running.';
        errorMsg.classList.remove('d-none');
    }
}

if (document.getElementById('listingsContainer')) {
    loadListings();
}