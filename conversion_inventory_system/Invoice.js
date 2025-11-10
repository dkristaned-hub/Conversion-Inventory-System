/*  */// Function to update profile picture
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

// Function to generate automatic invoice ID
function generateInvoiceId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    // Get all existing invoices
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    
    // Filter invoices from today
    const todayInvoices = invoices.filter(inv => {
        if (!inv.invoiceId) return false;
        // Extract date from invoice ID (format: INV-YYYYMMDD-XXX)
        const match = inv.invoiceId.match(/INV-(\d{8})-/);
        return match && match[1] === datePrefix;
    });
    
    // Get the highest sequence number for today
    let maxSequence = 0;
    todayInvoices.forEach(inv => {
        const match = inv.invoiceId.match(/INV-\d{8}-(\d+)/);
        if (match) {
            const seq = parseInt(match[1], 10);
            if (seq > maxSequence) {
                maxSequence = seq;
            }
        }
    });
    
    // Generate next sequence number
    const nextSequence = maxSequence + 1;
    const sequenceStr = String(nextSequence).padStart(3, '0');
    
    return `INV-${datePrefix}-${sequenceStr}`;
}

// Function to auto-generate and set invoice ID
function setAutoInvoiceId() {
    const invoiceIdField = document.getElementById('invoiceId');
    if (invoiceIdField) {
        invoiceIdField.value = generateInvoiceId();
    }
}

// Function to toggle delivery fields (oil type and quantity) based on invoice type
function toggleDeliveryFields() {
    const invoiceType = document.getElementById('invoiceType').value;
    const deliveryOilFields = document.getElementById('deliveryOilFields');
    const deliveryOilQuantityFields = document.getElementById('deliveryOilQuantityFields');
    const oilTypeLabelGroup = document.getElementById('oilTypeLabelGroup');
    const coconutQuantity = document.getElementById('coconutQuantity');
    const palmQuantity = document.getElementById('palmQuantity');
    
    if (invoiceType === 'Delivery') {
        // Show oil type label and display
        if (oilTypeLabelGroup) {
            oilTypeLabelGroup.style.display = 'flex';
        }
        // Show delivery oil filter buttons
        if (deliveryOilFields) {
            deliveryOilFields.style.display = 'flex';
        }
        // Show quantity fields (default to "Both Oil")
        if (deliveryOilQuantityFields) {
            deliveryOilQuantityFields.style.display = 'flex';
        }
        // Set default to "Both Oil"
        selectOilTypeFilter('both');
    } else {
        // Hide oil type label and display
        if (oilTypeLabelGroup) {
            oilTypeLabelGroup.style.display = 'none';
        }
        // Hide delivery oil fields
        if (deliveryOilFields) {
            deliveryOilFields.style.display = 'none';
        }
        if (deliveryOilQuantityFields) {
            deliveryOilQuantityFields.style.display = 'none';
        }
        
        // Clear values
        if (coconutQuantity) {
            coconutQuantity.value = '';
        }
        if (palmQuantity) {
            palmQuantity.value = '';
        }
    }
}

// Function to handle oil type filter button selection
function selectOilTypeFilter(filterType) {
    const buttons = document.querySelectorAll('.oil-type-filter-btn');
    const coconutQuantityGroup = document.getElementById('coconutQuantityGroup');
    const palmQuantityGroup = document.getElementById('palmQuantityGroup');
    const oilTypeDisplayText = document.getElementById('oilTypeDisplayText');
    
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    buttons.forEach(btn => {
        if ((filterType === 'both' && btn.textContent.trim() === 'Both Oil') ||
            (filterType === 'coconut' && btn.textContent.trim() === 'Coconut Oil') ||
            (filterType === 'palm' && btn.textContent.trim() === 'Palm Oil')) {
            btn.classList.add('active');
        }
    });
    
    // Update oil type display text
    if (oilTypeDisplayText) {
        if (filterType === 'both') {
            oilTypeDisplayText.textContent = 'BOTH OIL';
        } else if (filterType === 'coconut') {
            oilTypeDisplayText.textContent = 'COCONUT OIL';
        } else if (filterType === 'palm') {
            oilTypeDisplayText.textContent = 'PALM OIL';
        }
    }
    
    // Show/hide quantity fields based on selection
    if (filterType === 'both') {
        // Show both fields
        if (coconutQuantityGroup) coconutQuantityGroup.style.display = 'flex';
        if (palmQuantityGroup) palmQuantityGroup.style.display = 'flex';
    } else if (filterType === 'coconut') {
        // Show only Coconut Oil
        if (coconutQuantityGroup) coconutQuantityGroup.style.display = 'flex';
        if (palmQuantityGroup) palmQuantityGroup.style.display = 'none';
        // Clear Palm Oil quantity
        const palmQuantity = document.getElementById('palmQuantity');
        if (palmQuantity) palmQuantity.value = '';
    } else if (filterType === 'palm') {
        // Show only Palm Oil
        if (coconutQuantityGroup) coconutQuantityGroup.style.display = 'none';
        if (palmQuantityGroup) palmQuantityGroup.style.display = 'flex';
        // Clear Coconut Oil quantity
        const coconutQuantity = document.getElementById('coconutQuantity');
        if (coconutQuantity) coconutQuantity.value = '';
    }
}

// Function to prevent invalid characters in number inputs (e, E, +, -)
function preventInvalidNumberInput(event) {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right arrow keys
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        return;
    }
    // Block: e, E, +, - (keyCode 69 = e/E, 187 = +, 189 = -)
    if (event.keyCode === 69 || event.keyCode === 187 || event.keyCode === 189) {
        event.preventDefault();
        return false;
    }
    // Ensure that it is a number (0-9) or decimal point
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode !== 190 && event.keyCode !== 110) {
        event.preventDefault();
        return false;
    }
}

// Function to clean invalid characters from pasted values
function cleanNumberInput(input) {
    if (!input) return;
    // Remove invalid characters: e, E, +, - (except at the start for negative, but we use min="0" so no negatives)
    let value = input.value.replace(/[eE+\-]/g, '');
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    input.value = value;
}

