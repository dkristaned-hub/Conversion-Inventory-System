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

// 🔹 Utility function — show/hide modal confirmation
function showConfirmationModal(title, message, onConfirm, customSelectors) {
  const baseConfig = {
    modalId: 'confirmModal',
    titleId: 'confirmModalTitle',
    messageId: 'confirmModalMessage',
    confirmButtonId: 'confirmModalOK',
    cancelButtonId: 'confirmModalCancel'
  };

  const knownFallbackConfig = {
    modalId: 'clearModal',
    titleId: 'clearModalTitle',
    messageId: 'clearModalMessage',
    confirmButtonId: 'confirmClear',
    cancelButtonId: 'cancelClear'
  };

  const customConfig = customSelectors && typeof customSelectors === 'object'
    ? {
        modalId: customSelectors.modalId || baseConfig.modalId,
        titleId: customSelectors.titleId || baseConfig.titleId,
        messageId: customSelectors.messageId || baseConfig.messageId,
        confirmButtonId: customSelectors.confirmButtonId || baseConfig.confirmButtonId,
        cancelButtonId: customSelectors.cancelButtonId || baseConfig.cancelButtonId
      }
    : null;

  const configPriority = [];
  if (customConfig) configPriority.push(customConfig);
  configPriority.push(baseConfig, knownFallbackConfig);

  let modalElements = null;

  const resolveElements = config => {
    const modal = document.getElementById(config.modalId);
    if (!modal) return null;

    const titleEl = document.getElementById(config.titleId);
    const messageEl = document.getElementById(config.messageId);
    const okBtn = document.getElementById(config.confirmButtonId);
    const cancelBtn = document.getElementById(config.cancelButtonId);

    if (!titleEl || !messageEl || !okBtn || !cancelBtn) {
      return null;
    }

    return { modal, titleEl, messageEl, okBtn, cancelBtn };
  };

  for (const config of configPriority) {
    modalElements = resolveElements(config);
    if (modalElements) {
      break;
    }
  }

  if (!modalElements) {
    if (confirm(message || 'Are you sure you want to proceed?')) {
      if (typeof onConfirm === 'function') onConfirm();
    }
    return;
  }

  const { modal, titleEl, messageEl, okBtn, cancelBtn } = modalElements;

  // Set title and message
  titleEl.textContent = title || 'Confirm Action';
  messageEl.textContent = message || 'Are you sure you want to proceed?';

  const cleanup = () => {
    if (modal._keyHandler) {
      document.removeEventListener('keydown', modal._keyHandler, true);
      modal._keyHandler = null;
    }
    okBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  const handleOK = () => {
    cleanup();
    modal.style.setProperty('display', 'none', 'important');
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  const handleCancel = () => {
    cleanup();
    modal.style.setProperty('display', 'none', 'important');
  };

  const handleKeyDown = e => {
    const computedDisplay = window.getComputedStyle(modal).display;
    if (computedDisplay === 'none') {
      return;
    }

    if (e.target.tagName === 'INPUT' && document.activeElement !== okBtn && document.activeElement !== cancelBtn) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleOK();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handleCancel();
    }
  };

  if (modal._keyHandler) {
    document.removeEventListener('keydown', modal._keyHandler, true);
  }

  modal._keyHandler = handleKeyDown;
  document.addEventListener('keydown', handleKeyDown, true);

  okBtn.onclick = handleOK;
  cancelBtn.onclick = handleCancel;

  modal.style.removeProperty('display');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

  setTimeout(() => {
    okBtn.focus();
  }, 100);
}

// 🔹 Admin Password Confirmation Function (using modal)
// ==========================
function verifyAdminPassword(callback, titleText) {
  const modal = document.getElementById('adminPasswordModal');
  const passwordInput = document.getElementById('adminPasswordInput');
  const title = document.getElementById('adminPasswordTitle');
  const confirmBtn = document.getElementById('adminPasswordConfirm');
  const cancelBtn = document.getElementById('adminPasswordCancel');
  
  // Check if elements exist
  if (!modal || !passwordInput || !title || !confirmBtn || !cancelBtn) {
    console.error('Admin password modal elements not found');
    // Fallback to prompt
    const password = prompt('⚠️ Admin Password Required\n\nPlease enter admin password:');
    if (password === 'admin123') {
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    } else {
      alert('❌ Incorrect password. Access denied.');
      return false;
    }
  }
  
  // Clean up any existing event listeners
  if (modal._passwordKeyHandler) {
    passwordInput.removeEventListener('keydown', modal._passwordKeyHandler);
    modal._passwordKeyHandler = null;
  }
  
  // Set custom title if provided
  if (titleText) {
    title.textContent = titleText;
  } else {
    title.textContent = 'Verify Admin Password';
  }
  
  // Clear password input
  passwordInput.value = '';
  
  // Remove existing onclick handlers
  confirmBtn.onclick = null;
  cancelBtn.onclick = null;
  
  const cleanup = () => {
    passwordInput.removeEventListener('keydown', handleKeyDown);
    modal._passwordKeyHandler = null;
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  // Function to handle confirmation
  const handleConfirm = function() {
    const password = passwordInput.value;
    
    if (password === 'admin123') {
      cleanup();
      
      // Close modal
      modal.style.setProperty('display', 'none', 'important');
      passwordInput.value = '';
      
      // Small delay to ensure password modal closes before showing confirmation
      setTimeout(() => {
        // Call the callback which will show the confirmation modal
        if (typeof callback === 'function') {
          callback();
        }
      }, 100);
      return true;
    } else {
      alert('❌ Incorrect password. Access denied.');
      passwordInput.value = '';
      passwordInput.focus();
      return false;
    }
  };
  
  // Function to handle cancellation
  const handleCancel = function() {
    cleanup();
    modal.style.setProperty('display', 'none', 'important');
    passwordInput.value = '';
  };

  // Handle Enter key to confirm, Escape to cancel
  const handleKeyDown = function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
  
  // Set up event listeners
  confirmBtn.onclick = handleConfirm;
  cancelBtn.onclick = handleCancel;
  passwordInput.addEventListener('keydown', handleKeyDown);
  
  // Store handler reference for cleanup
  modal._passwordKeyHandler = handleKeyDown;
  
  // Show modal - ensure it's centered (remove !important first, then set display)
  modal.style.removeProperty('display');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  
  // Focus input after a small delay to ensure modal is rendered
  setTimeout(() => {
    passwordInput.focus();
  }, 100);
}

// Function to clear activity logs
function clearActivityLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear all activity logs? This action cannot be undone.',
      () => {
        localStorage.removeItem('activityLogs');
        loadActivityLogs();
        alert('✅ Activity logs cleared successfully!');
      }
    );
  }, 'Verify Admin Password to Clear Activity Logs');
}

