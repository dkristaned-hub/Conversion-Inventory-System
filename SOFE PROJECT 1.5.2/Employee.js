// Function to toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('minimized');
}

// Function to update profile picture
function updateProfilePicture(imageUrl) {
    const profileImage = document.querySelector('.sidebar-profile-picture img');
    if (profileImage) {
        profileImage.src = imageUrl;
    }
}

// Function to confirm logout
function confirmLogout() {
    const userUsername = localStorage.getItem('userUsername');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === userUsername);
    
    // Check if user is admin (not in users array)
    const isAdmin = userUsername === 'admin123';
    
    // If staff member, show modal with Check Out option
    if (!isAdmin && currentUser && currentUser.employeeId) {
        const logoutModal = document.getElementById('logoutModal');
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
        
        // Set up logout only button (show on second tap - we'll add toggle functionality)
        logoutBtn.onclick = function() {
            closeModal('logoutModal');
            window.location.href = 'Login.html';
        };
        
        // Set up cancel button
        document.getElementById('cancelLogoutBtn').onclick = function() {
            // On first cancel, show logout only option
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
        // Admin or no user, just log out normally with modal
        const logoutModal = document.getElementById('logoutModal');
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

// Function to record checkout
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

// Function to update employee stats
function updateEmployeeStats() {
    const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];

    const totalEmployees = employeeLog.length;

    // Count present employees (status = Present or Checked Out)
    let presentToday = 0;

    attendance.forEach(att => {
        if (att.status === 'Present' || att.status === 'Checked Out') {
            presentToday++;
        }
    });

    // Count unique positions
    const positions = new Set(employeeLog.map(emp => emp.position));
    const totalPositions = positions.size;

    // Update the stats
    document.getElementById('total-employees').textContent = totalEmployees;
    document.getElementById('present-today').textContent = presentToday;
    document.getElementById('total-positions').textContent = totalPositions;
}

// Function to add new account
function addNewAccount() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const fullname = document.getElementById('new-fullname').value.trim();
    const privilege = document.getElementById('new-privilege').value;

    if (!username || !password || !fullname) {
        alert('Please fill in all fields.');
        return;
    }

    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    // Add new user
    users.push({ fullName: fullname, username, password, privilege, email: '' });
    localStorage.setItem('users', JSON.stringify(users));

    // Clear form
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('new-fullname').value = '';
    document.getElementById('new-privilege').value = 'Staff';

    // Update accounts table
    updateAccountsTable();
}

// Function to update accounts table
function updateAccountsTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.querySelector('#accounts-table tbody');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${user.employeeId || 'N/A'}</td>
            <td class="table-cell">${user.username}</td>
            <td class="table-cell">${user.fullName}</td>
            <td class="table-cell">${user.privilege}</td>
            <td class="table-cell">
                <button class="action-button edit" onclick="editAccount(${index})">Edit</button>
                <button class="action-button delete" onclick="deleteAccount(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Global variable to track editing mode
let editingIndex = -1;

// Function to edit account
function editAccount(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];

    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-password').value = user.password;
    document.getElementById('edit-fullname').value = user.fullName;
    document.getElementById('edit-privilege').value = user.privilege;

    window.editingAccountIndex = index;
    document.getElementById('account-modal').style.display = 'block';
}

