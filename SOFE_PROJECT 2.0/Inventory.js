// ==========================
// INVENTORY.JS (Enhanced)
// ==========================

// ==========================
// 🔹 Show/Hide Conversions
// ==========================

function showConversion(type) {
  // Hide all conversion options
  document.getElementById('tons-to-kg-conversion').style.display = 'none';
  document.getElementById('kg-to-bottles-conversion').style.display = 'none';

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


// ==========================
// 🔹 Update Conversion Logs
// ==========================

function toNumber(value) {
  if (value === null || value === undefined) return NaN;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const cleaned = String(value).replace(/,/g, '').trim();
  if (!cleaned) return NaN;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : NaN;
}

function formatNumber(value, { minimumFractionDigits = 0, maximumFractionDigits = 2 } = {}) {
  const num = toNumber(value);
  if (!Number.isFinite(num)) {
    return '';
  }
  return num.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits });
}

function normalizeDirectConversionLog(log, fallbackHandler) {
  const fallback = {
    date: '',
    tons: '',
    kg: '',
    handler: fallbackHandler || 'Guest'
  };

  const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;

  if (!log) {
    return { ...fallback };
  }

  // Helper to extract numeric value
  const extractNumber = value => {
    const numeric = toNumber(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  // Helper to extract a date string
  const extractDate = value => {
    if (typeof value === 'string' && dateRegex.test(value)) {
      return value.trim();
    }
    return null;
  };

  // Helper to extract handler string
  const extractHandler = value => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed && !dateRegex.test(trimmed) && Number.isNaN(toNumber(trimmed))) {
        return trimmed;
      }
    }
    return null;
  };

  // If entry is already in expected object form
  if (typeof log === 'object' && !Array.isArray(log)) {
    let date = extractDate(log.date) || extractDate(log.timestamp) || '';
    let tons = extractNumber(log.tons);
    let kg = extractNumber(log.kg);
    let handler =
      extractHandler(log.handler) ||
      extractHandler(log.conductedBy) ||
      extractHandler(log.user) ||
      extractHandler(log.username) ||
      extractHandler(log.operator) ||
      fallback.handler;

    const rawValues = Object.values(log);
    const stringValues = rawValues.filter(value => typeof value === 'string');
    const numericCandidates = rawValues
      .map(extractNumber)
      .filter(Number.isFinite);

    // Handle mis-ordered values (date stored under other keys)
    if (!date) {
      date =
        extractDate(log.tons) ||
        extractDate(log.kg) ||
        extractDate(log.handler) ||
        extractDate(log[0]) ||
        stringValues.map(extractDate).find(Boolean) ||
        '';
    }

    // If date was stored under tons, shift actual ton value from kg/handler
    if (!Number.isFinite(tons)) {
      tons = extractNumber(log.inputTons) ?? extractNumber(log.valueTons) ?? null;
    }

    if (!Number.isFinite(kg)) {
      kg = extractNumber(log.outputKg) ?? extractNumber(log.valueKg) ?? null;
    }

    if (!Number.isFinite(tons)) {
      tons = numericCandidates.find(value => value < 1000) ?? tons;
    }

    if (!Number.isFinite(kg)) {
      kg = numericCandidates.find(value => value >= 1000) ?? kg;
    }

    if (!Number.isFinite(tons)) {
      const candidate = extractNumber(log.kg);
      if (Number.isFinite(candidate) && candidate < 1000) {
        tons = candidate;
      }
    }

    if (!Number.isFinite(kg)) {
      const candidate = extractNumber(log.tons);
      if (Number.isFinite(candidate) && candidate >= 1000) {
        kg = candidate;
      }
    }

    if (Number.isFinite(tons) && !Number.isFinite(kg)) {
      kg = tons * 1000;
    }

    if (!Number.isFinite(tons) && Number.isFinite(kg)) {
      tons = kg / 1000;
    }

    if (Number.isFinite(tons) && Number.isFinite(kg) && tons > kg) {
      [tons, kg] = [kg, tons];
    }

    if (!handler || handler === fallback.handler) {
      handler =
        stringValues
          .map(extractHandler)
          .find(Boolean) ||
        handler ||
        fallback.handler;
    }

    return {
      date: date || '',
      tons: Number.isFinite(tons) ? tons : '',
      kg: Number.isFinite(kg) ? kg : '',
      handler: handler || fallback.handler
    };
  }

  // If entry is an array, assume [date, tons, kg, handler]
  if (Array.isArray(log)) {
    const [rawDate, rawTons, rawKg, rawHandler] = log;
    let date = extractDate(rawDate) || '';
    let tons = extractNumber(rawTons);
    let kg = extractNumber(rawKg);
    let handler = extractHandler(rawHandler) || fallback.handler;

    if (!Number.isFinite(tons) && Number.isFinite(kg)) {
      tons = kg / 1000;
    }
    if (Number.isFinite(tons) && !Number.isFinite(kg)) {
      kg = tons * 1000;
    }

    return {
      date,
      tons: Number.isFinite(tons) ? tons : '',
      kg: Number.isFinite(kg) ? kg : '',
      handler
    };
  }

  // If entry is a string, attempt to parse CSV-like structure
  if (typeof log === 'string') {
    const parts = log.split(/[|,]/).map(part => part.trim());
    const numbers = parts.map(extractNumber).filter(Number.isFinite);
    const date = parts.map(extractDate).find(Boolean) || '';
    const handler = parts.map(extractHandler).find(Boolean) || fallback.handler;

    let tons = numbers.length > 0 ? numbers[0] : null;
    let kg = numbers.length > 1 ? numbers[1] : null;

    if (!Number.isFinite(tons) && Number.isFinite(kg)) {
      tons = kg / 1000;
    }
    if (Number.isFinite(tons) && !Number.isFinite(kg)) {
      kg = tons * 1000;
    }

    return {
      date,
      tons: Number.isFinite(tons) ? tons : '',
      kg: Number.isFinite(kg) ? kg : '',
      handler
    };
  }

  return { ...fallback };
}

