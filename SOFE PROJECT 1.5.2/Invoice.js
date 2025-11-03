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
    
    // Check if user is admin (not in users array)
    const isAdmin = userUsername === 'admin123';
    
    // Check if logout modal exists
    const logoutModal = document.getElementById('logoutModal');
    
    // If staff member and modal exists, show modal with Check Out option
    if (!isAdmin && currentUser && currentUser.employeeId && logoutModal) {
        logoutModal.style.display = 'block';
        
        // Set up checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const cancelBtn = document.getElementById('cancelLogoutBtn');
        
        if (checkoutBtn) {
            checkoutBtn.onclick = function() {
                recordCheckout();
                logoutModal.style.display = 'none';
                window.location.href = 'Login.html';
            };
        }
        
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                logoutModal.style.display = 'none';
                window.location.href = 'Login.html';
            };
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                logoutModal.style.display = 'none';
            };
        }
    } else {
        // Admin or no modal, just log out normally
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'Login.html';
        }
    }
}

// Function to submit invoice
function submitInvoice(event) {
    event.preventDefault();

    const invoiceId = document.getElementById('invoiceId').value;
    const supplier = document.getElementById('supplier').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const dueDate = document.getElementById('dueDate').value;
    const status = document.getElementById('status').value;
    const invoiceType = document.getElementById('invoiceType').value;

    if (!invoiceId || !supplier || isNaN(amount) || amount <= 0 || !dueDate || !status || !invoiceType) {
        alert('Please fill in all required fields with valid values.');
        return;
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
        supplier,
        amount,
        dueDate,
        status,
        invoiceType,
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

    // Clear form
    clearForm();

    // Update tables and stats
    updatePendingInvoices();
    updateInvoiceHistory();
    updateInvoiceStats();
    updateSalesTable();
    updateDeliveryTable();
}

// Function to clear form
function clearForm() {
    if (confirm('Are you sure you want to clear the form? This will reset all fields.')) {
        document.getElementById('invoiceId').value = '';
        document.getElementById('supplier').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('status').value = 'Pending';
        document.getElementById('invoiceType').value = 'Delivery';
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

// Function to update Pending Invoices table
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
              <td class="table-cell" colspan="7">${dateFilter ? 'No pending invoices found for selected date' : 'No pending invoices'}</td>
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
            <td class="table-cell">${invoice.status || 'N/A'}</td>
            <td class="table-cell">${invoice.handler || 'N/A'}</td>
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
              <td class="table-cell" colspan="7">No invoices</td>
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
        `;
        tbody.appendChild(row);
    });
    
    console.log('Invoice History updated successfully:', sortedInvoices.length, 'invoices displayed');
    console.log('Table body now has', tbody.children.length, 'rows');
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
              <td class="table-cell" colspan="6">No delivery invoices</td>
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
        `;
        tbody.appendChild(row);
    });
    
    console.log('Delivery table updated with', tbody.children.length, 'rows');
}

// Admin password verification function
function verifyAdminPassword(callback) {
  const password = prompt('⚠️ Admin Password Required\n\nPlease enter admin password to clear invoices:');
  
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

// Function to clear pending invoices
function clearPendingInvoices() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear pending invoices? This action cannot be undone.')) {
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
  });
}

// Function to clear sales invoices
function clearSalesInvoices() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear sales invoices? This action cannot be undone.')) {
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
  });
}

// Function to clear delivery invoices
function clearDeliveryInvoices() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear delivery invoices? This action cannot be undone.')) {
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
  });
}

// Function to clear all invoices
function clearAllInvoices() {
  verifyAdminPassword(() => {
    if (confirm('Are you sure you want to clear all invoices? This action cannot be undone.')) {
      localStorage.removeItem('invoices');
      updatePendingInvoices();
      updateInvoiceHistory();
      updateInvoiceStats();
      updateSalesTable();
      updateDeliveryTable();
      alert('✅ All invoices cleared!');
    }
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
    setDateRestrictions();
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
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
        console.log('All tables updated');
    }, 100);
    
    // Initialize automation
    initializeAutomation();
});