// Function to save account
function saveAccount() {
    const username = document.getElementById('edit-username').value.trim();
    const password = document.getElementById('edit-password').value.trim();
    const fullname = document.getElementById('edit-fullname').value.trim();
    const privilege = document.getElementById('edit-privilege').value;

    if (!username || !password || !fullname) {
        alert('Please fill in all fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    let employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];

    const originalUsername = users[window.editingAccountIndex].username;
    if (username !== originalUsername && users.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    const oldEmployeeId = users[window.editingAccountIndex].employeeId;
    users[window.editingAccountIndex] = { ...users[window.editingAccountIndex], fullName: fullname, username, password, privilege };
    alert('Account updated successfully!');

    // Update employee log
    const logIndex = employeeLog.findIndex(emp => emp.id === oldEmployeeId);
    if (logIndex >= 0) {
        employeeLog[logIndex] = { name: fullname, position: privilege, id: oldEmployeeId };
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('employeeLog', JSON.stringify(employeeLog));

    // Update tables and stats
    updateAccountsTable();
    updateEmployeeLogTable();
    updateEmployeeStats();

    closeModal('account-modal');
}

// Function to delete account
function deleteAccount(index) {
    // Show password verification modal
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('deleteVerifyPassword').value = '';
    document.getElementById('deleteVerifyPassword').focus();

    // Set up event listeners for modal buttons
    document.getElementById('confirmDelete').onclick = function() {
        const enteredPassword = document.getElementById('deleteVerifyPassword').value;

        if (enteredPassword !== 'admin123') {
            alert('Incorrect password. Account not deleted.');
            document.getElementById('deleteVerifyPassword').value = '';
            return;
        }

        // Proceed with deletion
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const employeeId = users[index].employeeId;
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));

        // Remove from employee log
        let employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
        employeeLog = employeeLog.filter(emp => emp.id !== employeeId);
        localStorage.setItem('employeeLog', JSON.stringify(employeeLog));

        // Update tables and stats
        updateAccountsTable();
        updateEmployeeLogTable();
        updateEmployeeStats();

        alert('Account deleted successfully!');
        closeModal('deleteModal');
    };

    document.getElementById('cancelDelete').onclick = function() {
        closeModal('deleteModal');
    };
}

// Function to clear all accounts
function clearAllAccounts() {
    // Show password verification modal
    document.getElementById('clearAllModal').style.display = 'block';
    document.getElementById('clearAllVerifyPassword').value = '';
    document.getElementById('clearAllVerifyPassword').focus();

    // Set up event listeners for modal buttons
    document.getElementById('confirmClearAll').onclick = function() {
        const enteredPassword = document.getElementById('clearAllVerifyPassword').value;
        
        // Verify admin password
        if (enteredPassword !== 'admin123') {
            alert('❌ Incorrect password. Access denied.');
            document.getElementById('clearAllVerifyPassword').value = '';
            return;
        }

        // Proceed with clearing accounts
        if (confirm('⚠️ Are you sure you want to clear ALL accounts? This action cannot be undone!')) {
            localStorage.removeItem('users');
            // Also clear employee log since accounts are cleared
            localStorage.removeItem('employeeLog');
            // Clear all counters
            localStorage.removeItem('adminCounter');
            localStorage.removeItem('staffCounter');
            updateAccountsTable();
            updateEmployeeLogTable();
            updateEmployeeStats();
            alert('✅ All accounts cleared successfully!');
        }
        closeModal('clearAllModal');
    };

    document.getElementById('cancelClearAll').onclick = function() {
        closeModal('clearAllModal');
    };
}

// Function to toggle the form visibility
function toggleForm() {
    const form = document.querySelector('.account-management');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

// Function to generate employee ID based on privilege
function generateEmployeeId(privilege) {
    let counterKey;
    let prefix;
    if (privilege === 'Admin') {
        counterKey = 'adminCounter';
        prefix = 'ADM';
    } else if (privilege === 'Staff') {
        counterKey = 'staffCounter';
        prefix = 'STF';
    }

    let counter = parseInt(localStorage.getItem(counterKey)) || 1;
    const id = `${prefix}-${counter.toString().padStart(3, '0')}`;
    localStorage.setItem(counterKey, counter + 1);
    return id;
}

// Function to submit the account
function submitAccount() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const fullname = document.getElementById('new-fullname').value.trim();
    const privilege = document.getElementById('new-privilege').value;

    if (!username || !password || !fullname) {
        alert('Please fill in all fields.');
        return;
    }

    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];

    if (editingIndex >= 0) {
        // Editing existing user
        const originalUsername = users[editingIndex].username;
        if (username !== originalUsername && users.some(user => user.username === username)) {
            alert('Username already exists.');
            return;
        }
        const oldEmployeeId = users[editingIndex].employeeId;
        users[editingIndex] = { ...users[editingIndex], fullName: fullname, username, password, privilege };
        editingIndex = -1;
        alert('Account updated successfully!');

        // Update employee log
        const logIndex = employeeLog.findIndex(emp => emp.id === oldEmployeeId);
        if (logIndex >= 0) {
            employeeLog[logIndex] = { name: fullname, position: privilege, id: oldEmployeeId };
        }
    } else {
        // Adding new user
        if (users.some(user => user.username === username)) {
            alert('Username already exists.');
            return;
        }
        const employeeId = generateEmployeeId(privilege);
        users.push({ employeeId, fullName: fullname, username, password, privilege, email: '' });
        alert('Account added successfully!');

        // Add to employee log
        employeeLog.push({ name: fullname, position: privilege, id: employeeId });
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('employeeLog', JSON.stringify(employeeLog));

    // Clear form
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('new-fullname').value = '';
    document.getElementById('new-privilege').value = 'Staff';

    // Update accounts table
    updateAccountsTable();

    // Update employee log table
    updateEmployeeLogTable();

    // Update stats
    updateEmployeeStats();

    // Hide the form after submission
    toggleForm();
}

// Function to update employee log table
function updateEmployeeLogTable() {
    const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    const tbody = document.querySelector('#employee-log-table tbody');
    tbody.innerHTML = '';

    if (employeeLog.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="3">No employees</td>
            </tr>
        `;
        return;
    }

    employeeLog.forEach(employee => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${employee.name}</td>
            <td class="table-cell">${employee.position}</td>
            <td class="table-cell">${employee.id}</td>
        `;
        tbody.appendChild(row);
    });
}

// Admin password verification function
function verifyAdminPassword(callback) {
  const password = prompt('⚠️ Admin Password Required\n\nPlease enter admin password:');
  
  if (password === null) {
    return false;
  }
  
  if (password === 'admin123') {
    callback();
    return true;
  } else {
    alert('❌ Incorrect password. Access denied.');
    return false;
  }
}

// Function to clear employee log
function clearEmployeeLog() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear the employee log? This action cannot be undone.')) {
      localStorage.removeItem('employeeLog');
      updateEmployeeLogTable();
      updateEmployeeStats();
      alert('✅ Employee log cleared successfully!');
    }
  });
}

