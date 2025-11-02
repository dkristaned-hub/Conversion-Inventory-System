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
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'Login.html';
    }
}

// Function to update employee stats
function updateEmployeeStats() {
    const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];

    const totalEmployees = employeeLog.length;

    // Count present employees (status = Present)
    let presentToday = 0;
    let onShift = 0;

    attendance.forEach(att => {
        if (att.status === 'Present') {
            presentToday++;
            onShift++;
        } else if (att.status === 'Checked Out') {
            presentToday++;
        }
    });

    // Count unique positions
    const positions = new Set(employeeLog.map(emp => emp.position));
    const totalPositions = positions.size;

    // Update the stats
    document.getElementById('total-employees').textContent = totalEmployees;
    document.getElementById('present-today').textContent = presentToday;
    document.getElementById('on-shift').textContent = onShift;
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
        const storedPassword = localStorage.getItem('userPassword');

        if (!storedPassword) {
            alert('No password set. Please set a password first.');
            document.getElementById('deleteModal').style.display = 'none';
            return;
        }

        if (enteredPassword !== storedPassword) {
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
        document.getElementById('deleteModal').style.display = 'none';
    };

    document.getElementById('cancelDelete').onclick = function() {
        document.getElementById('deleteModal').style.display = 'none';
    };
}

// Function to clear all accounts
function clearAllAccounts() {
    if (confirm('Are you sure you want to clear all accounts? This action cannot be undone.')) {
        localStorage.removeItem('users');
        // Also clear employee log since accounts are cleared
        localStorage.removeItem('employeeLog');
        updateAccountsTable();
        updateEmployeeLogTable();
        updateEmployeeStats();
    }
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
    } else if (privilege === 'Manager') {
        counterKey = 'managerCounter';
        prefix = 'MNG';
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

// Function to clear employee log
function clearEmployeeLog() {
    if (confirm('Are you sure you want to clear the employee log? This action cannot be undone.')) {
        localStorage.removeItem('employeeLog');
        updateEmployeeLogTable();
        updateEmployeeStats();
    }
}

// Function to update attendance table
function updateAttendanceTable() {
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';

    if (attendance.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="7">No attendance records</td>
            </tr>
        `;
        return;
    }

    attendance.forEach((att, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${att.name}</td>
            <td class="table-cell">${att.id}</td>
            <td class="table-cell">${att.checkIn}</td>
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
    document.getElementById('attendance-checkin').value = att.checkIn;
    document.getElementById('attendance-checkout').value = att.checkOut || '';
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
        attendance[window.editingAttendanceIndex] = { ...attendance[window.editingAttendanceIndex], checkIn: newCheckIn, checkOut: newCheckOut || '-', status: newStatus };
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
    if (confirm('Are you sure you want to clear the present attendance? This action cannot be undone.')) {
        localStorage.removeItem('attendance');
        updateAttendanceTable();
        updateEmployeeStats();
    }
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

// Function to edit employee shift
function editShift(index) {
    const shifts = JSON.parse(localStorage.getItem('employeeShifts')) || [];
    const shift = shifts[index];
    document.getElementById('shift-start').value = shift.start;
    document.getElementById('shift-end').value = shift.end;
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
        shifts[window.editingShiftIndex] = { ...shifts[window.editingShiftIndex], start: newStart, end: newEnd, dayStart: newDayStart, dayEnd: newDayEnd };
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
    if (confirm('Are you sure you want to clear the employee shifts? This action cannot be undone.')) {
        localStorage.removeItem('employeeShifts');
        updateEmployeeShiftsTable();
    }
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Load saved data on page load
window.addEventListener('load', function() {
    // Initialize example data if localStorage is empty
    if (!localStorage.getItem('employeeLog')) {
        const exampleEmployeeLog = [
            { name: 'John Doe', position: 'Manager', id: 'ADM-001' },
            { name: 'Jane Smith', position: 'Supervisor', id: 'STF-001' },
            { name: 'Bob Johnson', position: 'Technician', id: 'MNG-001' }
        ];
        localStorage.setItem('employeeLog', JSON.stringify(exampleEmployeeLog));
    }

    if (!localStorage.getItem('employeeShifts')) {
        const exampleShifts = [
            { name: 'John Doe', id: 'ADM-001', start: '08:00 AM', end: '05:00 PM', dayStart: 'Monday', dayEnd: 'Friday' },
            { name: 'Jane Smith', id: 'STF-001', start: '09:00 AM', end: '06:00 PM', dayStart: 'Monday', dayEnd: 'Friday' },
            { name: 'Bob Johnson', id: 'MNG-001', start: '07:00 AM', end: '03:00 PM', dayStart: 'Tuesday', dayEnd: 'Saturday' }
        ];
        localStorage.setItem('employeeShifts', JSON.stringify(exampleShifts));
    }

    if (!localStorage.getItem('attendance')) {
        const exampleAttendance = [
            { name: 'John Doe', id: 'MNG-001', checkIn: '08:15 AM', checkOut: '-', status: 'Present' },
            { name: 'Jane Smith', id: 'STF-001', checkIn: '09:05 AM', checkOut: '05:30 PM', status: 'Checked Out' },
            { name: 'Bob Johnson', id: 'ADM-001', checkIn: '07:10 AM', checkOut: '-', status: 'Present' }
        ];
        localStorage.setItem('attendance', JSON.stringify(exampleAttendance));
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

    // Load privilege level
    const savedPrivilege = localStorage.getItem('userPrivilege');
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

    // Update employee shifts table
    updateEmployeeShiftsTable();

    // Update attendance table
    updateAttendanceTable();
});