// Function to select oil type from button click
function selectOilType(oilType) {
    const oilTypeSelect = document.getElementById('oilType');
    const oilTypeDisplayText = document.getElementById('oilTypeDisplayText');
    
    if (oilTypeSelect) {
        // Set the hidden input value for form submission
        oilTypeSelect.value = oilType;
        
        // Update display text
        if (oilTypeDisplayText) {
            if (oilType === '') {
                // When "All" is clicked, show "COCONUT AND PALM"
                oilTypeDisplayText.textContent = 'COCONUT AND PALM';
                updateOilTypeButtonStates('all');
            } else {
                // When a specific oil is clicked, show that oil type
                oilTypeDisplayText.textContent = oilType.toUpperCase();
                updateOilTypeButtonStates(oilType);
            }
        }
        
        // Trigger change event in case other code listens to it
        oilTypeSelect.dispatchEvent(new Event('change'));
    }
}

// Function to update oil type button active states
function updateOilTypeButtonStates(selectedOilType) {
    const buttons = document.querySelectorAll('.oil-type-btn');
    buttons.forEach(btn => {
        const btnText = btn.textContent.trim();
        // Remove active class from all buttons first
        btn.classList.remove('active');
        
        if (selectedOilType === 'all') {
            // When "All" is active, highlight All, Coconut, and Palm buttons
            if (btnText === 'All' || btnText === 'Coconut Oil' || btnText === 'Palm Oil') {
                btn.classList.add('active');
            }
        } else if (btnText === selectedOilType) {
            // When a specific oil type is selected, highlight only that button
            btn.classList.add('active');
        }
        // If selectedOilType is empty string but not 'all', no buttons are active
    });
}

// Listen for changes to the oil type input to update button states and display
document.addEventListener('DOMContentLoaded', function() {
    // Ensure confirmation modal is hidden immediately on DOM ready
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.setProperty('display', 'none', 'important');
    }
    
    // Ensure admin password modal is hidden immediately on DOM ready
    const adminPasswordModal = document.getElementById('adminPasswordModal');
    if (adminPasswordModal) {
        adminPasswordModal.style.setProperty('display', 'none', 'important');
    }
    
    const oilTypeSelect = document.getElementById('oilType');
    const oilTypeDisplayText = document.getElementById('oilTypeDisplayText');
    
    if (oilTypeSelect) {
        oilTypeSelect.addEventListener('change', function() {
            const value = this.value;
            updateOilTypeButtonStates(value === '' ? 'all' : value);
            
            // Update display text
            if (oilTypeDisplayText) {
                if (value === '') {
                    oilTypeDisplayText.textContent = 'COCONUT AND PALM';
                } else {
                    oilTypeDisplayText.textContent = value.toUpperCase();
                }
            }
        });
    }
});

// Function to decrease inventory stock for delivery invoice
function decreaseInventoryForDelivery(oilType, quantity) {
    if (!oilType || !quantity || quantity <= 0) {
        return false;
    }
    
    let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    let item = inventory.find(inv => inv.oilType === oilType);
    
    if (!item) {
        alert(`⚠️ Warning: Oil type "${oilType}" not found in inventory. Stock will not be decreased.`);
        return false;
    }
    
    const currentStock = parseFloat(item.currentStock || 0);
    const quantityToDecrease = parseFloat(quantity);
    
    if (currentStock < quantityToDecrease) {
        if (!confirm(`⚠️ Warning: Current stock (${currentStock.toFixed(2)} kg) is less than delivery quantity (${quantityToDecrease.toFixed(2)} kg). Do you want to proceed?`)) {
            return false;
        }
    }
    
    // Decrease stock
    const quantityBefore = currentStock;
    item.currentStock = Math.max(0, quantityBefore - quantityToDecrease);
    
    // Update status based on new stock level
    const minLevel = parseFloat(item.minimumLevel || 0);
    item.status = parseFloat(item.currentStock) < minLevel ? 'Low Stock' : 'Normal';
    item.handler = localStorage.getItem('userName') || 'Admin';
    
    // Save updated inventory
    localStorage.setItem('currentInventory', JSON.stringify(inventory));
    
    // Create transaction record for monitoring
    const transaction = {
        id: Date.now().toString(),
        monitoringType: 'Stock',
        transactionType: 'Stock Out',
        oilType: oilType,
        quantity: quantityToDecrease.toFixed(2),
        date: new Date().toISOString().split('T')[0],
        notes: `Automatic stock decrease from delivery invoice`,
        handler: localStorage.getItem('userName') || 'Admin',
        quantityBefore: quantityBefore.toFixed(2),
        quantityAfter: parseFloat(item.currentStock).toFixed(2),
        timestamp: new Date().toISOString()
    };
    
    // Save transaction to monitorings
    let monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    monitorings.push(transaction);
    localStorage.setItem('monitorings', JSON.stringify(monitorings));
    
    // Log activity
    if (typeof addActivityLog === 'function') {
        addActivityLog(
            'Stock Out (Delivery Invoice)',
            `${oilType}: Stock Out ${quantityToDecrease.toFixed(2)}kg (Before: ${quantityBefore.toFixed(2)}kg, After: ${item.currentStock.toFixed(2)}kg) - From delivery invoice`
        );
    }
    
    // Update inventory display if function exists
    if (typeof updateCurrentInventory === 'function') {
        updateCurrentInventory();
    }
    if (typeof updateTopStats === 'function') {
        updateTopStats();
    }
    
    return true;
}

