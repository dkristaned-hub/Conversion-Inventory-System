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

// Activity Logs functionality
function loadActivityLogs() {
    const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
    const tableBody = document.querySelector('#activity-logs tbody');
    tableBody.innerHTML = '';

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="table-cell">${log.date}</td>
            <td class="table-cell">${log.activity}</td>
            <td class="table-cell">${log.details}</td>
        `;
        tableBody.appendChild(row);
    });
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
    if (confirm('Are you sure you want to clear all activity logs?')) {
        localStorage.removeItem('activityLogs');
        loadActivityLogs();
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
