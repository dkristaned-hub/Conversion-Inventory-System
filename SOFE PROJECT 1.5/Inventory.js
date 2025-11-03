// ==========================
// INVENTORY.JS (Enhanced)
// ==========================

// 🔹 Utility function — show/hide modal confirmation
function showConfirmationModal(onConfirm) {
  const modal = document.getElementById('clearModal');
  const confirmBtn = document.getElementById('confirmClear');
  const cancelBtn = document.getElementById('cancelClear');

  if (!modal || !confirmBtn || !cancelBtn) return;

  modal.style.display = 'block';

  confirmBtn.onclick = function () {
    modal.style.display = 'none';
    if (typeof onConfirm === 'function') onConfirm();
  };

  cancelBtn.onclick = function () {
    modal.style.display = 'none';
  };
}

// 🔹 Admin Password Confirmation Function
// ==========================
function verifyAdminPassword(callback) {
  const password = prompt('⚠️ Admin Password Required\n\nPlease enter admin password to clear logs:');
  
  if (password === null) {
    // User cancelled
    return false;
  }
  
  // Check if password matches admin password
  if (password === 'admin123') {
    callback();
    return true;
  } else {
    alert('❌ Incorrect password. Access denied.');
    return false;
  }
}

// ==========================
// 🔹 Show/Hide Conversions
// ==========================

function showConversion(type) {
  // Hide all conversion options
  document.getElementById('tons-to-kg-conversion').style.display = 'none';
  document.getElementById('kg-to-bottles-conversion').style.display = 'none';
  document.getElementById('storage-level-conversion').style.display = 'none';

  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.conversion-tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Show selected conversion and add active class to clicked tab
  if (type === 'tons-to-kg') {
    document.getElementById('tons-to-kg-conversion').style.display = 'block';
    tabs[0].classList.add('active');
  } else if (type === 'kg-to-bottles') {
    document.getElementById('kg-to-bottles-conversion').style.display = 'block';
    tabs[1].classList.add('active');
  } else if (type === 'storage-level') {
    document.getElementById('storage-level-conversion').style.display = 'block';
    tabs[2].classList.add('active');
  }
}

// ==========================
// 🔹 Conversions
// ==========================

// Function to convert standard tons to kilograms
function convertTonsToKg() {
  const tonsInput = document.getElementById('tons-input').value;
  const resultDiv = document.getElementById('direct-result');

  if (tonsInput && !isNaN(tonsInput) && tonsInput > 0) {
    const kg = tonsInput * 1000; // Standard ton = 1000 kg (changed from 1016.0469088)
    resultDiv.textContent = `${tonsInput} tons = ${kg.toFixed(2)} kg`; // Removed "imperial"

    const now = new Date().toLocaleString();
    const logEntry = {
      date: now,
      tons: parseFloat(tonsInput),
      kg: kg.toFixed(2),
      handler: localStorage.getItem('userName') || 'Guest'
    };

    let logs = JSON.parse(localStorage.getItem('directConversionLogs')) || [];
    logs.push(logEntry);
    localStorage.setItem('directConversionLogs', JSON.stringify(logs));
    updateDirectConversionLogs();
    
    // Log activity
    if (typeof addActivityLog === 'function') {
      addActivityLog('Tons to kg Conversion', `Converted ${tonsInput} tons to ${kg.toFixed(2)} kg`);
    }
  } else {
    resultDiv.textContent = '⚠️ Please enter a valid positive number for tons.'; // Changed from "imperial tons"
  }
}

