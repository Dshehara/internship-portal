
async function loadMyApplications() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/api/applications/my`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const apps = await response.json();

        document.getElementById('loadingSpinner').classList.add('d-none');

        if (apps.length === 0) {
            document.getElementById('noApps').classList.remove('d-none');
            return;
        }

        const container = document.getElementById('appsContainer');
        container.innerHTML = apps.map(app => `
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${
                                app.status === 'PENDING' ? 'bg-warning text-dark' :
                                app.status === 'ACCEPTED' ? 'bg-success' : 'bg-secondary'
                            }">${app.status}</span>
                            <small class="text-muted">
                                Applied: ${new Date(app.appliedDate).toLocaleDateString('en-LK')}
                            </small>
                        </div>
                        <h5 class="fw-bold mt-2">${app.listing.title}</h5>
                        <p class="text-success fw-semibold mb-1 small">
                            🏢 ${app.listing.company ? app.listing.company.name : 'Company'}
                        </p>
                        <p class="text-muted small mb-2">
                            📍 ${app.listing.location || 'Sri Lanka'} &nbsp;|&nbsp;
                            ⏱ ${app.listing.duration || ''}
                        </p>
                        <p class="text-muted small">
                            📅 Deadline: ${app.listing.deadline
                                ? new Date(app.listing.deadline).toLocaleDateString('en-LK')
                                : 'Open'}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('appsContainer').innerHTML =
            '<p class="text-danger">Cannot connect to server.</p>';
    }
}

loadMyApplications();