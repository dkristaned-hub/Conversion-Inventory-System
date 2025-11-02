// Function to update profile picture
function updateProfilePicture(imageUrl) {
    const profileImage = document.querySelector('.sidebar-profile-picture img');
    if (profileImage) {
        profileImage.src = imageUrl;
    }
}

// Function to convert kg to tons (direct)
function convertKgToTons() {
    const kgInput = document.getElementById('kg-input').value;
    const resultDiv = document.getElementById('conversion-result');
    if (kgInput && !isNaN(kgInput) && kgInput > 0) {
        const kg = parseFloat(kgInput);
        const tons = kg / 1016.0469088;
        resultDiv.textContent = `${kg.toFixed(2)} kg = ${tons.toFixed(2)} tons`;
    } else {
        resultDiv.textContent = 'Please enter a valid positive number for kilograms.';
    }
}

// Function to convert storage level to kg and tons
function convertStorageToTons() {
    const capacity = document.getElementById('capacity-input').value;
    const level = document.getElementById('level-input').value;
    const resultDiv = document.getElementById('conversion-result');
    if (capacity && !isNaN(capacity) && capacity > 0 && level && !isNaN(level) && level >= 0 && level <= 100) {
        const currentKg = (capacity * level) / 100;
        const tons = currentKg / 1016.0469088;
        resultDiv.textContent = `Current level: ${currentKg.toFixed(2)} kg = ${tons.toFixed(2)} tons`;
    } else {
        resultDiv.textContent = 'Please enter valid capacity (positive kg) and level (0-100%).';
    }
}

// Set date restrictions (3 years ago to 1 year from now)
function setDateRestrictions() {
    const monitoringDateInput = document.getElementById('monitoring-date');
    if (monitoringDateInput) {
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
        const maxYear = oneYearFromNow.getFullYear();
        const maxMonth = String(oneYearFromNow.getMonth() + 1).padStart(2, '0');
        const maxDay = String(oneYearFromNow.getDate()).padStart(2, '0');
        const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;
        
        const minYear = threeYearsAgo.getFullYear();
        const minMonth = String(threeYearsAgo.getMonth() + 1).padStart(2, '0');
        const minDay = String(threeYearsAgo.getDate()).padStart(2, '0');
        const minDate = `${minYear}-${minMonth}-${minDay}`;
        
        monitoringDateInput.setAttribute('max', maxDate);
        monitoringDateInput.setAttribute('min', minDate);
        
        console.log('Date restrictions set:', { minDate, maxDate });
    }
}

// Function to submit monitoring
function submitMonitoring() {
    const date = document.getElementById('monitoring-date').value;
    const oilType = document.getElementById('oil-type').value;
    const monitoringType = document.getElementById('monitoring-type').value;
    const transactionType = document.getElementById('transaction-type').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const notes = document.getElementById('notes').value;
    const resultDiv = document.getElementById('monitoring-result');

    if (!date || !quantity || quantity <= 0) {
        resultDiv.textContent = 'Please fill in all required fields with valid values.';
        return;
    }

    const oilTypeFull = oilType === 'coconut' ? 'Coconut Oil' : 'Palm Oil';

    const monitoring = {
        date,
        oilType: oilTypeFull,
        monitoringType,
        transactionType,
        quantity,
        notes,
        handler: localStorage.getItem('userName') || 'Guest'
    };

    // Get existing monitorings
    let monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    monitorings.push(monitoring);
    localStorage.setItem('monitorings', JSON.stringify(monitorings));
    
    // Automatic inventory update if it's a stock transaction
    if (typeof autoUpdateInventoryFromMonitoring === 'function') {
        autoUpdateInventoryFromMonitoring(monitoring);
    }

    // If temperature monitoring, update stock reports
    if (monitoringType === 'Temperature') {
        const tankId = oilType === 'coconut' ? 'Tank-01' : 'Tank-03';
        const stockReport = {
            tankId,
            oilType: oilTypeFull,
            level: getCurrentStorageData().find(data => data.tankId === tankId).level, // Keep current level
            temperature: quantity, // Quantity is temperature
            notes,
            date,
            handler: localStorage.getItem('userName') || 'Guest'
        };

        let stockReports = JSON.parse(localStorage.getItem('stockReports')) || [];
        stockReports.push(stockReport);
        localStorage.setItem('stockReports', JSON.stringify(stockReports));

        // Update storage table
        updateStorageMonitoringTable();
    }

    resultDiv.textContent = 'Monitoring submitted successfully!';

    // Log activity
    if (typeof addActivityLog === 'function') {
      addActivityLog(
        'Monitoring Submitted',
        `${monitoringType} - ${oilTypeFull}: ${transactionType} ${quantity} kg on ${date}${notes ? ` (${notes})` : ''}`
      );
    }

    // Clear form
    document.getElementById('monitoring-date').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('notes').value = '';

    // Update tables in this page if needed
    updateUsageTrends();
}