// Function to convert kg to bottles
function convertKgToBottles() {
  const kgInput = document.getElementById('kg-input').value;
  const resultDiv = document.getElementById('refillable-result');
  const visualizationDiv = document.getElementById('bottles-visualization');

  if (kgInput && !isNaN(kgInput) && kgInput > 0) {
    const kg = parseFloat(kgInput);
    
    // Convert kg to liters using cooking oil density (0.88 kg/L)
    const liters = parseFloat((kg / 0.88).toFixed(2));
    
    // Calculate bottles based on LITERS (not kg)
    const liter1 = Math.floor(liters / 1);           // e.g., 19.32 / 1 = 19 bottles
    const liter1_5 = Math.floor(liters / 1.5);       // e.g., 19.32 / 1.5 = 12 bottles
    const ml350 = Math.floor(liters / 0.35);         // e.g., 19.32 / 0.35 = 55 bottles
    
    // Calculate unused oil in liters, then convert to kg
    const unusedOil1L_liters = (liters - (liter1 * 1)).toFixed(2);
    const unusedOil1_5L_liters = (liters - (liter1_5 * 1.5)).toFixed(2);
    const unusedOil350ml_liters = (liters - (ml350 * 0.35)).toFixed(2);
    
    // Convert unused liters back to kg for display
    const unusedOil1L_kg = (parseFloat(unusedOil1L_liters) * 0.88).toFixed(2);
    const unusedOil1_5L_kg = (parseFloat(unusedOil1_5L_liters) * 0.88).toFixed(2);
    const unusedOil350ml_kg = (parseFloat(unusedOil350ml_liters) * 0.88).toFixed(2);

    // Clear text result - only show visualization
    resultDiv.innerHTML = '';

    // Create visualization
    const maxBottles = Math.max(liter1, liter1_5, ml350);
    const scaleFactor = maxBottles > 0 ? 100 / maxBottles : 0;

    visualizationDiv.innerHTML = `
      <div class="viz-title">${kgInput} kg Bottle Capacity</div>
      <div class="kg-to-liters" style="text-align: center; margin-bottom: 1.5rem; padding: 1rem; background-color: #F8FAFC; border-radius: 0.5rem; border: 1px solid #E5E9F0;">
        <div style="font-size: 1.2rem; color: #2C3E66; font-weight: 600; margin-bottom: 0.5rem;">
          Result in Liters:
        </div>
        <div style="font-size: 1.5rem; color: #1B2A4A; font-weight: 700;">
          ${kgInput} kg = ${liters.toFixed(2)} L
        </div>
        <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
          (density of cooking oil: 0.88 kg/L)
        </div>
      </div>
      <div class="viz-container">
        <div class="viz-bar-wrapper">
          <div class="viz-label">1L Bottles: ${liter1} bottles</div>
          <div class="viz-bar-container">
            <div class="viz-bar" style="width: ${liter1 * scaleFactor}%" data-count="${liter1}">
              <span class="viz-bar-value">${liter1}</span>
            </div>
          </div>
          <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">
            Unused oil: ${unusedOil1L_kg} kg (${unusedOil1L_liters} L)
          </div>
        </div>
        <div class="viz-bar-wrapper">
          <div class="viz-label">1.5L Bottles: ${liter1_5} bottles</div>
          <div class="viz-bar-container">
            <div class="viz-bar viz-bar-2" style="width: ${liter1_5 * scaleFactor}%" data-count="${liter1_5}">
              <span class="viz-bar-value">${liter1_5}</span>
            </div>
          </div>
          <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">
            Unused oil: ${unusedOil1_5L_kg} kg (${unusedOil1_5L_liters} L)
          </div>
        </div>
        <div class="viz-bar-wrapper">
          <div class="viz-label">350ml Bottles: ${ml350} bottles</div>
          <div class="viz-bar-container">
            <div class="viz-bar viz-bar-3" style="width: ${ml350 * scaleFactor}%" data-count="${ml350}">
              <span class="viz-bar-value">${ml350}</span>
            </div>
          </div>
          <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">
            Unused oil: ${unusedOil350ml_kg} kg (${unusedOil350ml_liters} L)
          </div>
        </div>
      </div>
    `;

    const now = new Date().toLocaleString();
    const logEntry = {
      date: now,
      kg: parseFloat(kgInput),
      bottles: `${liter1}×1L, ${liter1_5}×1.5L, ${ml350}×350ml`,
      handler: localStorage.getItem('userName') || 'Guest'
    };

    let logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
    logs.push(logEntry);
    localStorage.setItem('refillableConversionLogs', JSON.stringify(logs));
    updateRefillableConversionLogs();
    
    // Log activity
    if (typeof addActivityLog === 'function') {
      addActivityLog('kg to Bottles Conversion', `Converted ${kgInput} kg to bottles: ${liter1}×1L, ${liter1_5}×1.5L, ${ml350}×350ml`);
    }
  } else {
    resultDiv.textContent = '⚠️ Please enter a valid positive number for kg.';
    resultDiv.style.display = 'block';
    visualizationDiv.innerHTML = '';
  }
}