// Function to update attendance table
function updateAttendanceTable() {
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';

    if (attendance.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="9">No attendance records</td>
            </tr>
        `;
        return;
    }

    attendance.forEach((att, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        // Format dates
        const checkInDate = att.checkInDate || (att.date ? new Date(att.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-');
        const checkOutDate = att.checkOutDate || '-';
        
        row.innerHTML = `
            <td class="table-cell">${att.name}</td>
            <td class="table-cell">${att.id}</td>
            <td class="table-cell">${checkInDate}</td>
            <td class="table-cell">${att.checkIn || '-'}</td>
            <td class="table-cell">${checkOutDate}</td>
            <td class="table-cell">${att.checkOut || '-'}</td>
            <td class="table-cell">${att.status}</td>
            <td class="table-cell">${att.handler || localStorage.getItem('userName') || 'Guest'}</td>
            <td class="table-cell">
                <button class="action-button edit" onclick="editAttendance(${index})">Edit</button>
                <button class="action-button delete" onclick="deleteAttendance(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to edit attendance entry
function editAttendance(index) {
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const att = attendance[index];
    document.getElementById('attendance-checkin').value = convertTo24Hour(att.checkIn);
    document.getElementById('attendance-checkout').value = att.checkOut && att.checkOut !== '-' ? convertTo24Hour(att.checkOut) : '';
    document.getElementById('attendance-status').value = att.status;
    window.editingAttendanceIndex = index;
    document.getElementById('attendance-modal').style.display = 'block';
}

// Function to save attendance
function saveAttendance() {
    const newCheckIn = document.getElementById('attendance-checkin').value.trim();
    const newCheckOut = document.getElementById('attendance-checkout').value.trim();
    const newStatus = document.getElementById('attendance-status').value;
    if (newCheckIn && newStatus) {
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        attendance[window.editingAttendanceIndex] = { ...attendance[window.editingAttendanceIndex], checkIn: convertTo12Hour(newCheckIn), checkOut: newCheckOut ? convertTo12Hour(newCheckOut) : '-', status: newStatus };
        localStorage.setItem('attendance', JSON.stringify(attendance));
        updateAttendanceTable();
        updateEmployeeStats();
        closeModal('attendance-modal');
    } else {
        alert('Please fill in all required fields.');
    }
}

// Function to delete attendance entry
function deleteAttendance(index) {
    if (confirm('Are you sure you want to delete this attendance entry?')) {
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        attendance.splice(index, 1);
        localStorage.setItem('attendance', JSON.stringify(attendance));
        updateAttendanceTable();
        updateEmployeeStats();
    }
}

// Function to clear present attendance
function clearPresentAttendance() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear the present attendance? This action cannot be undone.')) {
      localStorage.removeItem('attendance');
      updateAttendanceTable();
      updateEmployeeStats();
      alert('✅ Present attendance cleared successfully!');
    }
  });
}

