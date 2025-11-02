// Activity Log functionality - Shared across all pages

// Function to add activity log
function addActivityLog(activity, details) {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  const userName = localStorage.getItem('userName') || 'Guest';
  const userPrivilege = localStorage.getItem('userPrivilege') || '';
  const conductedBy = userPrivilege ? `${userName} (${userPrivilege})` : userName;
  
  const newLog = {
    date: new Date().toLocaleString(),
    activity: activity,
    details: details,
    conductedBy: conductedBy
  };
  logs.unshift(newLog); // Add to beginning
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.pop();
  }
  localStorage.setItem('activityLogs', JSON.stringify(logs));
  
  // If on activity log page, reload
  if (document.querySelector('#activity-logs')) {
    loadActivityLogs();
  }
}

// Function to load activity logs
function loadActivityLogs(dateFilter = null) {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  const tableBody = document.querySelector('#activity-logs tbody');
  
  if (!tableBody) return;
  
  tableBody.innerHTML = '';

  if (logs.length === 0) {
    tableBody.innerHTML = `
      <tr class="table-row">
        <td class="table-cell" colspan="4" style="text-align: center; color: #6B7280;">
          No activity logs yet
        </td>
      </tr>
    `;
    return;
  }

  // Filter by date if provided
  let filteredLogs = logs;
  if (dateFilter) {
    filteredLogs = logs.filter(log => {
      if (!log.date) return false;
      
      // Parse the log date (format: MM/DD/YYYY, HH:MM AM/PM)
      try {
        let datePart = log.date;
        if (log.date.includes(',')) {
          [datePart] = log.date.split(', ');
        } else {
          [datePart] = log.date.split(' ');
        }
        
        const dateParts = datePart.split('/');
        if (dateParts.length !== 3) return false;
        
        const month = parseInt(dateParts[0], 10);
        const day = parseInt(dateParts[1], 10);
        const year = dateParts[2];
        
        // Convert MM/DD/YYYY to YYYY-MM-DD for comparison
        const logDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return logDateStr === dateFilter;
      } catch (e) {
        return false;
      }
    });
  }

  // Show all activities (container height ensures at least 10 are visible)
  // All logs are displayed, with scrollbar if more than visible area
  let logsToShow = filteredLogs;

  if (logsToShow.length === 0) {
    tableBody.innerHTML = `
      <tr class="table-row">
        <td class="table-cell" colspan="4" style="text-align: center; color: #6B7280;">
          ${dateFilter ? 'No activity logs found for selected date' : 'No activity logs yet'}
        </td>
      </tr>
    `;
    return;
  }

  logsToShow.forEach(log => {
    const row = document.createElement('tr');
    row.className = 'table-row';
    row.innerHTML = `
      <td class="table-cell">${log.date}</td>
      <td class="table-cell">${log.activity}</td>
      <td class="table-cell">${log.details || ''}</td>
      <td class="table-cell">${log.conductedBy || (log.details && log.details.includes('Conducted by:') ? log.details.split('Conducted by:')[1].trim() : 'Guest')}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to filter activity logs by date
function filterActivityLogs() {
  const dateInput = document.getElementById('activity-logs-date-search');
  const dateFilter = dateInput ? dateInput.value : null;
  loadActivityLogs(dateFilter);
}

// Function to clear date filter
function clearActivityLogsFilter() {
  const dateInput = document.getElementById('activity-logs-date-search');
  if (dateInput) {
    dateInput.value = '';
  }
  loadActivityLogs();
}

// Function to clear activity logs
function clearActivityLogs() {
  if (confirm('Are you sure you want to clear all activity logs?')) {
    localStorage.removeItem('activityLogs');
    loadActivityLogs();
    alert('Activity logs cleared successfully!');
  }
}

// Initialize activity logs on page load (only for activity log page)
if (document.querySelector('#activity-logs')) {
  window.addEventListener('load', function() {
    loadActivityLogs();
  });
}

// Sidebar functions
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('minimized');
  }
}

function confirmLogout() {
  if (confirm('Are you sure you want to log out?')) {
    window.location.href = 'Login.html';
  }
}

// Update profile picture in sidebar
function updateProfilePicture(imageUrl) {
  const profileImage = document.querySelector('.sidebar-profile-picture img');
  if (profileImage && imageUrl) {
    profileImage.src = imageUrl;
  }
}

// Load user info on page load
window.addEventListener('load', function() {
  const savedProfilePic = localStorage.getItem('profilePicture');
  if (savedProfilePic) {
    updateProfilePicture(savedProfilePic);
  }

  const savedName = localStorage.getItem('userName');
  if (savedName) {
    const welcomeText = document.querySelector('.sidebar-welcome');
    if (welcomeText) {
      welcomeText.textContent = `Welcome, ${savedName}`;
    }
  }

  const savedPrivilege = localStorage.getItem('userPrivilege');
  if (savedPrivilege) {
    const modeText = document.querySelector('.sidebar-mode');
    if (modeText) {
      modeText.textContent = `${savedPrivilege} Mode`;
    }
  }
});