// Function to submit invoice
function submitInvoice(event) {
    event.preventDefault();

    // Auto-generate invoice ID if empty
    let invoiceId = document.getElementById('invoiceId').value;
    if (!invoiceId || invoiceId.trim() === '') {
        invoiceId = generateInvoiceId();
        document.getElementById('invoiceId').value = invoiceId;
    }
    
    const supplier = document.getElementById('supplier').value; // This is actually customer name
    const amount = parseFloat(document.getElementById('amount').value);
    const dueDate = document.getElementById('dueDate').value;
    const status = document.getElementById('status').value;
    const invoiceType = document.getElementById('invoiceType').value;
    const coconutQuantity = parseFloat(document.getElementById('coconutQuantity').value) || 0;
    const palmQuantity = parseFloat(document.getElementById('palmQuantity').value) || 0;

    // Validation
    if (!invoiceId || !supplier || isNaN(amount) || amount <= 0 || !dueDate || !status || !invoiceType) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    // For delivery invoices, require at least one oil quantity
    if (invoiceType === 'Delivery') {
        // Validate that at least one oil quantity is entered
        if ((!coconutQuantity || coconutQuantity <= 0) && (!palmQuantity || palmQuantity <= 0)) {
            alert('Please enter quantity for at least one oil type (Coconut Oil or Palm Oil) for delivery invoices.');
            return;
        }
        
        // Decrease inventory stock for each oil type that has quantity
        if (coconutQuantity > 0) {
            if (!decreaseInventoryForDelivery('Coconut Oil', coconutQuantity)) {
                // User cancelled or error occurred
                return;
            }
        }
        
        if (palmQuantity > 0) {
            if (!decreaseInventoryForDelivery('Palm Oil', palmQuantity)) {
                // User cancelled or error occurred
                return;
            }
        }
    }

    const now = new Date();
    const date = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', ''); // Format as MM/DD/YYYY, HH:MM AM/PM

    const invoice = {
        invoiceId,
        date,
        supplier, // This is customer name
        amount,
        dueDate,
        status,
        invoiceType,
        coconutQuantity: invoiceType === 'Delivery' ? (coconutQuantity > 0 ? coconutQuantity : null) : null,
        palmQuantity: invoiceType === 'Delivery' ? (palmQuantity > 0 ? palmQuantity : null) : null,
        paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : null,
        handler: localStorage.getItem('userName') || 'Guest'
    };

    // Get existing invoices
    let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    console.log('Invoice saved to localStorage:', invoice);
    console.log('Total invoices now:', invoices.length);

    // Log activity
    if (typeof addActivityLog === 'function') {
      addActivityLog(
        'Invoice Created',
        `${invoiceType} Invoice #${invoiceId}: ${supplier} - Amount: ₱${amount.toLocaleString()}, Status: ${status}`
      );
    }

    alert('Invoice submitted successfully!');

    // Clear form fields (but keep invoice ID auto-generated)
    document.getElementById('supplier').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('status').value = 'Pending';
    document.getElementById('invoiceType').value = 'Delivery';
    document.getElementById('coconutQuantity').value = '';
    document.getElementById('palmQuantity').value = '';
    // Auto-generate new invoice ID for next invoice
    setAutoInvoiceId();
    // Update delivery fields visibility
    toggleDeliveryFields();

    // Update tables and stats
    updatePendingInvoices();
    updateInvoiceHistory();
    updateInvoiceStats();
    updateSalesTable();
    updateDeliveryTable();
    
    // Update dashboard if function exists (for today's deliveries)
    if (typeof updateTodaysDeliveries === 'function') {
        updateTodaysDeliveries();
    }
    if (typeof updateTopStats === 'function') {
        updateTopStats();
    }
}

// Function to clear form
function clearForm() {
    if (confirm('Are you sure you want to clear the form? This will reset all fields.')) {
        document.getElementById('supplier').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('status').value = 'Pending';
        document.getElementById('invoiceType').value = 'Delivery';
        document.getElementById('coconutQuantity').value = '';
        document.getElementById('palmQuantity').value = '';
        // Auto-generate new invoice ID after clearing
        setAutoInvoiceId();
        // Update delivery fields visibility
        toggleDeliveryFields();
    }
}

// Function to filter pending invoices by date
function filterPendingInvoices() {
    const dateFilter = document.getElementById('pending-date-search').value;
    updatePendingInvoices(dateFilter);
}

// Function to clear date filter
function clearPendingDateFilter() {
    document.getElementById('pending-date-search').value = '';
    updatePendingInvoices();
}