// Function to edit employee log entry
function editLog(index) {
    const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    const emp = employeeLog[index];
    const newName = prompt('Enter new name:', emp.name);
    const newPosition = prompt('Enter new position:', emp.position);
    if (newName && newPosition) {
        employeeLog[index] = { name: newName, position: newPosition, id: emp.id };
        localStorage.setItem('employeeLog', JSON.stringify(employeeLog));
        updateEmployeeLogTable();
        updateEmployeeStats();
    }
}

// Function to delete employee log entry
function deleteLog(index) {
    if (confirm('Are you sure you want to delete this employee log entry?')) {
        const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
        employeeLog.splice(index, 1);
        localStorage.setItem('employeeLog', JSON.stringify(employeeLog));
        updateEmployeeLogTable();
        updateEmployeeStats();
    }
}

// Function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12h) {
    if (!time12h) return '';
    const match = time12h.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return time12h; // If already in 24h format or invalid, return as is
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Function to convert 24-hour time to 12-hour format
function convertTo12Hour(time24h) {
    if (!time24h) return '';
    const match = time24h.match(/(\d{2}):(\d{2})/);
    if (!match) return time24h; // If invalid format, return as is
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    return `${hours}:${minutes} ${ampm}`;
}

// Function to edit employee shift
function editShift(index) {
    const shifts = JSON.parse(localStorage.getItem('employeeShifts')) || [];
    const shift = shifts[index];
    document.getElementById('shift-start').value = convertTo24Hour(shift.start);
    document.getElementById('shift-end').value = convertTo24Hour(shift.end);
    document.getElementById('shift-day-start').value = shift.dayStart;
    document.getElementById('shift-day-end').value = shift.dayEnd;
    window.editingShiftIndex = index;
    document.getElementById('shift-modal').style.display = 'block';
}