function updateDirectConversionLogs() {
  const logs = JSON.parse(localStorage.getItem('directConversionLogs')) || [];
  const tbody = document.querySelector('#direct-conversion-logs tbody');
  if (!tbody) return;

  const fallbackHandler = localStorage.getItem('userName') || 'Guest';
  const normalizedLogs = logs.map(log => normalizeDirectConversionLog(log, fallbackHandler));
  const normalizedJson = JSON.stringify(normalizedLogs);
  if (normalizedJson !== JSON.stringify(logs)) {
    localStorage.setItem('directConversionLogs', normalizedJson);
  }

  tbody.innerHTML = '';

  if (normalizedLogs.length === 0) {
    tbody.innerHTML = `
      <tr class="table-row">
        <td class="table-cell-muted" colspan="4" style="text-align: center;">No conversion logs available.</td>
      </tr>
    `;
    return;
  }

  normalizedLogs.forEach(log => {
    const tonsDisplay = formatNumber(log.tons, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    const kgDisplay = formatNumber(log.kg, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const handlerDisplay = log.handler || fallbackHandler;
    const row = `<tr class="table-row">
      <td class="table-cell" data-label="Date">${log.date || ''}</td>
      <td class="table-cell" data-label="Tons">${tonsDisplay}</td>
      <td class="table-cell" data-label="Kilograms">${kgDisplay}</td>
      <td class="table-cell" data-label="Conducted By">${handlerDisplay}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function updateRefillableConversionLogs() {
  const logs = JSON.parse(localStorage.getItem('refillableConversionLogs')) || [];
  const tbody = document.querySelector('#refillable-conversion-logs tbody');
  if (!tbody) return;

  const fallbackHandler = localStorage.getItem('userName') || 'Guest';

  tbody.innerHTML = '';

  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr class="table-row">
        <td class="table-cell-muted" colspan="4" style="text-align: center;">No conversion logs available.</td>
      </tr>
    `;
    return;
  }

  logs.forEach(log => {
    const kgDisplay = formatNumber(log.kg, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const handlerDisplay = log.handler || fallbackHandler;
    const row = `<tr class="table-row">
      <td class="table-cell" data-label="Date">${log.date || ''}</td>
      <td class="table-cell" data-label="Kilograms">${kgDisplay}</td>
      <td class="table-cell" data-label="Bottles">${log.bottles || ''}</td>
      <td class="table-cell" data-label="Conducted By">${handlerDisplay}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}


// 🔹 Clear Log Functions (using modal + admin password)
// ==========================
function clearDirectConversionLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear the direct conversion logs? This action cannot be undone.',
      () => {
        localStorage.removeItem('directConversionLogs');
        updateDirectConversionLogs();
        alert('✅ Direct Conversion Logs cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Direct Conversion Logs');
}

function clearRefillableConversionLogs() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear the refillable conversion logs? This action cannot be undone.',
      () => {
        localStorage.removeItem('refillableConversionLogs');
        updateRefillableConversionLogs();
        alert('✅ Refillable Conversion Logs cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Refillable Conversion Logs');
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
    const tbody = document.querySelector('#inventory-table tbody');
    if (!tbody) return;
    
    let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    
    // Show empty state if no inventory items
    if (inventory.length === 0) {
        tbody.innerHTML = `
            <tr class="table-row">
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell" style="text-align: center;">No inventory items.</td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
              <td class="table-cell"></td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        // Determine status based on stock level
        const currentStock = parseFloat(item.currentStock || 0);
        const minimumLevel = parseFloat(item.minimumLevel || 0);
        const status = currentStock < minimumLevel ? 'Low Stock' : 'Normal';
        const statusClass = status === 'Low Stock' ? 'status-low' : 'status-normal';
        
        row.innerHTML = `
            <td class="table-cell">${item.oilType}</td>
            <td class="table-cell">${currentStock.toFixed(2)}</td>
            <td class="table-cell">${item.minimumLevel || 0}</td>
            <td class="table-cell">${item.maximumCapacity || 0}</td>
            <td class="table-cell">₱${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
            <td class="table-cell"><span class="status-badge ${statusClass}">${status}</span></td>
            <td class="table-cell">${item.handler || 'Admin'}</td>
            <td class="table-cell">
                <button class="action-btn edit-btn" onclick="openEditInventoryModal('${item.id || index}')" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="deleteInventoryItem('${item.id || index}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update status in localStorage
    inventory.forEach(item => {
        const currentStock = parseFloat(item.currentStock || 0);
        const minimumLevel = parseFloat(item.minimumLevel || 0);
        item.status = currentStock < minimumLevel ? 'Low Stock' : 'Normal';
    });
    localStorage.setItem('currentInventory', JSON.stringify(inventory));
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

// Update inventory history
function updateStockMovement() {
  const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
  const tbody = document.querySelector('#stock-movement tbody');
  tbody.innerHTML = '';

  if (monitorings.length === 0) {
    tbody.innerHTML = `
      <tr class="table-row"><td class="table-cell-muted" colspan="6" style="text-align:center;">No inventory history records</td></tr>
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
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear the current inventory? This action cannot be undone.',
      () => {
        localStorage.removeItem('currentInventory');
        updateCurrentInventory();
        updateTopStats();
        alert('✅ Current Inventory cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Current Inventory');
}

// Clear Inventory History
function clearStockMovementHistory() {
  verifyAdminPassword(() => {
    showConfirmationModal(
      'Confirm Clear',
      'Are you sure you want to clear the inventory history? This action cannot be undone.',
      () => {
        localStorage.removeItem('monitorings');
        updateStockMovement();
        alert('✅ Inventory History cleared!');
      }
    );
  }, 'Verify Admin Password to Clear Inventory History');
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

function updateTopStats() {
  const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
  
  // Calculate stats from inventory
  let totalValue = 0;
  let totalStock = 0;
  let totalCapacity = 0;
  let lowStockItems = 0;
  
  inventory.forEach(item => {
    const stock = parseFloat(item.currentStock || 0);
    const minLevel = parseFloat(item.minimumLevel || 0);
    const price = parseFloat(item.unitPrice || 0);
    const capacity = parseFloat(item.maximumCapacity || 0);
    
    totalValue += stock * price;
    totalStock += stock;
    totalCapacity += capacity;
    
    if (stock < minLevel) {
      lowStockItems++;
    }
  });
  
  const totalItems = inventory.length;
  const usagePercent = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;
  
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length >= 4) {
    statCards[0].querySelector('.stat-value').textContent = `₱${totalValue.toLocaleString()}`;
    statCards[1].querySelector('.stat-value').textContent = lowStockItems;
    statCards[2].querySelector('.stat-value').textContent = totalItems;
    statCards[3].querySelector('.stat-value').textContent = `${usagePercent}%`;
  }
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


// Filter function for Current Inventory
function filterCurrentInventory() {
    const searchValue = document.getElementById('current-inventory-search').value.toLowerCase();
    const table = document.querySelector('#inventory-table');
    if (!table) return;
    
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

// Filter function for Inventory History
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

// Clear filter for Inventory History
function clearStockMovementFilter() {
    document.getElementById('stock-movement-date-search').value = '';
    filterStockMovement();
}

// ==========================
// 🔹 Inventory CRUD Functions
// ==========================

// Open modal for adding new inventory item
function openAddInventoryModal() {
    const modal = document.getElementById('inventoryModal');
    const form = document.getElementById('inventoryForm');
    const title = document.getElementById('inventoryModalTitle');
    
    if (!modal || !form) return;
    
    title.textContent = 'Add Inventory Item';
    form.reset();
    form.dataset.mode = 'add';
    form.dataset.itemId = '';
    
    // Reset dropdown to default
    const oilTypeSelect = document.getElementById('inventory-oil-type');
    if (oilTypeSelect) {
        oilTypeSelect.value = '';
    }
    
    modal.style.display = 'block';
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('inventory-oil-type').focus();
    }, 100);
}

// Open modal for editing inventory item
function openEditInventoryModal(itemId) {
    const modal = document.getElementById('inventoryModal');
    const form = document.getElementById('inventoryForm');
    const title = document.getElementById('inventoryModalTitle');
    
    if (!modal || !form) return;
    
    const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    const item = inventory.find(inv => inv.id === itemId || inventory.indexOf(inv).toString() === itemId);
    
    if (!item) {
        alert('Item not found!');
        return;
    }
    
    title.textContent = 'Edit Inventory Item';
    form.dataset.mode = 'edit';
    form.dataset.itemId = item.id || itemId;
    
    // Populate form fields
    document.getElementById('inventory-oil-type').value = item.oilType || '';
    document.getElementById('inventory-current-stock').value = item.currentStock || 0;
    document.getElementById('inventory-minimum-level').value = item.minimumLevel || 0;
    document.getElementById('inventory-maximum-capacity').value = item.maximumCapacity || 0;
    document.getElementById('inventory-unit-price').value = item.unitPrice || 0;
    
    modal.style.display = 'block';
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('inventory-oil-type').focus();
    }, 100);
}

// Handle form submission (add or edit)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inventoryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveInventoryItem();
        });
    }
});