// Filter function for Sales Invoices
function filterSalesInvoices() {
    const searchValue = document.getElementById('sales-date-search').value;
    const table = document.querySelector('#sales-table');
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
            const dateCell = cells[1].textContent.trim();
            // Parse date to match format
            let datePart = dateCell;
            if (dateCell.includes(',')) {
                [datePart] = dateCell.split(', ');
            }
            if (datePart.includes('/')) {
                const [month, day, year] = datePart.split('/');
                const converted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (converted === searchValue) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Sales Invoices
function clearSalesFilter() {
    document.getElementById('sales-date-search').value = '';
    filterSalesInvoices();
}

// Filter function for Delivery Invoices
function filterDeliveryInvoices() {
    const searchValue = document.getElementById('delivery-date-search').value;
    const table = document.querySelector('#delivery-table');
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
            const dateCell = cells[1].textContent.trim();
            // Parse date to match format
            let datePart = dateCell;
            if (dateCell.includes(',')) {
                [datePart] = dateCell.split(', ');
            }
            if (datePart.includes('/')) {
                const [month, day, year] = datePart.split('/');
                const converted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (converted === searchValue) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Delivery Invoices
function clearDeliveryFilter() {
    document.getElementById('delivery-date-search').value = '';
    filterDeliveryInvoices();
}

// Filter function for Invoice History
function filterInvoiceHistory() {
    const searchValue = document.getElementById('invoice-history-date-search').value;
    const table = document.querySelector('#invoice-history-table');
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
            const dateCell = cells[1].textContent.trim();
            // Parse date to match format
            let datePart = dateCell;
            if (dateCell.includes(',')) {
                [datePart] = dateCell.split(', ');
            }
            if (datePart.includes('/')) {
                const [month, day, year] = datePart.split('/');
                const converted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (converted === searchValue) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Invoice History
function clearInvoiceHistoryFilter() {
    document.getElementById('invoice-history-date-search').value = '';
    filterInvoiceHistory();
}

// ==========================
// 🔹 TAB MANAGEMENT FUNCTIONS
// ==========================

// Function to show invoice tab
function showInvoiceTab(tabName, event) {
    // Prevent default if event is provided
    if (event) {
        event.preventDefault();
    }
    
    // Hide all tabs
    document.getElementById('status-invoices-tab').style.display = 'none';
    document.getElementById('types-invoices-tab').style.display = 'none';
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.conversion-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab and add active class
    if (tabName === 'status') {
        document.getElementById('status-invoices-tab').style.display = 'block';
        tabButtons[0].classList.add('active');
        updateStatusInvoices();
    } else if (tabName === 'types') {
        document.getElementById('types-invoices-tab').style.display = 'block';
        tabButtons[1].classList.add('active');
        updateTypeInvoices();
    }
}

// ==========================
// 🔹 STATUS INVOICES FUNCTIONS
// ==========================

// Current status filter
let currentStatusFilter = 'all';
let currentStatusDateFilter = null;

// Function to update Status Invoices table
function updateStatusInvoices(statusFilter = 'all', dateFilter = null) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#status-invoices-table tbody');
    
    if (!tbody) {
        console.error('Status invoices table body not found!');
        return;
    }
    
    // Update current filters
    currentStatusFilter = statusFilter;
    currentStatusDateFilter = dateFilter;
    
    // Filter invoices by status
    let filteredInvoices = invoices;
    if (statusFilter !== 'all') {
        filteredInvoices = invoices.filter(inv => {
            const invStatus = (inv.status || '').toLowerCase();
            return invStatus === statusFilter.toLowerCase();
        });
    }
    
    // Filter by date if provided
    if (dateFilter) {
        filteredInvoices = filteredInvoices.filter(inv => {
            if (!inv.date) return false;
            try {
                // Parse invoice date (format: MM/DD/YYYY, HH:MM AM/PM)
                const parseInvoiceDate = (dateStr) => {
                    const [datePart] = dateStr.split(', ');
                    if (!datePart) return null;
                    const [month, day, year] = datePart.split('/');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                };
                
                const invoiceDate = parseInvoiceDate(inv.date);
                return invoiceDate === dateFilter;
            } catch (e) {
                return false;
            }
        });
    }
    
    // Sort by date (most recent first)
    filteredInvoices.sort((a, b) => {
        try {
            const parseInvoiceDate = (dateStr) => {
                const [datePart, timePart] = dateStr.split(', ');
                if (!datePart) return new Date(0);
                const [month, day, year] = datePart.split('/');
                if (!timePart) {
                    return new Date(year, month - 1, day);
                }
                const [time, ampm] = timePart.split(' ');
                let [hour, minute] = time.split(':');
                hour = parseInt(hour);
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return new Date(year, month - 1, day, hour, minute);
            };
            return parseInvoiceDate(b.date) - parseInvoiceDate(a.date);
        } catch (e) {
            return 0;
        }
    });
    
    tbody.innerHTML = '';
    
    if (filteredInvoices.length === 0) {
        const filterText = statusFilter !== 'all' ? statusFilter : 'invoices';
        const dateText = dateFilter ? ' for selected date' : '';
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="8">No ${filterText} invoices found${dateText}</td>
            </tr>
        `;
        return;
    }
    
    filteredInvoices.forEach((invoice) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.dueDate || 'N/A'}</td>
            <td class="table-cell"><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status || 'N/A'}</span></td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to filter status invoices by status
function filterStatusInvoices(status, event) {
    if (event) {
        event.preventDefault();
    }
    
    // Update active button
    const buttons = document.querySelectorAll('#status-invoices-tab .status-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update table
    updateStatusInvoices(status, currentStatusDateFilter);
}

// Function to filter status invoices by date
function filterStatusInvoicesByDate() {
    const dateInput = document.getElementById('status-date-search');
    const dateFilter = dateInput.value;
    updateStatusInvoices(currentStatusFilter, dateFilter);
}

// Function to clear status date filter
function clearStatusDateFilter() {
    document.getElementById('status-date-search').value = '';
    updateStatusInvoices(currentStatusFilter, null);
}

// Function to clear status invoices
function clearStatusInvoices() {
    verifyAdminPassword(() => {
        showConfirmationModal(
            'Confirm Clear',
            'Are you sure you want to clear all invoices? This action cannot be undone.',
            () => {
                localStorage.removeItem('invoices');
                updateStatusInvoices();
                updateTypeInvoices();
                updateInvoiceStats();
                alert('✅ All invoices cleared!');
            }
        );
    }, 'Verify Admin Password to Clear Status Invoices');
}

// ==========================
// 🔹 TYPE INVOICES FUNCTIONS
// ==========================

// Current type filter
let currentTypeFilter = 'all';
let currentTypeDateFilter = null;

// Function to update Type Invoices table
function updateTypeInvoices(typeFilter = 'all', dateFilter = null) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#types-invoices-table tbody');
    
    if (!tbody) {
        console.error('Type invoices table body not found!');
        return;
    }
    
    // Update current filters
    currentTypeFilter = typeFilter;
    currentTypeDateFilter = dateFilter;
    
    // Filter invoices by type
    let filteredInvoices = invoices;
    if (typeFilter !== 'all') {
        filteredInvoices = invoices.filter(inv => inv.invoiceType === typeFilter);
    }
    
    // Filter by date if provided
    if (dateFilter) {
        filteredInvoices = filteredInvoices.filter(inv => {
            if (!inv.date) return false;
            try {
                // Parse invoice date (format: MM/DD/YYYY, HH:MM AM/PM)
                const parseInvoiceDate = (dateStr) => {
                    const [datePart] = dateStr.split(', ');
                    if (!datePart) return null;
                    const [month, day, year] = datePart.split('/');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                };
                
                const invoiceDate = parseInvoiceDate(inv.date);
                return invoiceDate === dateFilter;
            } catch (e) {
                return false;
            }
        });
    }
    
    // Sort by date (most recent first)
    filteredInvoices.sort((a, b) => {
        try {
            const parseInvoiceDate = (dateStr) => {
                const [datePart, timePart] = dateStr.split(', ');
                if (!datePart) return new Date(0);
                const [month, day, year] = datePart.split('/');
                if (!timePart) {
                    return new Date(year, month - 1, day);
                }
                const [time, ampm] = timePart.split(' ');
                let [hour, minute] = time.split(':');
                hour = parseInt(hour);
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return new Date(year, month - 1, day, hour, minute);
            };
            return parseInvoiceDate(b.date) - parseInvoiceDate(a.date);
        } catch (e) {
            return 0;
        }
    });
    
    tbody.innerHTML = '';
    
    if (filteredInvoices.length === 0) {
        const filterText = typeFilter !== 'all' ? typeFilter.toLowerCase() : 'invoices';
        const dateText = dateFilter ? ' for selected date' : '';
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="8">No ${filterText} invoices found${dateText}</td>
            </tr>
        `;
        return;
    }
    
    filteredInvoices.forEach((invoice) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.invoiceType || 'N/A'}</td>
            <td class="table-cell"><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status || 'N/A'}</span></td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to filter type invoices by type
function filterTypeInvoices(type, event) {
    if (event) {
        event.preventDefault();
    }
    
    // Update active button
    const buttons = document.querySelectorAll('#types-invoices-tab .status-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update table
    updateTypeInvoices(type, currentTypeDateFilter);
}

// Function to filter type invoices by date
function filterTypeInvoicesByDate() {
    const dateInput = document.getElementById('type-date-search');
    const dateFilter = dateInput.value;
    updateTypeInvoices(currentTypeFilter, dateFilter);
}

// Function to clear type date filter
function clearTypeDateFilter() {
    document.getElementById('type-date-search').value = '';
    updateTypeInvoices(currentTypeFilter, null);
}

// Function to clear type invoices
function clearTypeInvoices() {
    verifyAdminPassword(() => {
        showConfirmationModal(
            'Confirm Clear',
            'Are you sure you want to clear all invoices? This action cannot be undone.',
            () => {
                localStorage.removeItem('invoices');
                updateStatusInvoices();
                updateTypeInvoices();
                updateInvoiceStats();
                alert('✅ All invoices cleared!');
            }
        );
    }, 'Verify Admin Password to Clear Type Invoices');
}

// ==========================
// 🔹 STATUS BADGE HELPER FUNCTION
// ==========================

// Function to get status badge class
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

// ==========================
// 🔹 LEGACY FUNCTIONS (for backward compatibility)
// ==========================

// Function to update Pending Invoices table (legacy - redirects to status invoices)
function updatePendingInvoices(dateFilter = null) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#pending-invoices-table tbody');
    
    if (!tbody) {
        console.error('Pending Invoices table body not found!');
        return;
    }
    
    tbody.innerHTML = '';

    let pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');

    // Filter by date if provided
    if (dateFilter) {
        console.log('Filtering by date:', dateFilter);
        pendingInvoices = pendingInvoices.filter(inv => {
            if (!inv.date) {
                console.log('Invoice missing date:', inv);
                return false;
            }
            
            console.log('Checking invoice date:', inv.date);
            
            // Parse the invoice date (format: MM/DD/YYYY, HH:MM AM/PM or MM/DD/YYYY HH:MM AM/PM)
            try {
                // Handle different date formats
                let datePart = inv.date;
                
                // If it contains a comma, split by comma
                if (inv.date.includes(',')) {
                    [datePart] = inv.date.split(', ');
                } else {
                    // If no comma, try splitting by space (format: MM/DD/YYYY HH:MM AM/PM)
                    [datePart] = inv.date.split(' ');
                }
                
                if (!datePart) {
                    console.log('Could not extract date part from:', inv.date);
                    return false;
                }
                
                const dateParts = datePart.split('/');
                if (dateParts.length !== 3) {
                    console.log('Invalid date format, parts:', dateParts, 'from:', datePart);
                    return false;
                }
                
                const month = parseInt(dateParts[0], 10);
                const day = parseInt(dateParts[1], 10);
                const year = dateParts[2];
                
                // Convert MM/DD/YYYY to YYYY-MM-DD for comparison
                const invoiceDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                console.log('Converted invoice date:', datePart, '→', invoiceDateStr, 'comparing with filter:', dateFilter);
                
                const matches = invoiceDateStr === dateFilter;
                if (matches) {
                    console.log('✅ MATCH FOUND:', inv.invoiceId);
                }
                
                return matches;
            } catch (e) {
                console.error('Date parsing error:', e, 'for invoice date:', inv.date);
                return false;
            }
        });
        console.log('After date filter, found', pendingInvoices.length, 'invoices');
    }

    // Sort by date descending (most recent first)
    pendingInvoices.sort((a, b) => {
        try {
            if (!a.date || !b.date) return 0;
            // Parse date string (format: MM/DD/YYYY, HH:MM AM/PM)
            const parseInvoiceDate = (dateStr) => {
                const [datePart, timePart] = dateStr.split(', ');
                if (!datePart) return new Date(0);
                const [month, day, year] = datePart.split('/');
                const [time, ampm] = timePart ? timePart.split(' ') : ['12:00', 'AM'];
                let [hour, minute] = time.split(':');
                hour = parseInt(hour);
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return new Date(year, month - 1, day, hour, minute);
            };
            return parseInvoiceDate(b.date) - parseInvoiceDate(a.date);
        } catch (e) {
            return 0;
        }
    });

    // Show all pending invoices, but container height limits visible rows to ~3
    // User can scroll to see all invoices

    if (pendingInvoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="8">${dateFilter ? 'No pending invoices found for selected date' : 'No pending invoices'}</td>
            </tr>
        `;
        return;
    }

    pendingInvoices.forEach((invoice) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.dueDate || 'N/A'}</td>
            <td class="table-cell"><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status || 'N/A'}</span></td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update Invoice History table
function updateInvoiceHistory() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    console.log('updateInvoiceHistory called with', invoices.length, 'invoices');
    
    // First try to find by ID (most reliable)
    let tbody = document.querySelector('#invoice-history-table tbody');
    
    // If not found by ID, try finding by section title
    if (!tbody) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            const title = section.querySelector('.section-title');
            if (title) {
                const titleText = title.textContent.trim();
                if (titleText.includes('Invoices History') || titleText.includes('Invoice History')) {
                    tbody = section.querySelector('tbody');
                    console.log('Found Invoice History section by title');
                }
            }
        });
    }
    
    // Last resort: try by position
    if (!tbody) {
        tbody = document.querySelector('.content-section:nth-of-type(5) tbody') || 
                document.querySelector('.content-section:nth-of-type(4) tbody');
        console.log('Using fallback selector by position');
    }
    
    if (!tbody) {
        console.error('Invoice History table body not found!');
        return;
    }
    
    console.log('Found table body, updating with', invoices.length, 'invoices');
    
    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="8">No invoices</td>
            </tr>
        `;
        console.log('No invoices to display');
        return;
    }
    
    tbody.innerHTML = '';

    // Sort invoices by date descending (most recent first)
    // Handle date parsing more safely
    const sortedInvoices = invoices.sort((a, b) => {
        try {
            if (a.date && b.date) {
                return parseDate(b.date) - parseDate(a.date);
            }
            return 0;
        } catch (e) {
            console.warn('Date parsing error:', e, 'for invoices:', a, b);
            // If date parsing fails, compare as strings
            if (a.date && b.date) {
                return b.date.localeCompare(a.date);
            }
            return 0;
        }
    });

    console.log('Displaying', sortedInvoices.length, 'invoices in table');
    
    sortedInvoices.forEach((invoice, index) => {
        console.log(`Adding invoice ${index + 1}:`, invoice.invoiceId);
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.paymentDate || 'N/A'}</td>
            <td class="table-cell">${invoice.status || 'N/A'}</td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Invoice History updated successfully:', sortedInvoices.length, 'invoices displayed');
    console.log('Table body now has', tbody.children.length, 'rows');
}

// ==========================
// 🔹 PRINT RECEIPT FUNCTION
// ==========================

// Function to print invoice receipt
function printInvoiceReceipt(invoiceId) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const invoice = invoices.find(inv => inv.invoiceId === invoiceId);
    
    if (!invoice) {
        alert('Invoice not found!');
        return;
    }
    
    // Debug: Log the invoice object to see what properties it has
    console.log('Original invoice object:', invoice);
    console.log('Invoice object keys:', Object.keys(invoice));
    
    // Clean invoice object - ONLY include the exact fields we want, nothing else
    const cleanInvoice = {
        invoiceId: String(invoice.invoiceId || 'N/A').replace(/Invoice Submission/gi, '').trim() || 'N/A',
        invoiceType: String(invoice.invoiceType || 'N/A').replace(/Invoice Submission/gi, '').trim() || 'N/A',
        date: String(invoice.date || 'N/A').replace(/Invoice Submission/gi, '').trim() || 'N/A',
        supplier: String(invoice.supplier || 'N/A').replace(/Invoice Submission/gi, '').trim() || 'N/A',
        amount: invoice.amount || 0,
        dueDate: invoice.dueDate || null,
        paymentDate: invoice.paymentDate || null,
        status: String(invoice.status || 'N/A').replace(/Invoice Submission/gi, '').trim() || 'N/A',
        handler: String(invoice.handler || 'System').replace(/Invoice Submission/gi, '').trim() || 'System',
        coconutQuantity: invoice.coconutQuantity || null,
        palmQuantity: invoice.palmQuantity || null,
        oilType: invoice.oilType || null, // For backward compatibility
        quantity: invoice.quantity || null // For backward compatibility
    };
    
    // Debug: Log the cleaned invoice
    console.log('Cleaned invoice object:', cleanInvoice);
    
    // Preserve oil quantity fields for display
    const allowedKeys = ['invoiceId', 'invoiceType', 'date', 'supplier', 'amount', 'dueDate', 'paymentDate', 'status', 'handler', 'coconutQuantity', 'palmQuantity', 'oilType', 'quantity'];
    Object.keys(cleanInvoice).forEach(key => {
        if (!allowedKeys.includes(key)) {
            delete cleanInvoice[key];
        }
    });
    
    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                // Try parsing as MM/DD/YYYY format
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    return dateStr;
                }
                return dateStr;
            }
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
        } catch (e) {
            return dateStr;
        }
    };
    
    // Format amount
    const amount = typeof cleanInvoice.amount === 'number' ? cleanInvoice.amount.toFixed(2) : parseFloat(cleanInvoice.amount || 0).toFixed(2);
    
    // Get receipt container
    const receiptContainer = document.getElementById('printReceipt');
    if (!receiptContainer) {
        alert('Print receipt container not found!');
        return;
    }
    
    // Format printed date (with leading zeros: "11/07/2025, 07:52 PM")
    const printedDate = new Date();
    const printMonth = String(printedDate.getMonth() + 1).padStart(2, '0');
    const printDay = String(printedDate.getDate()).padStart(2, '0');
    const printYear = printedDate.getFullYear();
    const printHours = String(printedDate.getHours() % 12 || 12).padStart(2, '0');
    const printMinutes = String(printedDate.getMinutes()).padStart(2, '0');
    const printAmpm = printedDate.getHours() >= 12 ? 'PM' : 'AM';
    const printedDateStr = `${printMonth}/${printDay}/${printYear}, ${printHours}:${printMinutes} ${printAmpm}`;
    
    // Generate receipt HTML (matching the image design exactly)
    const receiptHTML = `
        <div class="receipt-header">
            <h1 class="receipt-title">
                <span class="receipt-title-line1">CONVERSION INVENTORY</span>
                <span class="receipt-title-line2">SYSTEM</span>
            </h1>
            <p class="receipt-subtitle">Cooking Oil Inventory Management</p>
        </div>
        
        <div class="receipt-divider-dashed"></div>
        
        <div class="receipt-info">
            <div class="receipt-row">
                <span class="receipt-label">Invoice ID:</span>
                <span class="receipt-value">${cleanInvoice.invoiceId || 'N/A'}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Type:</span>
                <span class="receipt-value">${cleanInvoice.invoiceType || 'N/A'}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Date:</span>
                <span class="receipt-value">${cleanInvoice.date || 'N/A'}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Customer:</span>
                <span class="receipt-value">${cleanInvoice.supplier || 'N/A'}</span>
            </div>
            ${(cleanInvoice.coconutQuantity || cleanInvoice.palmQuantity) ? `
            ${cleanInvoice.coconutQuantity ? `
            <div class="receipt-row">
                <span class="receipt-label">Coconut Oil:</span>
                <span class="receipt-value">${parseFloat(cleanInvoice.coconutQuantity).toFixed(2)} kg</span>
            </div>
            ` : ''}
            ${cleanInvoice.palmQuantity ? `
            <div class="receipt-row">
                <span class="receipt-label">Palm Oil:</span>
                <span class="receipt-value">${parseFloat(cleanInvoice.palmQuantity).toFixed(2)} kg</span>
            </div>
            ` : ''}
            ` : (cleanInvoice.oilType && cleanInvoice.quantity) ? `
            <div class="receipt-row">
                <span class="receipt-label">Oil Type:</span>
                <span class="receipt-value">${cleanInvoice.oilType}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Quantity:</span>
                <span class="receipt-value">${cleanInvoice.quantity} kg</span>
            </div>
            ` : ''}
            ${cleanInvoice.dueDate ? `
            <div class="receipt-row">
                <span class="receipt-label">Due Date:</span>
                <span class="receipt-value">${formatDate(cleanInvoice.dueDate)}</span>
            </div>
            ` : ''}
            ${cleanInvoice.paymentDate ? `
            <div class="receipt-row">
                <span class="receipt-label">Payment Date:</span>
                <span class="receipt-value">${formatDate(cleanInvoice.paymentDate)}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="receipt-divider-dashed"></div>
        
        <div class="receipt-summary-section">
            <div class="receipt-divider-solid"></div>
            <div class="receipt-row receipt-total">
                <span class="receipt-label">Total Amount:</span>
                <span class="receipt-value receipt-amount">P${amount}</span>
            </div>
            <div class="receipt-divider-solid"></div>
            <div class="receipt-row">
                <span class="receipt-label">Status:</span>
                <span class="receipt-value receipt-status ${cleanInvoice.status?.toLowerCase()}">${(cleanInvoice.status || 'N/A').toUpperCase()}</span>
            </div>
        </div>
        
        <div class="receipt-divider-dashed"></div>
        
        <div class="receipt-footer">
            <p class="receipt-thank-you">Thank you for your business!</p>
            <p class="receipt-processed-by">Processed by: ${cleanInvoice.handler || 'System'}</p>
            <p class="receipt-print-date">Printed: ${printedDateStr}</p>
        </div>
    `;
    
    receiptContainer.innerHTML = receiptHTML;
    
    // Show the receipt container with transparent background (no overlay)
    const printContainer = document.getElementById('printReceiptContainer');
    printContainer.style.display = 'block';
    printContainer.style.backgroundColor = 'transparent';
    
    // Hide the overlay (we don't need it for print)
    const printOverlay = document.getElementById('printOverlay');
    if (printOverlay) {
        printOverlay.style.display = 'none';
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Wait a moment for rendering, then print
    setTimeout(() => {
        window.print();
        // Hide after printing
        setTimeout(() => {
            printContainer.style.display = 'none';
            printContainer.style.backgroundColor = '';
            document.body.style.overflow = '';
        }, 100);
    }, 100);
}

// Manual test function - call this from console if needed
function testInvoiceDisplay() {
    console.log('=== TESTING INVOICE DISPLAY ===');
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    console.log('Total invoices found:', invoices.length);
    
    if (invoices.length > 0) {
        console.log('Sample invoice:', invoices[0]);
        console.log('Date format in invoice:', invoices[0].date);
        
        // Test date parsing
        const testDate = invoices[0].date;
        let datePart = testDate;
        if (testDate.includes(',')) {
            [datePart] = testDate.split(', ');
        } else {
            [datePart] = testDate.split(' ');
        }
        console.log('Extracted date part:', datePart);
    }
    
    const tbody = document.querySelector('#invoice-history-table tbody');
    console.log('Table body found:', tbody ? 'YES' : 'NO');
    
    if (tbody && invoices.length > 0) {
        console.log('FORCING UPDATE...');
        updateInvoiceHistory();
        console.log('After update, rows in table:', tbody.children.length);
    } else if (!tbody) {
        console.error('TABLE BODY NOT FOUND!');
    } else {
        console.warn('NO INVOICES IN LOCALSTORAGE!');
    }
}

// Test date filtering function
function testDateFilter(testDate) {
    console.log('=== TESTING DATE FILTER ===');
    console.log('Test date:', testDate);
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const pending = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
    
    console.log('Pending invoices:', pending.length);
    pending.forEach(inv => {
        console.log('Invoice:', inv.invoiceId, 'Date:', inv.date);
        let datePart = inv.date;
        if (inv.date.includes(',')) {
            [datePart] = inv.date.split(', ');
        } else {
            [datePart] = inv.date.split(' ');
        }
        const [month, day, year] = datePart.split('/');
        const converted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        console.log('  → Converted:', converted, 'Matches?', converted === testDate);
    });
}

// Function to update invoice stats
function updateInvoiceStats() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];

    const totalInvoices = invoices.length;
    const pendingPayments = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length;
    const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = totalInvoices;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = `₱${pendingPayments.toFixed(2)}`;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = overdueInvoices;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = `₱${totalRevenue.toFixed(2)}`;
}

// Function to update Sales table
function updateSalesTable() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#sales-table tbody');
    
    if (!tbody) {
        console.error('Sales table body not found!');
        return;
    }
    
    console.log('Updating Sales table with', invoices.length, 'total invoices');
    tbody.innerHTML = '';

    const salesInvoices = invoices.filter(inv => inv.invoiceType === 'Sale');

    if (salesInvoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="6">No sales invoices</td>
            </tr>
        `;
        return;
    }

    console.log('Found', salesInvoices.length, 'sales invoices');
    
    salesInvoices.forEach((invoice, index) => {
        console.log(`Adding sales invoice ${index + 1}:`, invoice.invoiceId);
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.status || 'N/A'}</td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Sales table updated with', tbody.children.length, 'rows');
}

// Function to update Delivery table
function updateDeliveryTable() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#delivery-table tbody');
    
    if (!tbody) {
        console.error('Delivery table body not found!');
        return;
    }
    
    console.log('Updating Delivery table with', invoices.length, 'total invoices');
    tbody.innerHTML = '';

    const deliveryInvoices = invoices.filter(inv => inv.invoiceType === 'Delivery');

    if (deliveryInvoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="7">No delivery invoices</td>
            </tr>
        `;
        return;
    }

    console.log('Found', deliveryInvoices.length, 'delivery invoices');
    
    deliveryInvoices.forEach((invoice, index) => {
        console.log(`Adding delivery invoice ${index + 1}:`, invoice.invoiceId);
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId || 'N/A'}</td>
            <td class="table-cell">${invoice.date || 'N/A'}</td>
            <td class="table-cell">${invoice.supplier || 'N/A'}</td>
            <td class="table-cell">${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount || '0.00'}</td>
            <td class="table-cell">${invoice.status || 'N/A'}</td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
            <td class="table-cell">
                <button class="print-btn" onclick="printInvoiceReceipt('${invoice.invoiceId}')" title="Print Receipt">
                    🖨️ Print
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Delivery table updated with', tbody.children.length, 'rows');
}

// Function to clear pending invoices
function clearPendingInvoices() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear pending invoices? This action cannot be undone.',
      () => {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.status !== 'Pending' && inv.status !== 'Overdue');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
        alert('✅ Pending invoices cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Pending Invoices');
}

// Function to clear sales invoices
function clearSalesInvoices() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear sales invoices? This action cannot be undone.',
      () => {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.invoiceType !== 'Sale');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
        alert('✅ Sales invoices cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Sales Invoices');
}

// Function to clear delivery invoices
function clearDeliveryInvoices() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear delivery invoices? This action cannot be undone.',
      () => {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.invoiceType !== 'Delivery');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
        alert('✅ Delivery invoices cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Delivery Invoices');
}

// Function to clear all invoices
function clearAllInvoices() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear all invoices? This action cannot be undone.',
      () => {
        localStorage.removeItem('invoices');
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
        alert('✅ All invoices cleared!');
      }
    );
  });
}

// ==========================
// 🔹 AUTOMATION FUNCTIONS
// ==========================

// Automatic Overdue Invoice Detection
function checkAndUpdateOverdueInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let updated = false;
    
    invoices.forEach(invoice => {
        // Only check invoices that are still "Pending"
        if (invoice.status === 'Pending') {
            // Parse due date (assuming format YYYY-MM-DD)
            const dueDate = new Date(invoice.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            // If due date has passed, mark as overdue
            if (dueDate < today) {
                invoice.status = 'Overdue';
                updated = true;
                
                // Log activity
                if (typeof addActivityLog === 'function') {
                    addActivityLog(
                        'Invoice Status Auto-Update',
                        `Invoice ${invoice.invoiceId} automatically marked as Overdue (Due: ${invoice.dueDate})`
                    );
                }
            }
        }
    });
    
    if (updated) {
        localStorage.setItem('invoices', JSON.stringify(invoices));
        // Update all invoice displays
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
    }
}

// Automatic Stats Update
function autoUpdateStats() {
    updateInvoiceStats();
}

// Run automatic checks on page load and periodically
function initializeAutomation() {
    // Check overdue invoices immediately
    checkAndUpdateOverdueInvoices();
    
    // Check every 30 minutes
    setInterval(checkAndUpdateOverdueInvoices, 30 * 60 * 1000);
    
    // Update stats every 5 minutes
    setInterval(autoUpdateStats, 5 * 60 * 1000);
}

// Load saved data on page load
// Set date restrictions (3 years ago to 1 year from now)
function setDateRestrictions() {
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
        const today = new Date();
        
        // Set time to midnight to avoid timezone issues
        today.setHours(0, 0, 0, 0);
        
        // Maximum: 1 year from today
        const oneYearFromNow = new Date(today);
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        
        // Minimum: 3 years ago from today
        const threeYearsAgo = new Date(today);
        threeYearsAgo.setFullYear(today.getFullYear() - 3);
        
        // Format dates as YYYY-MM-DD for date input (use local date, not UTC)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        const maxYear = oneYearFromNow.getFullYear();
        const maxMonth = String(oneYearFromNow.getMonth() + 1).padStart(2, '0');
        const maxDay = String(oneYearFromNow.getDate()).padStart(2, '0');
        const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;
        
        const minYear = threeYearsAgo.getFullYear();
        const minMonth = String(threeYearsAgo.getMonth() + 1).padStart(2, '0');
        const minDay = String(threeYearsAgo.getDate()).padStart(2, '0');
        const minDate = `${minYear}-${minMonth}-${minDay}`;
        
        dueDateInput.setAttribute('max', maxDate);
        dueDateInput.setAttribute('min', minDate);
        
        console.log('Date restrictions set:', { minDate, maxDate, today: todayStr });
    }
}

window.addEventListener('load', function() {
    // Ensure confirmation modal is hidden on page load with !important
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.setProperty('display', 'none', 'important');
    }
    
    // Ensure admin password modal is hidden on page load
    const adminPasswordModal = document.getElementById('adminPasswordModal');
    if (adminPasswordModal) {
        adminPasswordModal.style.setProperty('display', 'none', 'important');
    }
    
    // Auto-generate invoice ID on page load
    setAutoInvoiceId();
    setDateRestrictions();
    // Initialize delivery fields visibility
    toggleDeliveryFields();
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

    // Function to parse date string for sorting
    function parseDate(dateStr) {
        const [datePart, timePart] = dateStr.split(', ');
        const [month, day, year] = datePart.split('/');
        const [time, ampm] = timePart.split(' ');
        let [hour, minute] = time.split(':');
        hour = parseInt(hour);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return new Date(year, month - 1, day, hour, minute);
    }



    // Add form submit event listener
    const invoiceForm = document.getElementById('invoiceForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', submitInvoice);
    }

    // Verify invoices exist in localStorage
    const testInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    console.log('=== INVOICE PAGE LOAD DEBUG ===');
    console.log('Invoices in localStorage:', testInvoices.length);
    console.log('Invoice data:', testInvoices);
    
    // Update tables and stats on page load
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
        console.log('Updating all tables...');
        // Show status invoices tab by default
        showInvoiceTab('status');
        updateInvoiceStats();
        console.log('All tables updated');
    }, 100);
    
    // Initialize automation
    initializeAutomation();
});

