// Function to convert imperial tons to kg (direct)
function convertTonsToKg() {
    const tonsInput = document.getElementById('tons-input').value;
    const resultDiv = document.getElementById('direct-result');
    if (tonsInput && !isNaN(tonsInput) && tonsInput > 0) {
        const kg = tonsInput * 1016.0469088;
        resultDiv.textContent = `${tonsInput} imperial tons = ${kg.toFixed(2)} kg`;

        // Log the conversion
        const now = new Date();
        const dateTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const logEntry = {
            date: dateTime,
            tons: parseFloat(tonsInput),
            kg: kg.toFixed(2),
            handler: localStorage.getItem('userName') || 'Guest'
        };

        let logs = JSON.parse(localStorage.getItem('directConversionLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('directConversionLogs', JSON.stringify(logs));

        // Update the log table
        updateDirectConversionLogs();
    } else {
        resultDiv.textContent = 'Please enter a valid positive number for imperial tons.';
    }
}

// Function to convert kg to bottles
function convertKgToBottles() {
    const kgInput = document.getElementById('kg-input').value;
    const resultDiv = document.getElementById('refillable-result');
    if (kgInput && !isNaN(kgInput) && kgInput > 0) {
        const liter1 = Math.floor(kgInput / 1); // 1 liter bottle (assuming 1 kg per liter for oil density)
        const required1 = liter1 * 1;
        const unused1 = kgInput - required1;
        const liter1_5 = Math.floor(kgInput / 1.5); // 1.5 liter bottle
        const required1_5 = liter1_5 * 1.5;
        const unused1_5 = kgInput - required1_5;
        const ml350 = Math.floor(kgInput / 0.35); // 350ml bottle
        const required350 = ml350 * 0.35;
        const unused350 = kgInput - required350;
        resultDiv.innerHTML = `<strong>kg to Bottles:</strong><br>${kgInput} kg can fill:<br>- ${liter1} x 1 liter bottles (requires ${required1.toFixed(2)} kg, unused ${unused1.toFixed(2)} kg)<br>- ${liter1_5} x 1.5 liter bottles (requires ${required1_5.toFixed(2)} kg, unused ${unused1_5.toFixed(2)} kg)<br>- ${ml350} x 350ml bottles (requires ${required350.toFixed(2)} kg, unused ${unused350.toFixed(2)} kg)`;

        // Log the conversion
        const now = new Date();
        const dateTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const logEntry = {
            date: dateTime,
            input: `${kgInput} kg`,
            output: `${liter1} x 1L, ${liter1_5} x 1.5L, ${ml350} x 350ml`,
            handler: localStorage.getItem('userName') || 'Guest'
        };

        let logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('refillableConversionLogs', JSON.stringify(logs));

        // Update the log table
        updateRefillableConversionLogs();
    } else {
        resultDiv.textContent = 'Please enter a valid positive number for kg.';
    }
}

// Function to convert bottles to kg
function convertBottlesToKg() {
    const bottles1l = parseFloat(document.getElementById('bottles-1l').value) || 0;
    const bottles1_5l = parseFloat(document.getElementById('bottles-1.5l').value) || 0;
    const bottles350ml = parseFloat(document.getElementById('bottles-350ml').value) || 0;
    const resultDiv = document.getElementById('refillable-result');

    if (bottles1l >= 0 && bottles1_5l >= 0 && bottles350ml >= 0) {
        const totalKg = (bottles1l * 1) + (bottles1_5l * 1.5) + (bottles350ml * 0.35);
        resultDiv.innerHTML += `<br><br><strong>Bottles to kg:</strong><br>${bottles1l} x 1L + ${bottles1_5l} x 1.5L + ${bottles350ml} x 350ml = ${totalKg.toFixed(2)} kg`;

        // Log the conversion
        const now = new Date();
        const dateTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const logEntry = {
            date: dateTime,
            input: `${bottles1l} x 1L, ${bottles1_5l} x 1.5L, ${bottles350ml} x 350ml`,
            output: `${totalKg.toFixed(2)} kg`,
            handler: localStorage.getItem('userName') || 'Guest'
        };

        let logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('refillableConversionLogs', JSON.stringify(logs));

        // Update the log table
        updateRefillableConversionLogs();
    } else {
        resultDiv.innerHTML += '<br><br>Please enter valid non-negative numbers for bottles.';
    }
}

// Function to convert storage level to imperial tons and kg
function convertStorageToKg() {
    const capacity = document.getElementById('capacity-input').value;
    const level = document.getElementById('level-input').value;
    const resultDiv = document.getElementById('storage-result');
    if (capacity && !isNaN(capacity) && capacity > 0 && level && !isNaN(level) && level >= 0 && level <= 100) {
        const currentTons = (capacity * level) / 100;
        const kg = currentTons * 1016.0469088;
        resultDiv.textContent = `Current level: ${currentTons.toFixed(4)} imperial tons = ${kg.toFixed(2)} kg`;

        // Log the conversion
        const now = new Date();
        const dateTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const logEntry = {
            date: dateTime,
            capacity: parseFloat(capacity),
            level: parseFloat(level),
            currentKg: kg.toFixed(2),
            tons: currentTons.toFixed(4),
            handler: localStorage.getItem('userName') || 'Guest'
        };

        let logs = JSON.parse(localStorage.getItem('storageConversionLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('storageConversionLogs', JSON.stringify(logs));

        // Update the log table
        updateStorageConversionLogs();
    } else {
        resultDiv.textContent = 'Please enter valid capacity (positive imperial tons) and level (0-100%).';
    }
}

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

// Function to confirm logout
function confirmLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'Login.html';
    }
}

// Function to update top stats
function updateTopStats() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];

    // Calculate current stock levels
    const stockLevels = { 'Coconut Oil': 300, 'Palm Oil': 1700 }; // Default
    monitorings.forEach(m => {
        if (m.transactionType === 'Stock In') {
            stockLevels[m.oilType] += m.quantity;
        } else if (m.transactionType === 'Stock Out') {
            stockLevels[m.oilType] -= m.quantity;
        }
    });

    // Total stock value (assuming prices: Coconut 65/kg, Palm 45/kg)
    const totalValue = (stockLevels['Coconut Oil'] * 65) + (stockLevels['Palm Oil'] * 45);

    // Low stock items (below minimum: Coconut 400, Palm 600)
    const lowStockItems = (stockLevels['Coconut Oil'] < 400 ? 1 : 0) + (stockLevels['Palm Oil'] < 600 ? 1 : 0);

    // Total items: 3 (2 oils + 1 other?)
    const totalItems = 3;

    // Storage usage (assume max 10000 kg)
    const totalStock = stockLevels['Coconut Oil'] + stockLevels['Palm Oil'];
    const usagePercent = Math.round((totalStock / 10000) * 100);

    // Update stats
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = `₱${totalValue.toLocaleString()}`;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = lowStockItems;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = totalItems;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = `${usagePercent}%`;
}

