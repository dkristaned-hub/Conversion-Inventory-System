// Get all elements
const profileImage = document.getElementById('profileImage');
const profileAvatarTrigger = document.getElementById('profileAvatarTrigger');
const profilePictureInput = document.getElementById('profilePictureInput');
const sidebarProfileImage = document.querySelector('.sidebar-profile-picture img');
const profileNameHeading = document.getElementById('profileNameHeading');
const profileRoleLabel = document.getElementById('profileRoleLabel');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const privilegeDisplay = document.getElementById('accountPrivilegeDisplay');
const usernameInput = document.getElementById('username');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('emailAddress');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const editableFields = document.querySelectorAll('[data-profile-editable]');
const changePasswordBtn = document.getElementById('changePasswordBtn');
let isAdminUser = false;

function setFieldState(enable) {
    editableFields.forEach(field => {
        if (!field) return;
        if (field.tagName === 'SELECT' || field.dataset.type === 'select') {
            field.disabled = !enable;
        } else {
            field.readOnly = !enable;
        }
        field.classList.toggle('is-readonly', !enable);
    });
    if (saveProfileBtn) saveProfileBtn.disabled = !enable;
    if (changePasswordBtn) changePasswordBtn.disabled = !enable;
}

function loadProfileData() {
    const storedUsername = localStorage.getItem('userUsername') || '';
    const storedName = localStorage.getItem('userName') || '';
    const storedPrivilege = localStorage.getItem('userPrivilege') || 'Guest';
    const storedEmail = localStorage.getItem('userEmail') || '';

    if (usernameInput) usernameInput.value = storedUsername;
    if (fullNameInput) fullNameInput.value = storedName;
    if (emailInput) emailInput.value = storedEmail;
    if (privilegeDisplay) privilegeDisplay.textContent = storedPrivilege;
    if (profileNameHeading) profileNameHeading.textContent = storedName || 'Your Profile';
    if (profileRoleLabel) profileRoleLabel.textContent = `${storedPrivilege} Mode`;
}

function applyProfilePicture(imageUrl) {
    if (profileImage && imageUrl) profileImage.src = imageUrl;
    if (sidebarProfileImage && imageUrl) sidebarProfileImage.src = imageUrl;
    if (imageUrl) localStorage.setItem('profilePicture', imageUrl);
}

function handleProfileImageUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
    }
    const reader = new FileReader();
    reader.onload = event => applyProfilePicture(event.target.result);
    reader.readAsDataURL(file);
}

if (profilePictureInput) {
    profilePictureInput.addEventListener('change', e => {
        const file = e.target.files[0];
        handleProfileImageUpload(file);
    });
}

if (profileAvatarTrigger && profilePictureInput) {
    profileAvatarTrigger.addEventListener('click', () => {
        if (confirm('Do you want to change your profile photo?')) {
            profilePictureInput.click();
        }
    });
}

window.addEventListener('load', () => {
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
        applyProfilePicture(savedProfilePic);
    }

    loadProfileData();

    const userPrivilege = localStorage.getItem('userPrivilege') || 'Guest';
    isAdminUser = userPrivilege === 'Admin';

    setFieldState(isAdminUser);

    if (!isAdminUser) {
        const infoHost = document.querySelector('.profile-card.account-card .profile-card-body');
        if (infoHost && !infoHost.querySelector('.profile-readonly-banner')) {
            const notice = document.createElement('div');
            notice.className = 'profile-readonly-banner';
            notice.innerHTML = '<strong>Note:</strong> Only Admin users can edit account information and change passwords.';
            infoHost.prepend(notice);
        }
    }

    const savedName = localStorage.getItem('userName');
    if (savedName) {
        const welcomeEl = document.querySelector('.sidebar-welcome');
        if (welcomeEl) welcomeEl.textContent = `Welcome, ${savedName}`;
    }
});

let pendingName, pendingPrivilege, pendingEmail;
const modal = document.getElementById('passwordModal');
const verifyPasswordInput = document.getElementById('verifyPassword');
const confirmSaveBtn = document.getElementById('confirmSave');
const cancelSaveBtn = document.getElementById('cancelSave');

if (verifyPasswordInput) {
    verifyPasswordInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmSaveBtn?.click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelSaveBtn?.click();
        }
    });
}

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
        if (saveProfileBtn.disabled) return;
        pendingName = fullNameInput ? fullNameInput.value : '';
        pendingPrivilege = privilegeDisplay ? privilegeDisplay.textContent : '';
        pendingEmail = emailInput ? emailInput.value : '';
        modal.style.display = 'block';
        if (verifyPasswordInput) {
            verifyPasswordInput.value = '';
            verifyPasswordInput.focus();
        }
    });
}

confirmSaveBtn.addEventListener('click', () => {
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

    localStorage.setItem('userName', pendingName);
    localStorage.setItem('userPrivilege', pendingPrivilege);
    localStorage.setItem('userEmail', pendingEmail || '');

    loadProfileData();

    const welcomeText = document.querySelector('.sidebar-welcome');
    if (welcomeText) welcomeText.textContent = `Welcome, ${pendingName}`;

    if (typeof addActivityLog === 'function') {
        addActivityLog('Profile Updated', `Name: ${pendingName}, Privilege: ${pendingPrivilege}`);
    }

    alert('Profile changes saved successfully!');
    modal.style.display = 'none';
    verifyPasswordInput.value = '';
});

cancelSaveBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    verifyPasswordInput.value = '';
});

changePasswordBtn.addEventListener('click', () => {
    const currentPassword = currentPasswordInput ? currentPasswordInput.value : '';
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    const storedPassword = localStorage.getItem('userPassword');

    if (!storedPassword) {
        if (newPassword && newPassword === confirmPassword) {
            localStorage.setItem('userPassword', newPassword);
            alert('Password set successfully!');
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
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
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    if (typeof addActivityLog === 'function') {
        addActivityLog('Password Changed', 'User password was updated');
    }
});

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
    
    // Check if logout modal exists
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
    
    // If staff member, show modal with Check Out option
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
        // Admin or no user, show simple logout modal
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
        const conductedBy = userPrivilege ? `${userName} (${userPrivilege})`