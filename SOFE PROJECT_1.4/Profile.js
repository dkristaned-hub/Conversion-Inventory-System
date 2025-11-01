// Constants
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// DOM Elements
const profilePictureInput = document.getElementById('profilePictureInput');
const profileImage = document.getElementById('profileImage');
const sidebarProfileImage = document.querySelector('.sidebar-profile-picture img');
const saveButton = document.querySelector('.primary-button');

// Local Storage Keys
const STORAGE_KEYS = {
    PROFILE_PICTURE: 'profilePicture',
    USER_NAME: 'userName',
    USER_USERNAME: 'userUsername',
    USER_PRIVILEGE: 'userPrivilege',
    USER_PASSWORD: 'userPassword',
    ACTIVITY_LOGS: 'activityLogs'
};

/**
 * Updates all profile pictures in the UI and saves to localStorage
 * @param {string} imageUrl - The URL/base64 of the image to set
 * @returns {void}
 */
function updateAllProfilePictures(imageUrl) {
    try {
        // Update main profile picture
        if (profileImage) {
            profileImage.src = imageUrl;
        }
        // Update sidebar profile picture
        if (sidebarProfileImage) {
            sidebarProfileImage.src = imageUrl;
        }
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.PROFILE_PICTURE, imageUrl);
    } catch (error) {
        console.error('Error updating profile pictures:', error);
        alert('Failed to update profile picture. Please try again.');
    }
}

// Load saved profile picture on page load
window.addEventListener('load', function() {
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
        updateAllProfilePictures(savedProfilePic);
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

// Modal functionality for clear activity logs
const clearLogsModal = document.getElementById('clearLogsModal');
const confirmClearBtn = document.getElementById('confirmClear');
const cancelClearBtn = document.getElementById('cancelClear');

// Event listeners for clear activity logs modal
confirmClearBtn.addEventListener('click', function() {
    localStorage.removeItem('activityLogs');
    loadActivityLogs();
    alert('Activity logs cleared successfully.');
    clearLogsModal.style.display = 'none';
});

cancelClearBtn.addEventListener('click', function() {
    clearLogsModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === clearActivityLogsModal) {
        closeModal('clearActivityLogsModal');
    }
});

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

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = [modal, clearLogsModal];
    modals.forEach(modalElement => {
        if (event.target === modalElement) {
            modalElement.style.display = 'none';
            if (modalElement === modal) {
                verifyPasswordInput.value = '';
            }
        }
    });
});

// Activity Logs functionality
function loadActivityLogs() {
    try {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) || [];
        const tableBody = document.querySelector('#activity-logs tbody');
        if (!tableBody) {
            console.error('Activity logs table body not found');
            return;
        }
        
        tableBody.innerHTML = '';
        const fragment = document.createDocumentFragment();

        logs.forEach(log => {
            const row = document.createElement('tr');
            const cells = [
                { content: log.date, className: 'table-cell' },
                { content: log.activity, className: 'table-cell' },
                { content: log.details, className: 'table-cell' }
            ];

            cells.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.content;
                td.className = cell.className;
                row.appendChild(td);
            });

            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);
    } catch (error) {
        console.error('Error loading activity logs:', error);
        alert('Failed to load activity logs. Please refresh the page.');
    }
}

function addActivityLog(activity, details) {
    const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
    const newLog = {
        date: new Date().toLocaleString(),
        activity: activity,
        details: details
    };
    logs.unshift(newLog); // Add to beginning
    localStorage.setItem('activityLogs', JSON.stringify(logs));
    loadActivityLogs();
}

function clearActivityLogs() {
    clearLogsModal.style.display = 'block';
}

// Initialize activity logs on page load
window.addEventListener('load', function() {
    // ... existing load code ...
    loadActivityLogs();
});

// Handle profile changes
const handleProfileUpdate = async (event) => {
    try {
        const enteredPassword = verifyPasswordInput.value;
        const storedPassword = localStorage.getItem(STORAGE_KEYS.USER_PASSWORD);

        if (!storedPassword || enteredPassword !== storedPassword) {
            throw new Error('Invalid password');
        }

        // Save profile changes
        localStorage.setItem(STORAGE_KEYS.USER_NAME, pendingName);
        localStorage.setItem(STORAGE_KEYS.USER_PRIVILEGE, pendingPrivilege);

        // Update UI
        const welcomeText = document.querySelector('.sidebar-welcome');
        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${pendingName}`;
        }

        // Log the activity
        addActivityLog('Profile Updated', `Name: ${pendingName}, Privilege: ${pendingPrivilege}`);
        
        // Reset form
        modal.style.display = 'none';
        verifyPasswordInput.value = '';
        
        alert('Profile changes saved successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message === 'Invalid password' ? 'Incorrect password. Changes not saved.' : 'Failed to save changes. Please try again.');
    }
};

// Handle password change
const handlePasswordChange = async () => {
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const storedPassword = localStorage.getItem(STORAGE_KEYS.USER_PASSWORD);

        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (!newPassword) {
            throw new Error('New password is required');
        }

        if (storedPassword && currentPassword !== storedPassword) {
            throw new Error('Current password is incorrect');
        }

        // Save new password
        localStorage.setItem(STORAGE_KEYS.USER_PASSWORD, newPassword);
        addActivityLog('Password Changed', 'User password was updated');

        // Reset form
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
            document.getElementById(id).value = '';
        });

        alert('Password changed successfully!');
    } catch (error) {
        console.error('Error changing password:', error);
        alert(error.message || 'Failed to change password. Please try again.');
    }
};

// Event listeners
confirmSaveBtn.addEventListener('click', handleProfileUpdate);
changePasswordBtn.addEventListener('click', handlePasswordChange);
