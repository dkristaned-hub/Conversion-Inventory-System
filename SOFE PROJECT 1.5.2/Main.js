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

// Function to record checkout (shared function)
function recordCheckout() {
    const userUsername = localStorage.getItem('userUsername');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === userUsername);
    
    if (currentUser && currentUser.employeeId) {
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const today = new Date().toDateString();
        
        // Find today's "Present" entry for this employee
        const todayEntry = attendance.find(att => 
            att.id === currentUser.employeeId && 
            new Date(att.checkInDate || att.date || new Date()).toDateString() === today &&
            att.status === 'Present'
        );
        
        if (todayEntry) {
            // Get current date and time
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            const timeString = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            
            // Update the entry with check-out date, time and status
            todayEntry.checkOutDate = dateStr;
            todayEntry.checkOut = timeString;
            todayEntry.status = 'Checked Out';
            
            localStorage.setItem('attendance', JSON.stringify(attendance));
            alert('✅ Check-out recorded successfully!');
        }
    }
}

// Function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to confirm logout
function confirmLogout() {
    const userUsername = localStorage.getItem('userUsername');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === userUsername);
    
    // Check if user is admin (not in users array)
    const isAdmin = userUsername === 'admin123';
    const logoutModal = document.getElementById('logoutModal');
    
    if (!logoutModal) {
        // Fallback if modal doesn't exist
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'Login.html';
        }
        return;
    }
    
    // If staff member, show modal with Check Out option
    if (!isAdmin && currentUser && currentUser.employeeId) {
        const logoutMessage = document.getElementById('logoutMessage');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Show checkout option by default
        logoutMessage.textContent = 'Are you sure you want to check out and logout?';
        checkoutBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        
        // Set up checkout button
        checkoutBtn.onclick = function() {
            recordCheckout();
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };
        
        // Set up logout only button
        logoutBtn.onclick = function() {
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };
        
        // Set up cancel button - toggle between checkout and logout only
        document.getElementById('cancelLogoutBtn').onclick = function() {
            if (checkoutBtn.style.display !== 'none') {
                logoutMessage.textContent = 'Are you sure you want to logout?';
                checkoutBtn.style.display = 'none';
                logoutBtn.style.display = 'block';
            } else {
                closeModal('logoutModal');
            }
        };
        
        logoutModal.style.display = 'block';
    } else {
        // Admin or no user, just show logout modal
        const logoutMessage = document.getElementById('logoutMessage');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        logoutMessage.textContent = 'Are you sure you want to logout?';
        checkoutBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        
        logoutBtn.onclick = function() {
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };
        
        document.getElementById('cancelLogoutBtn').onclick = function() {
            closeModal('logoutModal');
        };
        
        logoutModal.style.display = 'block';
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

// Filter function for Resupply Schedule
function filterResupplySchedule() {
    const searchValue = document.getElementById('resupply-date-search').value;
    const table = document.querySelector('.content-section:nth-of-type(1) table');
    const rows = table.getElementsByTagName('tr');
    
    if (!searchValue) {
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = '';
        }
        return;
    }
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const dateCell = cells[0].textContent.trim();
            if (dateCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Resupply Schedule
function clearResupplyFilter() {
    document.getElementById('resupply-date-search').value = '';
    filterResupplySchedule();
}

// Filter function for Recent Activity
function filterRecentActivity() {
    const searchValue = document.getElementById('recent-activity-date-search').value;
    const table = document.getElementById('recent-activity');
    const rows = table.getElementsByTagName('tr');
    
    if (!searchValue) {
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = '';
        }
        return;
    }
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const dateCell = cells[0].textContent.trim();
            if (dateCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Recent Activity
function clearRecentActivityFilter() {
    document.getElementById('recent-activity-date-search').value = '';
    filterRecentActivity();
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
