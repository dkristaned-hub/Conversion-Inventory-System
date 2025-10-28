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

// Function to confirm logout
function confirmLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'Login.html';
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

// Function to update Pending Invoices table
function updatePendingInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('.content-section:nth-of-type(1) tbody');
    tbody.innerHTML = '';

    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');

    if (pendingInvoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="7">No pending invoices</td>
            </tr>
        `;
        return;
    }

    pendingInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId}</td>
            <td class="table-cell">${invoice.date}</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${invoice.amount.toFixed(2)}</td>
            <td class="table-cell">${invoice.dueDate}</td>
            <td class="table-cell">${invoice.status}</td>
            <td class="table-cell">${invoice.handler}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update Invoice History table
function updateInvoiceHistory() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('.content-section:nth-of-type(4) tbody');
    tbody.innerHTML = '';

    // Sort invoices by date descending (most recent first)
    const sortedInvoices = invoices.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    if (sortedInvoices.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell" colspan="7">No invoices</td>
            </tr>
        `;
        return;
    }

    sortedInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId}</td>
            <td class="table-cell">${invoice.date}</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${invoice.amount.toFixed(2)}</td>
            <td class="table-cell">${invoice.paymentDate || 'N/A'}</td>
            <td class="table-cell">${invoice.status}</td>
            <td class="table-cell">${invoice.handler}</td>
        `;
        tbody.appendChild(row);
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

    salesInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId}</td>
            <td class="table-cell">${invoice.date}</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${invoice.amount.toFixed(2)}</td>
            <td class="table-cell">${invoice.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update Delivery table
function updateDeliveryTable() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const tbody = document.querySelector('#delivery-table tbody');
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

    deliveryInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${invoice.invoiceId}</td>
            <td class="table-cell">${invoice.date}</td>
            <td class="table-cell">${invoice.supplier}</td>
            <td class="table-cell">${invoice.amount.toFixed(2)}</td>
            <td class="table-cell">${invoice.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to clear pending invoices
function clearPendingInvoices() {
    if (confirm('Are you sure you want to clear pending invoices? This action cannot be undone.')) {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.status !== 'Pending' && inv.status !== 'Overdue');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
    }
}

// Function to clear sales invoices
function clearSalesInvoices() {
    if (confirm('Are you sure you want to clear sales invoices? This action cannot be undone.')) {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.invoiceType !== 'Sale');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
    }
}

// Function to clear delivery invoices
function clearDeliveryInvoices() {
    if (confirm('Are you sure you want to clear delivery invoices? This action cannot be undone.')) {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(inv => inv.invoiceType !== 'Delivery');
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
    }
}

// Function to clear all invoices
function clearAllInvoices() {
    if (confirm('Are you sure you want to clear all invoices? This action cannot be undone.')) {
        localStorage.removeItem('invoices');
        updatePendingInvoices();
        updateInvoiceHistory();
        updateInvoiceStats();
        updateSalesTable();
        updateDeliveryTable();
    }
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
    document.getElementById('invoiceForm').addEventListener('submit', submitInvoice);

    // No need to set date field as it's removed

    // Update tables and stats
    updatePendingInvoices();
    updateInvoiceHistory();
    updateInvoiceStats();
    updateSalesTable();
    updateDeliveryTable();
});