// Function to save shift
function saveShift() {
    const newStart = document.getElementById('shift-start').value.trim();
    const newEnd = document.getElementById('shift-end').value.trim();
    const newDayStart = document.getElementById('shift-day-start').value.trim();
    const newDayEnd = document.getElementById('shift-day-end').value.trim();
    if (newStart && newEnd && newDayStart && newDayEnd) {
        const shifts = JSON.parse(localStorage.getItem('employeeShifts')) || [];
        shifts[window.editingShiftIndex] = { ...shifts[window.editingShiftIndex], start: convertTo12Hour(newStart), end: convertTo12Hour(newEnd), dayStart: newDayStart, dayEnd: newDayEnd };
        localStorage.setItem('employeeShifts', JSON.stringify(shifts));
        updateEmployeeShiftsTable();
        closeModal('shift-modal');
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to delete employee shift
function deleteShift(index) {
    if (confirm('Are you sure you want to delete this shift?')) {
        const shifts = JSON.parse(localStorage.getItem('employeeShifts')) || [];
        shifts.splice(index, 1);
        localStorage.setItem('employeeShifts', JSON.stringify(shifts));
        updateEmployeeShiftsTable();
    }
}

// Function to update employee shifts table
function updateEmployeeShiftsTable() {
    const shifts = JSON.parse(localStorage.getItem('employeeShifts')) || [];
    const tbody = document.querySelector('#employee-shifts-table tbody');
    tbody.innerHTML = '';

    if (shifts.length === 0) {
        tbody.innerHTML = '<tr class="table-row"><td class="table-cell" colspan="8">No shifts</td></tr>';
        return;
    }

    shifts.forEach((shift, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${shift.name}</td>
            <td class="table-cell">${shift.id}</td>
            <td class="table-cell">${shift.start}</td>
            <td class="table-cell">${shift.end}</td>
            <td class="table-cell">${shift.dayStart}</td>
            <td class="table-cell">${shift.dayEnd}</td>
            <td class="table-cell">${shift.handler || localStorage.getItem('userName') || 'Guest'}</td>
            <td class="table-cell">
                <button class="action-button edit" onclick="editShift(${index})">Edit</button>
                <button class="action-button delete" onclick="deleteShift(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to clear employee shifts
function clearEmployeeShifts() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear the employee shifts? This action cannot be undone.')) {
      localStorage.removeItem('employeeShifts');
      updateEmployeeShiftsTable();
      alert('✅ Employee shifts cleared successfully!');
    }
  });
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Filter function for Employee Log
function filterEmployeeLog() {
    const searchValue = document.getElementById('employee-log-search').value.toLowerCase();
    const table = document.getElementById('employee-log-table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const idCell = cells[2].textContent.toLowerCase();
            if (idCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Employee Log
function clearEmployeeLogFilter() {
    document.getElementById('employee-log-search').value = '';
    filterEmployeeLog();
}

// Filter function for Employee Shifts
function filterEmployeeShifts() {
    const searchValue = document.getElementById('employee-shifts-search').value.toLowerCase();
    const table = document.getElementById('employee-shifts-table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const nameCell = cells[0].textContent.toLowerCase();
            const idCell = cells[1].textContent.toLowerCase();
            if (nameCell.includes(searchValue) || idCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Employee Shifts
function clearEmployeeShiftsFilter() {
    document.getElementById('employee-shifts-search').value = '';
    filterEmployeeShifts();
}

// Filter function for Attendance
function filterAttendance() {
    const searchValue = document.getElementById('attendance-search').value.toLowerCase();
    const table = document.getElementById('attendance-table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const nameCell = cells[0].textContent.toLowerCase();
            const idCell = cells[1].textContent.toLowerCase();
            if (nameCell.includes(searchValue) || idCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Attendance
function clearAttendanceFilter() {
    document.getElementById('attendance-search').value = '';
    filterAttendance();
}

// Filter function for Accounts
function filterAccounts() {
    const searchValue = document.getElementById('accounts-search').value.toLowerCase();
    const table = document.getElementById('accounts-table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const employeeIdCell = cells[0].textContent.toLowerCase();
            const usernameCell = cells[1].textContent.toLowerCase();
            const fullNameCell = cells[2].textContent.toLowerCase();
            if (employeeIdCell.includes(searchValue) || usernameCell.includes(searchValue) || fullNameCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Accounts
function clearAccountsFilter() {
    document.getElementById('accounts-search').value = '';
    filterAccounts();
}

// Load saved data on page load
window.addEventListener('load', function() {
    // Check if user is Admin, if not redirect to Main page
    const savedPrivilege = localStorage.getItem('userPrivilege');
    if (savedPrivilege !== 'Admin') {
        alert('Access Denied: This page is only available for Admin users.');
        window.location.href = 'Main.html';
        return;
    }

    // Initialize empty arrays only if they don't exist
    // Keep attendance data - it's created when users log in
    if (!localStorage.getItem('employeeLog')) {
        localStorage.setItem('employeeLog', JSON.stringify([]));
    }

    if (!localStorage.getItem('employeeShifts')) {
        localStorage.setItem('employeeShifts', JSON.stringify([]));
    }

    // Initialize attendance only if it doesn't exist - DO NOT clear it
    // Attendance is automatically created when users log in
    if (!localStorage.getItem('attendance')) {
        localStorage.setItem('attendance', JSON.stringify([]));
    }
    
    // Initialize users only if it doesn't exist - keep existing accounts
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

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

    // Load privilege level (savedPrivilege already defined above)
    if (savedPrivilege) {
        const modeText = document.querySelector('.sidebar-mode');
        if (modeText) {
            modeText.textContent = `${savedPrivilege} Mode`;
        }
    }

    // Update employee stats
    updateEmployeeStats();

    // Update accounts table
    updateAccountsTable();

    // Update employee log table
    updateEmployeeLogTable();


    // Update attendance table
    updateAttendanceTable();
});
