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

// Function to update top stats
function updateTopStats() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];

    // Calculate total oil volume (Stock In - Stock Out)
    let totalVolume = 0;
    monitorings.forEach(m => {
        if (m.transactionType === 'Stock In') {
            totalVolume += parseFloat(m.quantity || 0);
        } else if (m.transactionType === 'Stock Out') {
            totalVolume -= parseFloat(m.quantity || 0);
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
    
    // Update storage capacity with warning colors
    // Red: when current stock is 0% to 25% of max capacity (0-2500 kg out of 10000 kg)
    // Yellow: when current stock is 26% to 50% of max capacity (2600-5000 kg out of 10000 kg)
    const storageCapacityCard = document.querySelector('.stat-card:nth-child(2)');
    const storageCapacityValue = storageCapacityCard.querySelector('.stat-value');
    if (storageCapacityValue) {
        storageCapacityValue.textContent = `${totalVolume}/${maxCapacity} kg`;
        
        // Remove all warning classes first
        storageCapacityCard.classList.remove('warning-yellow', 'warning-red');
        
        // Add warning classes based on current stock percentage of max capacity
        // Red: current stock <= 25% of max capacity (low stock warning)
        // Yellow: current stock > 25% AND <= 50% of max capacity (moderate stock warning)
        if (usagePercent <= 25) {
            storageCapacityCard.classList.add('warning-red');
        } else if (usagePercent <= 50 && usagePercent > 25) {
            storageCapacityCard.classList.add('warning-yellow');
        }
    }
    
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = typesOfOil;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = pendingDeliveries;
}

// Function to update Today's Deliveries table
function updateTodaysDeliveries() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#today-deliveries-table tbody');
    
    if (!tbody) {
        console.error('Today\'s deliveries table body not found!');
        return;
    }
    
    tbody.innerHTML = '';

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDateStr = (today.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                         today.getDate().toString().padStart(2, '0') + '/' + 
                         today.getFullYear();

    // Filter today's delivery invoices
    const todaysDeliveries = invoices.filter(inv => {
        if (inv.invoiceType !== 'Delivery') return false;
        
        // Parse invoice date (format: MM/DD/YYYY, HH:MM AM/PM)
        if (!inv.date) return false;
        try {
            const [datePart] = inv.date.split(', ');
            if (!datePart) return false;
            return datePart === todayDateStr;
        } catch (e) {
            return false;
        }
    });

    if (todaysDeliveries.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell-muted" colspan="7">No deliveries today</td>
            </tr>
        `;
        return;
    }

    // Sort by time (most recent first)
    todaysDeliveries.sort((a, b) => {
        try {
            const parseTime = (dateStr) => {
                const [, timePart] = dateStr.split(', ');
                if (!timePart) return new Date(0);
                const [time, ampm] = timePart.split(' ');
                let [hour, minute] = time.split(':');
                hour = parseInt(hour);
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return hour * 60 + parseInt(minute);
            };
            return parseTime(b.date) - parseTime(a.date);
        } catch (e) {
            return 0;
        }
    });

    todaysDeliveries.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        // Extract time from date string
        let timeStr = 'N/A';
        try {
            const [, timePart] = invoice.date.split(', ');
            if (timePart) {
                timeStr = timePart;
            }
        } catch (e) {
            // Keep N/A
        }
        
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${timeStr}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${formatOilQuantities(invoice)}</td>
            <td class="table-cell">₱${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell"><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status || 'N/A'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Helper function to get status class (if not defined elsewhere)
function getStatusClass(status) {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower === 'paid') {
        return 'status-paid';
    } else if (statusLower === 'pending') {
        return 'status-pending';
    } else if (statusLower === 'overdue') {
        return 'status-overdue';
    }
    return '';
}

// Helper function to format oil quantities for display
function formatOilQuantities(invoice) {
    // Support both old format (oilType/quantity) and new format (coconutQuantity/palmQuantity)
    if (invoice.coconutQuantity || invoice.palmQuantity) {
        const parts = [];
        if (invoice.coconutQuantity && invoice.coconutQuantity > 0) {
            parts.push(`Coconut: ${parseFloat(invoice.coconutQuantity).toFixed(2)} kg`);
        }
        if (invoice.palmQuantity && invoice.palmQuantity > 0) {
            parts.push(`Palm: ${parseFloat(invoice.palmQuantity).toFixed(2)} kg`);
        }
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    } else if (invoice.oilType && invoice.quantity) {
        // Old format for backward compatibility
        return `${invoice.oilType}: ${parseFloat(invoice.quantity).toFixed(2)} kg`;
    }
    return 'N/A';
}

// Helper function to format total quantity
function formatTotalQuantity(invoice) {
    if (invoice.coconutQuantity || invoice.palmQuantity) {
        const total = (parseFloat(invoice.coconutQuantity || 0) + parseFloat(invoice.palmQuantity || 0)).toFixed(2);
        return `${total} kg`;
    } else if (invoice.quantity) {
        return `${parseFloat(invoice.quantity).toFixed(2)} kg`;
    }
    return invoice.amount || 'N/A';
}

// Function to update Upcoming Resupply Schedule table
function updateUpcomingResupply() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('.content-section:nth-of-type(2) tbody');
    
    if (!tbody) {
        console.error('Upcoming resupply table body not found!');
        return;
    }
    
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
            <td class="table-cell">${formatOilQuantities(invoice)}</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${formatTotalQuantity(invoice)}</td>
            <td class="table-cell"><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}


// Filter function for Resupply Schedule
function filterResupplySchedule() {
    const searchValue = document.getElementById('resupply-date-search').value;
    const table = document.querySelector('.content-section:nth-of-type(2) table');
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

    // Update today's deliveries
    updateTodaysDeliveries();

    // Update upcoming resupply
    updateUpcomingResupply();

    // Update top stats
    updateTopStats();
    
    // Refresh today's deliveries periodically (every minute)
    setInterval(updateTodaysDeliveries, 60000);
});

// Test function for storage capacity warnings (can be called from browser console)
function testStorageCapacityColors() {
    console.log('🧪 Testing Storage Capacity Color Warnings');
    console.log('');
    console.log('To test the colors:');
    console.log('');
    console.log('1. 📝 Method 1: Use Stock In (Recommended)');
    console.log('   - Go to Inventory page');
    console.log('   - Click "Stock In" button');
    console.log('   - Add stock to reach:');
    console.log('     • 5000 kg → Should show YELLOW warning');
    console.log('     • 7500 kg → Should show RED warning');
    console.log('');
    console.log('2. 💻 Method 2: Use Browser Console');
    console.log('   Run these commands in the browser console:');
    console.log('');
    console.log('   // Test Yellow Warning (26-50% of max = 2600-5000 kg)');
    console.log('   testStorageWarning(3000);  // 30% of max -> Yellow');
    console.log('');
    console.log('   // Test Red Warning (0-25% of max = 0-2500 kg)');
    console.log('   testStorageWarning(100);  // 1% of max -> Red');
    console.log('');
    console.log('   // Reset to normal (0% usage = 0 kg)');
    console.log('   testStorageWarning(0);');
    console.log('');
    console.log('3. 📊 Current Status:');
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    let totalVolume = 0;
    monitorings.forEach(m => {
        if (m.transactionType === 'Stock In') {
            totalVolume += parseFloat(m.quantity || 0);
        } else if (m.transactionType === 'Stock Out') {
            totalVolume -= parseFloat(m.quantity || 0);
        }
    });
    totalVolume = Math.max(0, totalVolume);
    const usagePercent = Math.round((totalVolume / 10000) * 100);
    console.log(`   Current storage: ${totalVolume} kg / 10000 kg (${usagePercent}% of max capacity)`);
    if (usagePercent <= 25) {
        console.log('   Status: 🔴 RED WARNING (0-25% of max - LOW STOCK)');
    } else if (usagePercent <= 50 && usagePercent > 25) {
        console.log('   Status: 🟡 YELLOW WARNING (26-50% of max - MODERATE STOCK)');
    } else {
        console.log('   Status: ✅ NORMAL (>50% of max - GOOD STOCK)');
    }
}

// Helper function to test storage warnings (for console testing)
function testStorageWarning(testVolume) {
    // Create test monitoring entries
    let monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    
    // Clear existing Stock In/Out entries for testing
    monitorings = monitorings.filter(m => m.monitoringType !== 'Stock' || 
        (m.transactionType !== 'Stock In' && m.transactionType !== 'Stock Out'));
    
    // Add test Stock In entry
    if (testVolume > 0) {
        const testEntry = {
            id: 'test-' + Date.now(),
            monitoringType: 'Stock',
            transactionType: 'Stock In',
            oilType: 'Coconut Oil',
            quantity: testVolume.toFixed(2),
            date: new Date().toISOString().split('T')[0],
            notes: 'Test entry for storage capacity warning',
            handler: 'Test',
            quantityBefore: '0.00',
            quantityAfter: testVolume.toFixed(2),
            timestamp: new Date().toISOString()
        };
        monitorings.push(testEntry);
    }
    
    localStorage.setItem('monitorings', JSON.stringify(monitorings));
    
    // Update the stats
    updateTopStats();
    
    const usagePercent = Math.round((testVolume / 10000) * 100);
    console.log(`✅ Test volume set to: ${testVolume} kg (${usagePercent}% of max capacity)`);
    if (usagePercent <= 25) {
        console.log('🔴 Storage Capacity card should now show RED background (0-25% of max capacity - LOW STOCK)');
    } else if (usagePercent <= 50 && usagePercent > 25) {
        console.log('🟡 Storage Capacity card should now show YELLOW background (26-50% of max capacity - MODERATE STOCK)');
    } else {
        console.log('✅ Storage Capacity card should show NORMAL (white) background (>50% of max capacity - GOOD STOCK)');
    }
    console.log('📊 Check the Dashboard to see the Storage Capacity stat card color!');
}
