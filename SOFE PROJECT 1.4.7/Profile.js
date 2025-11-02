// Get all elements
const profilePictureInput = document.getElementById('profilePictureInput');
const profileImage = document.getElementById('profileImage');
const sidebarProfileImage = document.querySelector('.sidebar-profile-picture img');
const saveButton = document.querySelector('.primary-button');

// Function to update all profile pictures
function updateAllProfilePictures(imageUrl) {
    // Update main profile picture
    if (profileImage) {
        profileImage.src = imageUrl;
    }
    // Update sidebar profile picture
    if (sidebarProfileImage) {
        sidebarProfileImage.src = imageUrl;
    }
    // Save to localStorage
    localStorage.setItem('profilePicture', imageUrl);
}

// Load saved profile picture on page load
window.addEventListener('load', function() {
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
        updateAllProfilePictures(savedProfilePic);
    }

    // Check user privilege and enable/disable editing based on role
    const userPrivilege = localStorage.getItem('userPrivilege');
    const isAdmin = userPrivilege === 'Admin';
    
    // Make fields editable only for Admin
    if (isAdmin) {
        document.getElementById('username').removeAttribute('readonly');
        document.getElementById('fullName').removeAttribute('readonly');
        document.getElementById('currentPassword').removeAttribute('readonly');
        document.getElementById('newPassword').removeAttribute('readonly');
        document.getElementById('confirmPassword').removeAttribute('readonly');
        document.querySelector('select.form-input').disabled = false;
        document.getElementById('changePasswordBtn').disabled = false;
        // Enable Save Changes button (find by text content)
        document.querySelectorAll('.primary-button').forEach(btn => {
            if (btn.textContent === 'Save Changes') {
                btn.disabled = false;
            }
        });
    } else {
        // Non-admin: show message that fields are readonly
        const currentPasswordGroup = document.querySelector('#currentPassword').closest('.form-group');
        if (currentPasswordGroup) {
            const notice = document.createElement('div');
            notice.style.cssText = 'background-color: #FEF3C7; border: 1px solid #FBBF24; border-radius: 0.375rem; padding: 0.75rem; margin-top: 1rem; color: #92400E; font-size: 0.875rem;';
            notice.innerHTML = '<strong>Info:</strong> Only Admin users can edit account information and change passwords.';
            currentPasswordGroup.parentNode.insertBefore(notice, currentPasswordGroup);
        }
    }
});

// Profile picture change functionality
profilePictureInput.addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (file) {
        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB');
            return;
        }

        // Create a FileReader to read the image
        const reader = new FileReader();

        reader.onload = function(event) {
            updateAllProfilePictures(event.target.result);
        };

        // Read the image file
        reader.readAsDataURL(file);
    }
});

// Load saved user data
const savedName = localStorage.getItem('userName');
const savedUsername = localStorage.getItem('userUsername');
const savedPrivilege = localStorage.getItem('userPrivilege');

if (savedUsername) {
    document.getElementById('username').value = savedUsername;
}
if (savedName) {
    document.getElementById('fullName').value = savedName;
    document.querySelector('.sidebar-welcome').textContent = `Welcome, ${savedName}`;
}
if (savedPrivilege) {
    document.querySelector('select.form-input').value = savedPrivilege;
}

// Change password functionality
const changePasswordBtn = document.getElementById('changePasswordBtn');
changePasswordBtn.addEventListener('click', function() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const storedPassword = localStorage.getItem('userPassword');

    if (!storedPassword) {
        // No password set, allow setting new one
        if (newPassword && newPassword === confirmPassword) {
            localStorage.setItem('userPassword', newPassword);
            alert('Password set successfully!');
            // Clear fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } else {
            alert('New passwords do not match or are empty.');
        }
        return;
    }

    if (currentPassword !== storedPassword) {
        alert('Current password is incorrect.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    if (!newPassword) {
        alert('Please enter a new password.');
        return;
    }

    localStorage.setItem('userPassword', newPassword);
    alert('Password changed successfully!');
    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});

// Modal functionality for save changes
let pendingName, pendingPrivilege;
const modal = document.getElementById('passwordModal');
const verifyPasswordInput = document.getElementById('verifyPassword');
const confirmSaveBtn = document.getElementById('confirmSave');
const cancelSaveBtn = document.getElementById('cancelSave');

// Update save button handler to show modal
document.querySelectorAll('.primary-button').forEach(button => {
    button.addEventListener('click', function() {
        if (button.textContent === 'Save Changes') {
            // Get the values to save
            pendingName = document.getElementById('fullName').value;
            pendingPrivilege = document.querySelector('select.form-input').value;

            // Show modal
            modal.style.display = 'block';
            verifyPasswordInput.focus();
        }
    });
});

// Confirm save
confirmSaveBtn.addEventListener('click', function() {
    const enteredPassword = verifyPasswordInput.value;
    const storedPassword = localStorage.getItem('userPassword');

    if (!storedPassword) {
        alert('No password set. Please set a password first.');
        modal.style.display = 'none';
        return;
    }

    if (enteredPassword !== storedPassword) {
        alert('Incorrect password. Changes not saved.');
        verifyPasswordInput.value = '';
        return;
    }

    // Save changes
    localStorage.setItem('userName', pendingName);
    localStorage.setItem('userPrivilege', pendingPrivilege);

    // Update sidebar welcome text
    const welcomeText = document.querySelector('.sidebar-welcome');
    if (welcomeText) {
        welcomeText.textContent = `Welcome, ${pendingName}`;
    }

    alert('Profile changes saved successfully!');
    modal.style.display = 'none';
    verifyPasswordInput.value = '';
});

// Cancel save
cancelSaveBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    verifyPasswordInput.value = '';
});

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

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        verifyPasswordInput.value = '';
    }
});

// Activity Logs functionality - use shared function if available
if (typeof loadActivityLogs === 'undefined') {
    function loadActivityLogs() {
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

        logs.forEach(log => {
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
}

// Use shared addActivityLog function if available, otherwise use local implementation
if (typeof addActivityLog === 'undefined') {
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
        if (logs.length > 100) {
            logs.pop();
        }
        localStorage.setItem('activityLogs', JSON.stringify(logs));
        if (typeof loadActivityLogs === 'function') {
            loadActivityLogs();
        }
    }
}

// Use shared clearActivityLogs if available
if (typeof clearActivityLogs === 'undefined') {
    function clearActivityLogs() {
        if (confirm('Are you sure you want to clear all activity logs?')) {
            localStorage.removeItem('activityLogs');
            if (typeof loadActivityLogs === 'function') {
                loadActivityLogs();
            }
        }
    }
}

// Initialize activity logs on page load
window.addEventListener('load', function() {
    // ... existing load code ...
    loadActivityLogs();
});

// Add log for profile changes
confirmSaveBtn.addEventListener('click', function() {
    // ... existing confirm save code ...
    if (enteredPassword === storedPassword) {
        // ... existing save code ...
        addActivityLog('Profile Updated', `Name: ${pendingName}, Privilege: ${pendingPrivilege}`);
    }
});

// Add log for password change
changePasswordBtn.addEventListener('click', function() {
    // ... existing password change code ...
    if (newPassword && newPassword === confirmPassword) {
        addActivityLog('Password Changed', 'User password was updated');
    }
});