// Function to convert storage level to tons and kg
function convertStorageToKg() {
  const capacity = document.getElementById('capacity-input').value;
  const level = document.getElementById('level-input').value;
  const resultDiv = document.getElementById('storage-result');

  if (capacity && level && !isNaN(capacity) && !isNaN(level) && capacity > 0 && level >= 0 && level <= 100) {
    const currentTons = (capacity * level) / 100;
    const kg = currentTons * 1000; // Changed from 1016.0469088 to 1000 (standard ton)

    resultDiv.textContent = `Current level: ${currentTons.toFixed(4)} tons = ${kg.toFixed(2)} kg`; // Removed "imperial"

    const now = new Date().toLocaleString();
    const logEntry = {
      date: now,
      capacity: parseFloat(capacity),
      level: parseFloat(level),
      currentKg: kg.toFixed(2),
      tons: currentTons.toFixed(4),
      handler: localStorage.getItem('userName') || 'Guest'
    };

    let logs = JSON.parse(localStorage.getItem('storageConversionLogs')) || [];
    logs.push(logEntry);
    localStorage.setItem('storageConversionLogs', JSON.stringify(logs));
    updateStorageConversionLogs();
    
    // Log activity
    if (typeof addActivityLog === 'function') {
      addActivityLog('Storage Level Conversion', `Capacity: ${capacity} tons, Level: ${level}%, Current: ${currentTons.toFixed(4)} tons (${kg.toFixed(2)} kg)`);
    }
  } else {
    resultDiv.textContent = '⚠️ Please enter valid capacity (tons) and level (0–100%).';
  }
}

// ==========================
// 🔹 Update Conversion Logs
// ==========================

