// Function to update profile picture
function updateProfilePicture(imageUrl) {
    const profileImage = document.querySelector('.sidebar-profile-picture img');
    if (profileImage) {
        profileImage.src = imageUrl;
    }
}

// Function to toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('minimized');
}

// Function to confirm logout
function confirmLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'Login.html';
    }
}

// Function to filter logs
function filterLogs(searchInput, tableId) {
    const filter = searchInput.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
        rows[i].style.display = match ? '' : 'none';
    }
}

// Function to update top stats
function updateTopStats() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];

    // Calculate total oil volume (Stock In - Stock Out)
    let totalVolume = 0;
    monitorings.forEach(m => {
        if (m.transactionType === 'Stock In') {
            totalVolume += m.quantity;
        } else if (m.transactionType === 'Stock Out') {
            totalVolume -= m.quantity;
        }
    });
    totalVolume = Math.max(0, totalVolume); // Ensure not negative

    // Storage capacity: current / max (assume max 10000 kg)
    const maxCapacity = 10000;
    const usagePercent = Math.round((totalVolume / maxCapacity) * 100);

    // Types of oil: 2
    const typesOfOil = 2;

    // Pending deliveries: count pending invoices
    const pendingDeliveries = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').length;

    // Update stats
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = `${totalVolume} kg`;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = `${totalVolume}/${maxCapacity} kg`;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = typesOfOil;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = pendingDeliveries;
}

// Function to clear upcoming resupply schedule
function clearUpcomingResupplySchedule() {
    document.getElementById('clearResupplyModal').style.display = 'block';
}

// Function to confirm clear resupply
function confirmClearResupply() {
    localStorage.removeItem('invoices');
    updateUpcomingResupply();
    updateTopStats();
    alert('Upcoming resupply schedule cleared successfully.');
    closeModal('clearResupplyModal');
}

// Function to clear recent activity
function clearRecentActivity() {
    document.getElementById('clearActivityModal').style.display = 'block';
}

// Function to confirm clear activity
function confirmClearActivity() {
    localStorage.removeItem('monitorings');
    updateRecentActivity();
    updateTopStats();
    alert('Recent activity cleared successfully.');
    closeModal('clearActivityModal');
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to update Upcoming Resupply Schedule table
function updateUpcomingResupply() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('.content-section:nth-of-type(1) tbody');
    tbody.innerHTML = '';

    // Filter pending deliveries (pending invoices with type Delivery)
    const pendingDeliveries = invoices.filter(inv => (inv.status === 'Pending' || inv.status === 'Overdue') && inv.invoiceType === 'Delivery');

    if (pendingDeliveries.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell-muted" colspan="5">No upcoming deliveries</td>
            </tr>
        `;
        return;
    }

    // Sort by due date
    pendingDeliveries.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    pendingDeliveries.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.dueDate}</td>
            <td class="table-cell">Oil (Delivery)</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${invoice.amount}</td>
            <td class="table-cell">${invoice.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update Recent Activity table
function updateRecentActivity() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const tbody = document.querySelector('#recent-activity tbody');
    tbody.innerHTML = '';

    // Show last 5 monitorings
    const recentMonitorings = monitorings.slice(-5).reverse();
    recentMonitorings.forEach(monitoring => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${monitoring.date}</td>
            <td class="table-cell">${monitoring.oilType}</td>
            <td class="table-cell">${monitoring.transactionType}</td>
            <td class="table-cell">1</td>
            <td class="table-cell">${monitoring.quantity} kg</td>
        `;
        tbody.appendChild(row);
    });

    // If no monitorings, show default
    if (recentMonitorings.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell">2025-09-28</td>
              <td class="table-cell">Palm Oil</td>
              <td class="table-cell">Stock In</td>
              <td class="table-cell">50</td>
              <td class="table-cell">500 kg</td>
            </tr>
        `;
    }
}

// Load saved data on page load
window.addEventListener('load', function() {
    // Load profile picture
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
        updateProfilePicture(savedProfilePic);
    }

    // Load user name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        const welcomeText = document.querySelector('.sidebar-welcome');
        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${savedName}`;
        }
    }

    // Load privilege level
    const savedPrivilege = localStorage.getItem('userPrivilege');
    if (savedPrivilege) {
        const modeText = document.querySelector('.sidebar-mode');
        if (modeText) {
            modeText.textContent = `${savedPrivilege} Mode`;
        }
    }

    // Update recent activity
    updateRecentActivity();

    // Update upcoming resupply
    updateUpcomingResupply();

    // Update top stats
    updateTopStats();
});