// Hide modals on page load
document.addEventListener('DOMContentLoaded', function() {
  const confirmModal = document.getElementById('confirmModal');
  const adminPasswordModal = document.getElementById('adminPasswordModal');
  if (confirmModal) {
    confirmModal.style.setProperty('display', 'none', 'important');
  }
  if (adminPasswordModal) {
    adminPasswordModal.style.setProperty('display', 'none', 'important');
  }
});

// Initialize activity logs on page load (only for activity log page)
if (document.querySelector('#activity-logs')) {
  window.addEventListener('load', function() {
    // Hide modals on page load
    const confirmModal = document.getElementById('confirmModal');
    const adminPasswordModal = document.getElementById('adminPasswordModal');
    if (confirmModal) {
      confirmModal.style.setProperty('display', 'none', 'important');
    }
    if (adminPasswordModal) {
      adminPasswordModal.style.setProperty('display', 'none', 'important');
    }
    
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

function confirmLogout() {
    const userUsername = localStorage.getItem('userUsername');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === userUsername);

    const isAdmin = userUsername === 'admin123';
    const logoutModal = document.getElementById('logoutModal');

    if (!logoutModal) {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'Login.html';
        }
        return;
    }

    const logoutMessage = document.getElementById('logoutMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelBtn = document.getElementById('cancelLogoutBtn');

    if (!logoutMessage || !checkoutBtn || !logoutBtn || !cancelBtn) {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'Login.html';
        }
        return;
    }

    if (!isAdmin && currentUser && currentUser.employeeId) {
        logoutMessage.textContent = 'Are you sure you want to check out and log out?';
        checkoutBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';

        checkoutBtn.onclick = function() {
            recordCheckout();
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };

        logoutBtn.onclick = function() {
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };

        cancelBtn.onclick = function() {
            if (checkoutBtn.style.display !== 'none') {
                logoutMessage.textContent = 'Are you sure you want to log out?';
                checkoutBtn.style.display = 'none';
                logoutBtn.style.display = 'flex';
            } else {
                closeModal('logoutModal');
            }
        };

        logoutModal.style.display = 'block';
    } else {
        logoutMessage.textContent = 'Are you sure you want to log out?';
        checkoutBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';

        logoutBtn.onclick = function() {
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };

        cancelBtn.onclick = function() {
            closeModal('logoutModal');
        };

        logoutModal.style.display = 'block';
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