function updateDirectConversionLogs() {
  const logs = JSON.parse(localStorage.getItem('directConversionLogs')) || [];
  const tbody = document.querySelector('#direct-conversion-logs tbody');
  tbody.innerHTML = '';
  logs.forEach(log => {
    const row = `<tr class="table-row">
      <td>${log.date}</td>
      <td>${log.tons}</td>
      <td>${log.kg}</td>
      <td>${log.handler}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function updateRefillableConversionLogs() {
  const logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
  const tbody = document.querySelector('#refillable-conversion-logs tbody');
  tbody.innerHTML = '';
  logs.forEach(log => {
    const row = `<tr class="table-row">
      <td>${log.date}</td>
      <td>${log.kg}</td>
      <td>${log.bottles}</td>
      <td>${log.handler}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function updateStorageConversionLogs() {
  const logs = JSON.parse(localStorage.getItem('storageConversionLogs')) || [];
  const tbody = document.querySelector('#storage-conversion-logs tbody');
  tbody.innerHTML = '';
  logs.forEach(log => {
    const row = `<tr class="table-row">
      <td>${log.date}</td>
      <td>${log.capacity}</td>
      <td>${log.level}</td>
      <td>${log.currentKg}</td>
      <td>${log.tons}</td>
      <td>${log.handler}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

// 🔹 Clear Log Functions (using modal + admin password)
// ==========================
function clearDirectConversionLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(() => {
      localStorage.removeItem('directConversionLogs');
      updateDirectConversionLogs();
      alert('✅ Direct Conversion Logs cleared!');
    });
  });
}

function clearRefillableConversionLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(() => {
      localStorage.removeItem('refillableConversionLogs');
      updateRefillableConversionLogs();
      alert('✅ Refillable Conversion Logs cleared!');
    });
  });
}

function clearStorageConversionLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(() => {
      localStorage.removeItem('storageConversionLogs');
      updateStorageConversionLogs();
      alert('✅ Storage Conversion Logs cleared!');
    });
  });
}

// ==========================
// 🔹 AUTOMATION FUNCTIONS
// ==========================

// Automatic Low Stock Alert Generation
function checkLowStockLevels() {
    const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    const alerts = [];
    
    inventory.forEach(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minimumLevel = parseFloat(item.minimumLevel) || 0;
        
        // Check if stock is below minimum level
        if (currentStock < minimumLevel) {
            alerts.push({
                oilType: item.oilType,
                currentStock: currentStock,
                minimumLevel: minimumLevel,
                status: 'Low Stock'
            });
            
            // Log activity if stock is critically low
            if (typeof addActivityLog === 'function') {
                addActivityLog(
                    'Low Stock Alert',
                    `${item.oilType} is below minimum level (Current: ${currentStock}kg, Minimum: ${minimumLevel}kg)`
                );
            }
        }
    });
    
    return alerts;
}

// Update current inventory table from localStorage
function updateCurrentInventory() {
    const tbody = document.querySelector('#current-inventory-table tbody');
    if (!tbody) return;
    
    const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    
    if (inventory.length === 0) {
        // Use default inventory if none exists
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
        return;
    }
    
    tbody.innerHTML = '';
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${item.oilType}</td>
            <td class="table-cell">${parseFloat(item.currentStock || 0).toFixed(2)}</td>
            <td class="table-cell">${item.minimumLevel || 0}</td>
            <td class="table-cell">${item.maximumCapacity || 0}</td>
            <td class="table-cell">${item.unitPrice || 0}</td>
            <td class="table-cell">${item.status || 'Normal'}</td>
            <td class="table-cell">${item.handler || 'Admin'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Auto-update inventory when monitoring entry is submitted
function autoUpdateInventoryFromMonitoring(monitoring) {
    if (monitoring.monitoringType === 'Stock' && monitoring.transactionType) {
        let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
        const oilType = monitoring.oilType;
        const quantity = parseFloat(monitoring.quantity) || 0;
        
        // Initialize inventory if empty
        if (inventory.length === 0) {
            inventory = [
                { oilType: 'Coconut Oil', currentStock: 300, minimumLevel: 400, maximumCapacity: 3000, unitPrice: 65, status: 'Low Stock', handler: 'Admin' },
                { oilType: 'Palm Oil', currentStock: 1700, minimumLevel: 600, maximumCapacity: 3000, unitPrice: 45, status: 'Normal', handler: 'Admin' }
            ];
        }
        
        // Find matching inventory item
        let item = inventory.find(inv => inv.oilType === oilType);
        
        if (!item) {
            // Create new item if not found
            item = {
                oilType: oilType,
                currentStock: 0,
                minimumLevel: oilType === 'Coconut Oil' ? 400 : 600,
                maximumCapacity: 3000,
                unitPrice: oilType === 'Coconut Oil' ? 65 : 45,
                status: 'Normal',
                handler: 'System'
            };
            inventory.push(item);
        }
        
        if (monitoring.transactionType === 'Stock In') {
            // Add to inventory
            item.currentStock = (parseFloat(item.currentStock) || 0) + quantity;
        } else if (monitoring.transactionType === 'Stock Out') {
            // Subtract from inventory
            item.currentStock = Math.max(0, (parseFloat(item.currentStock) || 0) - quantity);
        }
        
        // Update status based on new stock level
        const minLevel = parseFloat(item.minimumLevel) || 0;
        item.status = parseFloat(item.currentStock) < minLevel ? 'Low Stock' : 'Normal';
        item.handler = monitoring.handler || 'System';
        
        localStorage.setItem('currentInventory', JSON.stringify(inventory));
        
        // Check for low stock alerts after update
        checkLowStockLevels();
        
        // Update inventory display
        updateCurrentInventory();
        updateTopStats();
        
        // Log activity
        if (typeof addActivityLog === 'function') {
            addActivityLog(
                'Inventory Auto-Update',
                `${oilType} updated: ${monitoring.transactionType} ${quantity}kg (New Stock: ${item.currentStock.toFixed(2)}kg)`
            );
        }
    }
}

// Initialize automation
function initializeInventoryAutomation() {
    // Check low stock levels on page load
    checkLowStockLevels();
    
    // Check every 15 minutes
    setInterval(checkLowStockLevels, 15 * 60 * 1000);
}

// ==========================
// 🔹 Inventory & Monitoring
// ==========================

// Update stock movement
function updateStockMovement() {
  const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
  const tbody = document.querySelector('#stock-movement tbody');
  tbody.innerHTML = '';

  if (monitorings.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6" style="text-align:center;">No records yet</td></tr>
    `;
    return;
  }

  monitorings.forEach((m, i) => {
    const refNo = `${m.transactionType === 'Stock In' ? 'SI' : 'SO'}-${m.date.replace(/-/g, '')}${i}`;
    const row = `
      <tr class="table-row">
        <td>${m.date}</td>
        <td>${m.oilType}</td>
        <td>${m.transactionType}</td>
        <td>${m.quantity}</td>
        <td>${refNo}</td>
        <td>${m.handler}</td>
      </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

// ✅ Fixed Clear Current Inventory
function clearCurrentInventory() {
  const tbody = document.querySelector('#current-inventory-table tbody');
  if (!tbody) return;

  verifyAdminPassword(() => {
    showConfirmationModal(() => {
      tbody.innerHTML = `
        <tr class="table-row">
          <td class="table-cell-muted" colspan="6">No inventory data</td>
        </tr>
      `;
      localStorage.removeItem('currentInventory');
      updateInventoryStats();
      alert('✅ Current Inventory cleared!');
    });
  });
}

// Clear Stock Movement
function clearStockMovementHistory() {
  verifyAdminPassword(() => {
    showConfirmationModal(() => {
      localStorage.removeItem('monitorings');
      updateStockMovement();
      alert('✅ Stock Movement History cleared!');
    });
  });
}

// ==========================
// 🔹 Sidebar / Profile / Initialization
// ==========================
function updateProfilePicture(imageUrl) {
  const profileImage = document.querySelector('.sidebar-profile-picture img');
  if (profileImage) profileImage.src = imageUrl;
}

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

function updateTopStats() {
  const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
  const stockLevels = { 'Coconut Oil': 300, 'Palm Oil': 1700 };

  monitorings.forEach(m => {
    if (m.transactionType === 'Stock In') stockLevels[m.oilType] += m.quantity;
    if (m.transactionType === 'Stock Out') stockLevels[m.oilType] -= m.quantity;
  });

  const totalValue = stockLevels['Coconut Oil'] * 65 + stockLevels['Palm Oil'] * 45;
  const lowStockItems = (stockLevels['Coconut Oil'] < 400 ? 1 : 0) + (stockLevels['Palm Oil'] < 600 ? 1 : 0);
  const totalItems = 3;
  const usagePercent = Math.round((stockLevels['Coconut Oil'] + stockLevels['Palm Oil']) / 10000 * 100);

  document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = `₱${totalValue.toLocaleString()}`;
  document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = lowStockItems;
  document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = totalItems;
  document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = `${usagePercent}%`;
}

// ==========================
// 🔹 Filter Functions
// ==========================

// Filter function for Direct Logs
function filterDirectLogs() {
    const searchValue = document.getElementById('direct-logs-date-search').value;
    const table = document.querySelector('#direct-conversion-logs');
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

// Clear filter for Direct Logs
function clearDirectLogsFilter() {
    document.getElementById('direct-logs-date-search').value = '';
    filterDirectLogs();
}

// Filter function for Refillable Logs
function filterRefillableLogs() {
    const searchValue = document.getElementById('refillable-logs-date-search').value;
    const table = document.querySelector('#refillable-conversion-logs');
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

// Clear filter for Refillable Logs
function clearRefillableLogsFilter() {
    document.getElementById('refillable-logs-date-search').value = '';
    filterRefillableLogs();
}

// Filter function for Storage Logs
function filterStorageLogs() {
    const searchValue = document.getElementById('storage-logs-date-search').value;
    const table = document.querySelector('#storage-conversion-logs');
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

// Clear filter for Storage Logs
function clearStorageLogsFilter() {
    document.getElementById('storage-logs-date-search').value = '';
    filterStorageLogs();
}

// Filter function for Current Inventory
function filterCurrentInventory() {
    const searchValue = document.getElementById('current-inventory-search').value.toLowerCase();
    const table = document.querySelector('#current-inventory-table table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const oilTypeCell = cells[0].textContent.toLowerCase();
            if (oilTypeCell.includes(searchValue)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Clear filter for Current Inventory
function clearCurrentInventoryFilter() {
    document.getElementById('current-inventory-search').value = '';
    filterCurrentInventory();
}

// Filter function for Stock Movement
function filterStockMovement() {
    const searchValue = document.getElementById('stock-movement-date-search').value;
    const table = document.querySelector('#stock-movement');
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

// Clear filter for Stock Movement
function clearStockMovementFilter() {
    document.getElementById('stock-movement-date-search').value = '';
    filterStockMovement();
}

// ==========================
// 🔹 Page Load
// ==========================
window.addEventListener('load', function () {
  // Initialize automation
  initializeInventoryAutomation();
  const savedProfilePic = localStorage.getItem('profilePicture');
  if (savedProfilePic) updateProfilePicture(savedProfilePic);

  const savedName = localStorage.getItem('userName');
  if (savedName) document.querySelector('.sidebar-welcome').textContent = `Welcome, ${savedName}`;

  const savedPrivilege = localStorage.getItem('userPrivilege');
  if (savedPrivilege) document.querySelector('.sidebar-mode').textContent = `${savedPrivilege} Mode`;

  updateStockMovement();
  updateCurrentInventory();
  updateTopStats();
  updateDirectConversionLogs();
  updateRefillableConversionLogs();
  updateStorageConversionLogs();
});