// Function to update Stock Movement History table
function updateStockMovement() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const tbody = document.querySelector('#stock-movement tbody');
    tbody.innerHTML = '';

    // Show all monitorings
    monitorings.forEach((monitoring, index) => {
        const refNo = monitoring.transactionType === 'Stock In' ? `SI-${monitoring.date.replace(/-/g, '')}${index}` : `SO-${monitoring.date.replace(/-/g, '')}${index}`;
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${monitoring.date}</td>
            <td class="table-cell">${monitoring.oilType}</td>
            <td class="table-cell">${monitoring.transactionType}</td>
            <td class="table-cell">${monitoring.quantity}</td>
            <td class="table-cell">${refNo}</td>
            <td class="table-cell">${monitoring.handler}</td>
        `;
        tbody.appendChild(row);
    });

    // If no monitorings, show default
    if (monitorings.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell">2025-10-11</td>
              <td class="table-cell">Coconut Oil</td>
              <td class="table-cell">Stock In</td>
              <td class="table-cell">500</td>
              <td class="table-cell">SI-2025101</td>
              <td class="table-cell">John Smith</td>
            </tr>
            <tr class="table-row">
              <td class="table-cell">2025-10-10</td>
              <td class="table-cell">Palm Oil</td>
              <td class="table-cell">Stock Out</td>
              <td class="table-cell">200</td>
              <td class="table-cell">SO-2025100</td>
              <td class="table-cell">Maria Garcia</td>
            </tr>
        `;
    }
}