// Function to update Usage Trends table
function updateUsageTrends() {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const usageTrendReports = JSON.parse(localStorage.getItem('usageTrendReports')) || [];
    const tbody = document.querySelector('#usage-trends tbody');
    tbody.innerHTML = '';

    // Collect all logs: Stock Out monitorings and usage trend reports
    const logs = [];

    // Add Stock Out monitorings as logs
    monitorings.forEach(monitoring => {
        if (monitoring.transactionType === 'Stock Out') {
            logs.push({
                date: monitoring.date,
                oilType: monitoring.oilType,
                consumption: monitoring.quantity,
                trend: 'Monitored',
                notes: monitoring.notes || '',
                conductedBy: monitoring.handler || 'Unknown',
                type: 'monitoring'
            });
        }
    });

    // Add usage trend reports as logs
    usageTrendReports.forEach(report => {
        logs.push({
            date: report.date,
            oilType: report.oilType,
            consumption: report.consumption,
            trend: report.trend,
            notes: report.notes || '',
            conductedBy: report.handler || 'Unknown',
            type: 'report'
        });
    });

    // Sort logs by date descending
    const sortedLogs = logs.sort((a, b) => {
        // Handle different date formats
        let dateA, dateB;
        if (a.date.includes('/')) {
            // MM/DD/YYYY, HH:MM AM/PM format
            dateA = new Date(a.date.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{1,2}):(\d{2}) (AM|PM)/, '$3-$1-$2T$4:$5:00 $6'));
        } else {
            // YYYY-MM-DD format
            dateA = new Date(a.date);
        }
        if (b.date.includes('/')) {
            dateB = new Date(b.date.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{1,2}):(\d{2}) (AM|PM)/, '$3-$1-$2T$4:$5:00 $6'));
        } else {
            dateB = new Date(b.date);
        }
        return dateB - dateA;
    });

    sortedLogs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${log.date}</td>
            <td class="table-cell">${log.oilType}</td>
            <td class="table-cell">${log.consumption}</td>
            <td class="table-cell">${log.trend}</td>
            <td class="table-cell">${log.notes}</td>
            <td class="table-cell">${log.conductedBy}</td>
        `;
        tbody.appendChild(row);
    });

    // If no data, leave table empty

    // Update top stats after updating usage trends
    updateTopStats(getCurrentStorageData());
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

// Function to update Storage Monitoring table
function updateStorageMonitoringTable() {
    const tbody = document.querySelector('#storage-monitoring tbody');
    tbody.innerHTML = '';

    // Load stock reports from localStorage
    const stockReports = JSON.parse(localStorage.getItem('stockReports')) || [];

    // Sort reports by date descending
    const sortedReports = stockReports.sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedReports.forEach(report => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">${report.date}</td>
            <td class="table-cell">${report.tankId}</td>
            <td class="table-cell">${report.oilType}</td>
            <td class="table-cell">${report.level}</td>
            <td class="table-cell">${report.temperature}</td>
            <td class="table-cell">${report.status}</td>
            <td class="table-cell">${report.handler || 'Unknown'}</td>
        `;
        tbody.appendChild(row);
    });

    // If no reports, leave table empty

    // Update top stats after updating table
    updateTopStats(getCurrentStorageData());
}