// Save inventory item (add or update)
function saveInventoryItem() {
    const form = document.getElementById('inventoryForm');
    if (!form) return;
    
    const mode = form.dataset.mode || 'add';
    const itemId = form.dataset.itemId || '';
    
    // Get form values
    const oilTypeSelect = document.getElementById('inventory-oil-type');
    const oilType = oilTypeSelect.value.trim();
    const currentStock = parseFloat(document.getElementById('inventory-current-stock').value) || 0;
    const minimumLevel = parseFloat(document.getElementById('inventory-minimum-level').value) || 0;
    const maximumCapacity = parseFloat(document.getElementById('inventory-maximum-capacity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('inventory-unit-price').value) || 0;
    
    // Validation
    if (!oilType) {
        alert('Please select an oil type.');
        return;
    }
    
    if (currentStock < 0 || minimumLevel < 0 || maximumCapacity < 0 || unitPrice < 0) {
        alert('All values must be non-negative.');
        return;
    }
    
    if (minimumLevel >= maximumCapacity) {
        alert('Minimum level must be less than maximum capacity.');
        return;
    }
    
    let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    const currentUser = localStorage.getItem('userName') || 'Admin';
    
    // Determine status
    const status = currentStock < minimumLevel ? 'Low Stock' : 'Normal';
    
    if (mode === 'edit') {
        // Update existing item
        const itemIndex = inventory.findIndex(inv => inv.id === itemId || inventory.indexOf(inv).toString() === itemId);
        
        if (itemIndex !== -1) {
            inventory[itemIndex] = {
                ...inventory[itemIndex],
                oilType,
                currentStock,
                minimumLevel,
                maximumCapacity,
                unitPrice,
                status,
                handler: currentUser
            };
            
            // Log activity
            if (typeof addActivityLog === 'function') {
                addActivityLog(
                    'Inventory Updated',
                    `Updated ${oilType}: Stock: ${currentStock}kg, Min: ${minimumLevel}kg, Max: ${maximumCapacity}kg, Price: ₱${unitPrice.toFixed(2)}`
                );
            }
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now().toString(),
            oilType,
            currentStock,
            minimumLevel,
            maximumCapacity,
            unitPrice,
            status,
            handler: currentUser
        };
        
        // Check if oil type already exists
        if (inventory.some(inv => inv.oilType.toLowerCase() === oilType.toLowerCase())) {
            if (!confirm(`An item with oil type "${oilType}" already exists. Do you want to update it instead?`)) {
                return;
            }
            // Update existing instead
            const existingIndex = inventory.findIndex(inv => inv.oilType.toLowerCase() === oilType.toLowerCase());
            inventory[existingIndex] = { ...inventory[existingIndex], ...newItem };
        } else {
            inventory.push(newItem);
        }
        
        // Log activity
        if (typeof addActivityLog === 'function') {
            addActivityLog(
                'Inventory Item Added',
                `Added ${oilType}: Stock: ${currentStock}kg, Min: ${minimumLevel}kg, Max: ${maximumCapacity}kg, Price: ₱${unitPrice.toFixed(2)}`
            );
        }
    }
    
    // Save to localStorage
    localStorage.setItem('currentInventory', JSON.stringify(inventory));
    
    // Update UI
    updateCurrentInventory();
    updateTopStats();
    
    // Close modal
    closeModal('inventoryModal');
    
    alert(`✅ Inventory item ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
}

// Delete inventory item
function deleteInventoryItem(itemId) {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
        return;
    }
    
    let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    const itemIndex = inventory.findIndex(inv => inv.id === itemId || inventory.indexOf(inv).toString() === itemId);
    
    if (itemIndex === -1) {
        alert('Item not found!');
        return;
    }
    
    const deletedItem = inventory[itemIndex];
    inventory.splice(itemIndex, 1);
    
    localStorage.setItem('currentInventory', JSON.stringify(inventory));
    
    // Log activity
    if (typeof addActivityLog === 'function') {
        addActivityLog(
            'Inventory Item Deleted',
            `Deleted ${deletedItem.oilType} from inventory`
        );
    }
    
    // Update UI
    updateCurrentInventory();
    updateTopStats();
    
    alert('✅ Inventory item deleted successfully!');
}

// ==========================
// 🔹 Stock In Functions
// ==========================

// Open Stock In modal
function openStockTransactionModal(transactionType) {
    // Only allow Stock In (Stock Out removed - deliveries handle stock decrease automatically)
    if (transactionType !== 'Stock In') {
        console.warn('Stock Out is no longer available. Use delivery invoices to decrease stock.');
        return;
    }
    
    const modal = document.getElementById('stockTransactionModal');
    const form = document.getElementById('stockTransactionForm');
    const title = document.getElementById('stockTransactionModalTitle');
    const submitBtn = document.getElementById('stock-transaction-submit-btn');
    
    if (!modal || !form || !title) return;
    
    // Set transaction type (always Stock In)
    modal.dataset.transactionType = 'Stock In';
    title.textContent = 'Stock In';
    submitBtn.style.backgroundColor = '#10b981';
    submitBtn.textContent = 'Stock In';
    
    // Reset form
    form.reset();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('stock-transaction-date').value = today;
    
    // Populate oil types from existing inventory
    const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    const oilTypeSelect = document.getElementById('stock-transaction-oil-type');
    oilTypeSelect.innerHTML = '<option value="">Select Oil Type</option>';
    
    // Get unique oil types from inventory
    const oilTypes = [...new Set(inventory.map(item => item.oilType))];
    oilTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        oilTypeSelect.appendChild(option);
    });
    
    // If no inventory items, show default options
    if (oilTypes.length === 0) {
        const defaultTypes = ['Coconut Oil', 'Palm Oil'];
        defaultTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            oilTypeSelect.appendChild(option);
        });
    }
    
    modal.style.display = 'block';
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('stock-transaction-oil-type').focus();
    }, 100);
}

// Handle Stock In form submission
document.addEventListener('DOMContentLoaded', function() {
    // Ensure confirmation modal is hidden immediately on DOM ready
    const clearModal = document.getElementById('clearModal');
    if (clearModal) {
        clearModal.style.setProperty('display', 'none', 'important');
    }
    
    const stockTransactionForm = document.getElementById('stockTransactionForm');
    if (stockTransactionForm) {
        stockTransactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processStockTransaction();
        });
    }
});

// Process Stock In transaction (Stock Out removed - use delivery invoices instead)
function processStockTransaction() {
    const modal = document.getElementById('stockTransactionModal');
    const transactionType = modal.dataset.transactionType || 'Stock In';
    
    // Only allow Stock In
    if (transactionType !== 'Stock In') {
        alert('⚠️ Stock Out is no longer available. Stock decrease is handled automatically through delivery invoices.');
        return;
    }
    
    // Get form values
    const oilType = document.getElementById('stock-transaction-oil-type').value.trim();
    const quantity = parseFloat(document.getElementById('stock-transaction-quantity').value);
    const date = document.getElementById('stock-transaction-date').value;
    const notes = document.getElementById('stock-transaction-notes').value.trim();
    
    // Validation
    if (!oilType) {
        alert('Please select an oil type.');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity greater than 0.');
        return;
    }
    
    if (!date) {
        alert('Please select a date.');
        return;
    }
    
    // Get or initialize inventory
    let inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
    let item = inventory.find(inv => inv.oilType === oilType);
    
    // Create or update inventory item
    if (!item) {
        // Create new inventory item if it doesn't exist
        item = {
            id: Date.now().toString(),
            oilType: oilType,
            currentStock: 0,
            minimumLevel: oilType === 'Coconut Oil' ? 400 : 600,
            maximumCapacity: 3000,
            unitPrice: oilType === 'Coconut Oil' ? 65 : 45,
            status: 'Normal',
            handler: localStorage.getItem('userName') || 'Admin'
        };
        inventory.push(item);
    }
    
    // Update stock (Stock In only)
    const quantityBefore = parseFloat(item.currentStock || 0);
    item.currentStock = quantityBefore + quantity;
    
    // Check if exceeds maximum capacity
    const maxCapacity = parseFloat(item.maximumCapacity || 0);
    if (maxCapacity > 0 && item.currentStock > maxCapacity) {
        if (!confirm(`⚠️ Warning: Stock will exceed maximum capacity (${maxCapacity.toFixed(2)} kg). New stock will be ${item.currentStock.toFixed(2)} kg. Do you want to proceed?`)) {
            return;
        }
    }
    
    // Update status based on new stock level
    const minLevel = parseFloat(item.minimumLevel || 0);
    item.status = parseFloat(item.currentStock) < minLevel ? 'Low Stock' : 'Normal';
    item.handler = localStorage.getItem('userName') || 'Admin';
    
    // Save updated inventory
    localStorage.setItem('currentInventory', JSON.stringify(inventory));
    
    // Create transaction record
    const transaction = {
        id: Date.now().toString(),
        monitoringType: 'Stock',
        transactionType: 'Stock In',
        oilType: oilType,
        quantity: quantity.toFixed(2),
        date: date,
        notes: notes || '',
        handler: localStorage.getItem('userName') || 'Admin',
        quantityBefore: quantityBefore.toFixed(2),
        quantityAfter: parseFloat(item.currentStock).toFixed(2),
        timestamp: new Date().toISOString()
    };
    
    // Save transaction to monitorings
    let monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    monitorings.push(transaction);
    localStorage.setItem('monitorings', JSON.stringify(monitorings));
    
    // Update UI
    updateCurrentInventory();
    updateStockMovement();
    updateTopStats();
    
    // Check for low stock alerts
    checkLowStockLevels();
    
    // Log activity
    if (typeof addActivityLog === 'function') {
        addActivityLog(
            'Stock In',
            `${oilType}: Stock In ${quantity.toFixed(2)}kg (Before: ${quantityBefore.toFixed(2)}kg, After: ${item.currentStock.toFixed(2)}kg)${notes ? ' - ' + notes : ''}`
        );
    }
    
    // Close modal
    closeModal('stockTransactionModal');
    
    // Show success message
    alert(`✅ Stock In recorded successfully!\n\n${oilType}\nStock In: ${quantity.toFixed(2)} kg\nNew Stock: ${item.currentStock.toFixed(2)} kg`);
}

// ==========================
// 🔹 Page Load
// ==========================
window.addEventListener('load', function () {
  // Ensure confirmation modal is hidden on page load with !important
  const clearModal = document.getElementById('clearModal');
  if (clearModal) {
    clearModal.style.setProperty('display', 'none', 'important');
  }
  
  // Ensure admin password modal is hidden on page load
  const adminPasswordModal = document.getElementById('adminPasswordModal');
  if (adminPasswordModal) {
    adminPasswordModal.style.setProperty('display', 'none', 'important');
  }
  
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
});