// Function to clear current inventory
function clearCurrentInventory() {
    // Show confirmation modal
    document.getElementById('clearModal').style.display = 'block';

    // Set up event listeners for modal buttons
    document.getElementById('confirmClear').onclick = function() {
        // Proceed with clearing
        // Reset to default values
        const tbody = document.querySelector('.content-section:nth-of-type(1) tbody');
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell">Coconut Oil</td>
              <td class="table-cell">300</td>
              <td class="table-cell">400</td>
              <td class="table-cell">3,000</td>
              <td class="table-cell">65</td>
              <td class="table-cell">Low Stock</td>
              <td class="table-cell">Admin</td>
            </tr>
            <tr class="table-row">
              <td class="table-cell">Palm Oil</td>
              <td class="table-cell">1,700</td>
              <td class="table-cell">600</td>
              <td class="table-cell">3,000</td>
              <td class="table-cell">45</td>
              <td class="table-cell">Normal</td>
              <td class="table-cell">Admin</td>
            </tr>
        `;
        alert('Current Inventory cleared successfully!');
        console.log('Current Inventory cleared');
        document.getElementById('clearModal').style.display = 'none';
    };

    document.getElementById('cancelClear').onclick = function() {
        document.getElementById('clearModal').style.display = 'none';
    };
}

// Function to clear stock movement history
function clearStockMovementHistory() {
    // Show confirmation modal
    document.getElementById('clearModal').style.display = 'block';

    // Set up event listeners for modal buttons
    document.getElementById('confirmClear').onclick = function() {
        // Proceed with clearing
        const tbody = document.querySelector('#stock-movement tbody');
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell">2025-10-11</td>
              <td class="table-cell">Coconut Oil</td>
              <td class="table-cell">Stock In</td>
              <td class="table-cell">500</td>
              <td class="table-cell">SI-2025101</td>
              <td class="table-cell">John Smith</td>
            </tr>
            <tr class="table-row">
              <td class="table-cell">2025-10-10</td>
              <td class="table-cell">Palm Oil</td>
              <td class="table-cell">Stock Out</td>
              <td class="table-cell">200</td>
              <td class="table-cell">SO-2025100</td>
              <td class="table-cell">Maria Garcia</td>
            </tr>
        `;
        alert('Stock Movement History cleared successfully!');
        console.log('Stock Movement History cleared');
        document.getElementById('clearModal').style.display = 'none';
    };

    document.getElementById('cancelClear').onclick = function() {
        document.getElementById('clearModal').style.display = 'none';
    };
}

// Function to update direct conversion logs
function updateDirectConversionLogs() {
    const logs = JSON.parse(localStorage.getItem('directConversionLogs')) || [];
    const tbody = document.querySelector('#direct-conversion-logs tbody');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${log.date}</td>
            <td class="table-cell">${log.tons}</td>
            <td class="table-cell">${log.kg}</td>
            <td class="table-cell">${log.handler}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update refillable conversion logs
function updateRefillableConversionLogs() {
    const logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
    const tbody = document.querySelector('#refillable-conversion-logs tbody');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${log.date}</td>
            <td class="table-cell">${log.input}</td>
            <td class="table-cell">${log.output}</td>
            <td class="table-cell">${log.handler}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update storage conversion logs
function updateStorageConversionLogs() {
    const logs = JSON.parse(localStorage.getItem('storageConversionLogs')) || [];
    const tbody = document.querySelector('#storage-conversion-logs tbody');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${log.date}</td>
            <td class="table-cell">${log.capacity}</td>
            <td class="table-cell">${log.level}</td>
            <td class="table-cell">${log.currentKg}</td>
            <td class="table-cell">${log.tons}</td>
            <td class="table-cell">${log.handler}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to clear direct conversion logs
function clearDirectConversionLogs() {
    // Show confirmation modal
    document.getElementById('clearModal').style.display = 'block';

    // Set up event listeners for modal buttons
    document.getElementById('confirmClear').onclick = function() {
        // Proceed with clearing
        localStorage.removeItem('directConversionLogs');
        updateDirectConversionLogs();
        alert('Direct Conversion Logs cleared successfully!');
        document.getElementById('clearModal').style.display = 'none';
    };

    document.getElementById('cancelClear').onclick = function() {
        document.getElementById('clearModal').style.display = 'none';
    };
}

// Function to clear refillable conversion logs
function clearRefillableConversionLogs() {
    // Show confirmation modal
    document.getElementById('clearModal').style.display = 'block';

    // Set up event listeners for modal buttons
    document.getElementById('confirmClear').onclick = function() {
        // Proceed with clearing
        localStorage.removeItem('refillableConversionLogs');
        updateRefillableConversionLogs();
        alert('Refillable Conversion Logs cleared successfully!');
        document.getElementById('clearModal').style.display = 'none';
    };

    document.getElementById('cancelClear').onclick = function() {
        document.getElementById('clearModal').style.display = 'none';
    };
}

// Function to clear storage conversion logs
function clearStorageConversionLogs() {
    // Show confirmation modal
    document.getElementById('clearModal').style.display = 'block';

    // Set up event listeners for modal buttons
    document.getElementById('confirmClear').onclick = function() {
        // Proceed with clearing
        localStorage.removeItem('storageConversionLogs');
        updateStorageConversionLogs();
        alert('Storage Conversion Logs cleared successfully!');
        document.getElementById('clearModal').style.display = 'none';
    };

    document.getElementById('cancelClear').onclick = function() {
        document.getElementById('clearModal').style.display = 'none';
    };
}



// Function to filter logs
function filterLogs(searchInput, tableId) {
    const filter = searchInput.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
        rows[i].style.display = match ? '' : 'none';
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

    // Update stock movement
    updateStockMovement();

    // Update top stats
    updateTopStats();

    // Update conversion logs
    updateDirectConversionLogs();
    updateRefillableConversionLogs();
    updateStorageConversionLogs();
});