// Function to update alerts
function updateAlerts(storageData) {
    const coconutAlertsContainer = document.getElementById('coconut-alerts');
    const palmAlertsContainer = document.getElementById('palm-alerts');
    coconutAlertsContainer.innerHTML = '';
    palmAlertsContainer.innerHTML = '';

    const coconutAlerts = [];
    const palmAlerts = [];

    storageData.forEach(data => {
        const alertsArray = data.oilType === 'Coconut Oil' ? coconutAlerts : palmAlerts;

        if (data.temperature > 30) {
            alertsArray.push({
                type: 'High Temperature Heat',
                priority: 'high-priority',
                priorityText: 'Danger',
                message: 'Critical high temperature detected',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
        if (data.temperature > 25 && data.temperature <= 30) {
            alertsArray.push({
                type: 'Temperature',
                priority: 'high-priority',
                priorityText: 'Danger',
                message: 'Temperature above threshold',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
        if (data.level >= 95) {
            alertsArray.push({
                type: 'Tank Overflowing',
                priority: 'high-priority',
                priorityText: 'Danger',
                message: 'Tank is nearly full or overflowing',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
        if (data.level <= 5) {
            alertsArray.push({
                type: 'Tank Empty',
                priority: 'high-priority',
                priorityText: 'Danger',
                message: 'Tank is empty or nearly empty',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
        if (data.level < 20 && data.level > 5) {
            alertsArray.push({
                type: 'Low Stock',
                priority: 'high-priority',
                priorityText: 'Danger',
                message: 'Stock below minimum level',
                details: `${data.oilType} - ${new Date().toLocaleString()}`
            });
        }
        if (data.temperature > 23 && data.temperature <= 25) {
            alertsArray.push({
                type: 'Temperature',
                priority: 'medium-priority',
                priorityText: 'Warning',
                message: 'Temperature approaching threshold',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
        if (data.temperature <= 23 && data.level >= 20 && data.level < 95) {
            alertsArray.push({
                type: 'Normal Status',
                priority: 'low-priority',
                priorityText: 'Normal',
                message: 'All parameters within normal range',
                details: `${data.oilType} Tank - ${new Date().toLocaleString()}`
            });
        }
    });

    // Function to render alerts for a container
    const renderAlerts = (container, alerts) => {
        if (alerts.length === 0) {
            container.innerHTML = '<p class="no-alerts">No active alerts</p>';
            return;
        }

        alerts.forEach(alert => {
            const alertCard = document.createElement('div');
            alertCard.className = `alert-card ${alert.priority}`;
            alertCard.innerHTML = `
                <div class="alert-header">
                    <span class="alert-type">${alert.type}</span>
                    <span class="alert-priority">${alert.priorityText}</span>
                </div>
                <div class="alert-content">
                    <p class="alert-message">${alert.message}</p>
                    <p class="alert-details">${alert.details}</p>
                </div>
            `;
            container.appendChild(alertCard);
        });
    };

    renderAlerts(coconutAlertsContainer, coconutAlerts);
    renderAlerts(palmAlertsContainer, palmAlerts);
}

// Function to update top stats
function updateTopStats(storageData) {
    const monitorings = JSON.parse(localStorage.getItem('monitorings')) || [];
    const usageTrendReports = JSON.parse(localStorage.getItem('usageTrendReports')) || [];

    // If no data, set all stats to 0
    if (monitorings.length === 0 && usageTrendReports.length === 0) {
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = '0';
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = '0%';
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = '0 kg';
        document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = '0°C';
        updateAlerts([]); // No alerts
        return;
    }

    // Calculate average temperature
    const totalTemp = storageData.reduce((sum, data) => sum + data.temperature, 0);
    const avgTemp = Math.round(totalTemp / storageData.length);

    // Update Storage Temperature stat
    const tempStat = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (tempStat) {
        tempStat.textContent = `${avgTemp}°C`;
    }

    // Update other stats based on data
    const stockOuts = monitorings.filter(m => m.transactionType === 'Stock Out');

    // Active Alerts: count warnings (temperature > 23 or level < 20 or level >= 95 or level <= 5)
    const activeAlerts = storageData.filter(data => data.temperature > 23 || data.level < 20 || data.level >= 95 || data.level <= 5).length;

    // Current Usage Rate: average level
    const avgLevel = Math.round(storageData.reduce((sum, data) => sum + data.level, 0) / storageData.length);

    // Avg Daily Consumption: average of last 7 days stock out and usage trend reports
    const recentStockOuts = stockOuts.slice(-7).map(m => m.quantity);
    const recentUsage = usageTrendReports.slice(-7).map(r => r.consumption);
    const allConsumptions = [...recentStockOuts, ...recentUsage];
    const avgConsumption = allConsumptions.length > 0 ? Math.round(allConsumptions.reduce((sum, c) => sum + c, 0) / allConsumptions.length) : 0;

    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = activeAlerts;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = `${avgLevel}%`;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `${avgConsumption} kg`;

    // Update alerts
    updateAlerts(storageData);
}

// Function to get current storage data
function getCurrentStorageData() {
    let storageData = [
        { tankId: 'Tank-01', oilType: 'Coconut Oil', level: 62.5, temperature: 22 },
        { tankId: 'Tank-03', oilType: 'Palm Oil', level: 56.7, temperature: 23 }
    ];

    // Load latest stock reports from localStorage
    const stockReports = JSON.parse(localStorage.getItem('stockReports')) || [];

    // Update storage data with latest reports
    storageData.forEach(data => {
        const latestReport = stockReports.filter(report => report.tankId === data.tankId).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        if (latestReport) {
            data.level = latestReport.level;
            data.temperature = latestReport.temperature;
        }
    });

    return storageData;
}

// Function to open stock report form
function openStockReportForm() {
    const formDiv = document.getElementById('stock-report-form');
    const fieldsDiv = document.getElementById('stock-form-fields');
    fieldsDiv.innerHTML = `
        <label for="report-tank-id">Tank ID:</label>
        <select id="report-tank-id" class="conversion-input">
            <option value="Tank-01">Tank-01</option>
            <option value="Tank-03">Tank-03</option>
        </select>
        <label for="report-oil-type">Oil Type:</label>
        <select id="report-oil-type" class="conversion-input">
            <option value="Coconut Oil">Coconut Oil</option>
            <option value="Palm Oil">Palm Oil</option>
        </select>
        <label for="report-level">Current Level (%):</label>
        <input type="number" id="report-level" class="conversion-input" step="0.01" min="0" max="100" required>
        <label for="report-temperature">Temperature (°C):</label>
        <input type="number" id="report-temperature" class="conversion-input" step="0.01" min="0" required>
        <label for="report-status">Status:</label>
        <select id="report-status" class="conversion-input">
            <option value="Normal">Normal</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
        </select>
    `;

    formDiv.style.display = 'block';
}

// Function to close stock report form
function closeStockReportForm() {
    const formDiv = document.getElementById('stock-report-form');
    formDiv.style.display = 'none';
    document.getElementById('stock-report-result').textContent = '';
}

// Function to submit stock report
function submitStockReport() {
    const resultDiv = document.getElementById('stock-report-result');

    const tankId = document.getElementById('report-tank-id').value;
    const oilType = document.getElementById('report-oil-type').value;
    const level = parseFloat(document.getElementById('report-level').value);
    const temperature = parseFloat(document.getElementById('report-temperature').value);
    const status = document.getElementById('report-status').value;

    if (isNaN(level) || level < 0 || level > 100 || isNaN(temperature)) {
        resultDiv.textContent = 'Please enter valid values for all fields.';
        return;
    }

    // Get current date and time in 12-hour format
    const now = new Date();
    const dateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const report = {
        tankId,
        oilType,
        level,
        temperature,
        status,
        date: dateTime,
        handler: localStorage.getItem('userName') || 'Guest'
    };

    // Save report to localStorage
    let stockReports = JSON.parse(localStorage.getItem('stockReports')) || [];
    stockReports.push(report);
    localStorage.setItem('stockReports', JSON.stringify(stockReports));

    resultDiv.textContent = 'Stock report submitted successfully!';
    closeStockReportForm();

    // Update storage table if needed
    updateStorageMonitoringTable();
}

// Function to open usage trend report form
function openUsageTrendReportForm() {
    const formDiv = document.getElementById('usage-trend-report-form');
    formDiv.style.display = 'block';
}

// Function to close usage trend report form
function closeUsageTrendReportForm() {
    const formDiv = document.getElementById('usage-trend-report-form');
    formDiv.style.display = 'none';
    document.getElementById('usage-trend-report-result').textContent = '';
    // Clear form
    document.getElementById('trend-consumption').value = '';
    document.getElementById('trend-notes').value = '';
}

// Function to submit usage trend report
function submitUsageTrendReport() {
    const oilType = document.getElementById('trend-oil-type').value;
    const consumption = parseFloat(document.getElementById('trend-consumption').value);
    const trend = document.getElementById('trend-type').value;
    const notes = document.getElementById('trend-notes').value;
    const resultDiv = document.getElementById('usage-trend-report-result');

    if (!consumption || consumption <= 0) {
        resultDiv.textContent = 'Please enter a valid positive consumption value.';
        return;
    }

    // Get current date and time in 12-hour format
    const now = new Date();
    const dateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const report = {
        date: dateTime,
        oilType,
        consumption,
        trend,
        notes,
        handler: localStorage.getItem('userName') || 'Guest'
    };

    // Save report to localStorage
    let usageTrendReports = JSON.parse(localStorage.getItem('usageTrendReports')) || [];
    usageTrendReports.push(report);
    localStorage.setItem('usageTrendReports', JSON.stringify(usageTrendReports));

    resultDiv.textContent = 'Usage trend report submitted successfully!';
    closeUsageTrendReportForm();

    // Update usage trends table
    updateUsageTrends();
}

// Function to clear logs
function clearLogs() {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
        localStorage.removeItem('monitorings');
        localStorage.removeItem('usageTrendReports');
        localStorage.removeItem('stockReports');
        localStorage.setItem('exampleDataCleared', 'true');
        updateUsageTrends();
        updateStorageMonitoringTable();
        // Reset stats to 0
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = '0';
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = '0%';
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = '0 kg';
        document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = '0°C';
        alert('Logs cleared successfully.');
    }
}

// Function to clear stock reports
function clearStockReports() {
    if (confirm('Are you sure you want to clear all stock reports? This action cannot be undone.')) {
        localStorage.removeItem('stockReports');
        updateStorageMonitoringTable();
        alert('Stock reports cleared successfully.');
    }
}

// Load saved data on page load
window.addEventListener('load', function() {
    // Set date restrictions
    setDateRestrictions();
    
    // Load initial example data if not present and not cleared
    if (!localStorage.getItem('usageTrendReports') && localStorage.getItem('exampleDataCleared') !== 'true') {
        const defaultUsage = [
            {
                date: "10/10/2025, 01:15 PM",
                oilType: "Palm Oil",
                consumption: 80,
                trend: "Stable",
                notes: "Normal usage",
                handler: "System"
            },
            {
                date: "10/09/2025, 03:45 PM",
                oilType: "Coconut Oil",
                consumption: 60,
                trend: "Increasing",
                notes: "High demand",
                handler: "System"
            },
            {
                date: "10/08/2025, 11:20 AM",
                oilType: "Palm Oil",
                consumption: 90,
                trend: "Decreasing",
                notes: "Low usage",
                handler: "System"
            }
        ];
        localStorage.setItem('usageTrendReports', JSON.stringify(defaultUsage));
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

    // Update storage table
    updateStorageMonitoringTable();

    // Update usage trends table
    updateUsageTrends();
    
    // Initialize inventory automation if available
    if (typeof initializeInventoryAutomation === 'function') {
        initializeInventoryAutomation();
    }
});
