// ==========================
// AI CHATBOT FOR INVENTORY SYSTEM
// ==========================

class InventoryChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.loadChatHistory();
        this.setupEventListeners();
        this.sendWelcomeMessage();
    }

    createChatbotUI() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.innerHTML = `
            <div id="chatbot-toggle" class="chatbot-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="chatbot-badge" id="chatbot-badge" style="display: none;">1</span>
            </div>
            <div id="chatbot-window" class="chatbot-window" style="display: none;">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div class="chatbot-header-text">
                            <h3>Inventory Assistant</h3>
                            <p>AI-powered help</p>
                        </div>
                    </div>
                    <button id="chatbot-close" class="chatbot-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>
                <div class="chatbot-quick-actions" id="chatbot-quick-actions">
                <button class="quick-action-btn" onclick="chatbot.quickAction('inventory')">📦 Inventory</button>
                <button class="quick-action-btn" onclick="chatbot.quickAction('invoices')">📄 Invoices</button>
                <button class="quick-action-btn" onclick="chatbot.quickAction('employees')">👥 Employees</button>
                <button class="quick-action-btn" onclick="chatbot.quickAction('stats')">📊 Statistics</button>
                <button class="quick-action-btn" onclick="chatbot.quickAction('sales')">📈 Sales</button>
                </div>
                <div class="chatbot-input-container">
                    <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ask me anything about your inventory..." />
                    <button id="chatbot-send" class="chatbot-send">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(chatbotContainer);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.toggleChatbot());
        send.addEventListener('click', () => this.handleSendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            const window = document.getElementById('chatbot-window');
            const toggle = document.getElementById('chatbot-toggle');
            if (this.isOpen && !window.contains(e.target) && !toggle.contains(e.target)) {
                // Don't close on outside click - let user explicitly close
            }
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const badge = document.getElementById('chatbot-badge');
        
        if (this.isOpen) {
            window.style.display = 'flex';
            badge.style.display = 'none';
            document.getElementById('chatbot-input').focus();
            this.scrollToBottom();
        } else {
            window.style.display = 'none';
        }
    }

    sendWelcomeMessage() {
        const welcomeMessages = [
            "Hello! I'm your Inventory Assistant. 👋",
            "I can help you with:",
            "• Check inventory levels and stock status",
            "• View invoice information and status",
            "• Get employee attendance details",
            "• Show system statistics and insights",
            "• Analyze best selling oils (week/month/year)",
            "• Answer questions about your data",
            "",
            "Try asking: 'Show me low stock items', 'What are my pending invoices?', or 'What's the best selling oil this month?'"
        ];

        setTimeout(() => {
            welcomeMessages.forEach((msg, index) => {
                setTimeout(() => {
                    this.addMessage('assistant', msg, false);
                }, index * 200);
            });
        }, 500);
    }

    handleSendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message after a short delay (simulate AI processing)
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(message);
            this.addMessage('assistant', response);
        }, 500 + Math.random() * 1000);
    }

    quickAction(action) {
        const actions = {
            'inventory': 'Show me my inventory',
            'invoices': 'What are my pending invoices?',
            'employees': 'Show me employee attendance',
            'stats': 'Show me system statistics',
            'sales': 'What\'s the best selling oil this month?'
        };

        const message = actions[action] || 'Show me my inventory';
        document.getElementById('chatbot-input').value = message;
        this.handleSendMessage();
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Inventory queries
        if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
            return this.handleInventoryQuery(lowerMessage);
        }
        
        // Invoice queries
        if (lowerMessage.includes('invoice') || lowerMessage.includes('payment') || lowerMessage.includes('pending')) {
            return this.handleInvoiceQuery(lowerMessage);
        }
        
        // Employee queries
        if (lowerMessage.includes('employee') || lowerMessage.includes('staff') || lowerMessage.includes('attendance')) {
            return this.handleEmployeeQuery(lowerMessage);
        }
        
        // Statistics queries
        if (lowerMessage.includes('stat') || lowerMessage.includes('summary') || lowerMessage.includes('overview') || lowerMessage.includes('dashboard')) {
            return this.handleStatisticsQuery();
        }
        
        // Activity log queries
        if (lowerMessage.includes('activity') || lowerMessage.includes('log') || lowerMessage.includes('recent')) {
            return this.handleActivityQuery();
        }
        
        // Low stock queries
        if (lowerMessage.includes('low stock') || lowerMessage.includes('out of stock') || lowerMessage.includes('need to order')) {
            return this.handleLowStockQuery();
        }
        
        // Best selling oil queries
        if (lowerMessage.includes('best selling') || lowerMessage.includes('best seller') || lowerMessage.includes('top selling') || 
            lowerMessage.includes('most sold') || lowerMessage.includes('popular') || lowerMessage.includes('sales')) {
            return this.handleBestSellingOilQuery(lowerMessage);
        }
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! How can I help you with your inventory system today?";
        }
        
        // Help
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getHelpMessage();
        }
        
        // Default response
        return this.getDefaultResponse();
    }

    handleInventoryQuery(message) {
        const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
        
        if (inventory.length === 0) {
            return "📦 Your inventory is currently empty. Would you like to add some items?";
        }
        
        // Check for specific oil type
        if (message.includes('coconut')) {
            const coconut = inventory.find(item => item.oilType.toLowerCase().includes('coconut'));
            if (coconut) {
                return this.formatInventoryItem(coconut);
            }
            return "❌ Coconut Oil not found in inventory.";
        }
        
        if (message.includes('palm')) {
            const palm = inventory.find(item => item.oilType.toLowerCase().includes('palm'));
            if (palm) {
                return this.formatInventoryItem(palm);
            }
            return "❌ Palm Oil not found in inventory.";
        }
        
        // Show all inventory
        let response = `📦 **Current Inventory** (${inventory.length} items):\n\n`;
        inventory.forEach(item => {
            const stock = parseFloat(item.currentStock || 0);
            const minLevel = parseFloat(item.minimumLevel || 0);
            const status = stock < minLevel ? '⚠️ Low Stock' : '✅ Normal';
            response += `**${item.oilType}**\n`;
            response += `• Current Stock: ${stock.toFixed(2)} kg\n`;
            response += `• Minimum Level: ${minLevel.toFixed(2)} kg\n`;
            response += `• Status: ${status}\n`;
            response += `• Price: ₱${parseFloat(item.unitPrice || 0).toFixed(2)}\n\n`;
        });
        
        return response;
    }

    handleInvoiceQuery(message) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        
        if (invoices.length === 0) {
            return "📄 No invoices found in the system.";
        }
        
        // Pending invoices
        if (message.includes('pending') || message.includes('unpaid')) {
            const pending = invoices.filter(inv => inv.status === 'Pending');
            if (pending.length === 0) {
                return "✅ Great news! You have no pending invoices.";
            }
            
            let response = `📄 **Pending Invoices** (${pending.length}):\n\n`;
            const totalPending = pending.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            
            pending.slice(0, 5).forEach(inv => {
                response += `• ${inv.invoiceId}: ₱${parseFloat(inv.amount || 0).toFixed(2)} - ${inv.supplier || 'N/A'}\n`;
            });
            
            if (pending.length > 5) {
                response += `\n... and ${pending.length - 5} more\n`;
            }
            
            response += `\n**Total Pending Amount: ₱${totalPending.toFixed(2)}**`;
            return response;
        }
        
        // Overdue invoices
        if (message.includes('overdue')) {
            const overdue = invoices.filter(inv => inv.status === 'Overdue');
            if (overdue.length === 0) {
                return "✅ No overdue invoices!";
            }
            
            let response = `⚠️ **Overdue Invoices** (${overdue.length}):\n\n`;
            const totalOverdue = overdue.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            
            overdue.slice(0, 5).forEach(inv => {
                response += `• ${inv.invoiceId}: ₱${parseFloat(inv.amount || 0).toFixed(2)} - ${inv.supplier || 'N/A'}\n`;
            });
            
            response += `\n**Total Overdue Amount: ₱${totalOverdue.toFixed(2)}**`;
            return response;
        }
        
        // Total invoices
        const total = invoices.length;
        const paid = invoices.filter(inv => inv.status === 'Paid').length;
        const pending = invoices.filter(inv => inv.status === 'Pending').length;
        const overdue = invoices.filter(inv => inv.status === 'Overdue').length;
        const totalRevenue = invoices.filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
        
        return `📄 **Invoice Summary:**\n\n` +
               `• Total Invoices: ${total}\n` +
               `• Paid: ${paid}\n` +
               `• Pending: ${pending}\n` +
               `• Overdue: ${overdue}\n` +
               `• Total Revenue: ₱${totalRevenue.toFixed(2)}`;
    }

    handleEmployeeQuery(message) {
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (attendance.length === 0 && users.length === 0) {
            return "👥 No employee data found.";
        }
        
        // Today's attendance
        if (message.includes('today') || message.includes('present')) {
            const today = new Date().toDateString();
            const todayAttendance = attendance.filter(att => {
                const attDate = new Date(att.checkInDate || att.date || new Date()).toDateString();
                return attDate === today && (att.status === 'Present' || att.status === 'Checked Out');
            });
            
            if (todayAttendance.length === 0) {
                return "👥 No employees checked in today.";
            }
            
            let response = `👥 **Today's Attendance** (${todayAttendance.length} employees):\n\n`;
            todayAttendance.forEach(att => {
                response += `• ${att.name || 'Unknown'}: ${att.status}\n`;
            });
            
            return response;
        }
        
        // Total employees
        const totalEmployees = users.length;
        return `👥 **Employee Summary:**\n\n` +
               `• Total Employees: ${totalEmployees}\n` +
               `• Recent Attendance: ${attendance.length} records\n\n` +
               `Ask me about "today's attendance" for more details.`;
    }

    handleStatisticsQuery() {
        const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Calculate inventory stats
        const totalStock = inventory.reduce((sum, item) => sum + parseFloat(item.currentStock || 0), 0);
        const lowStockItems = inventory.filter(item => {
            const stock = parseFloat(item.currentStock || 0);
            const minLevel = parseFloat(item.minimumLevel || 0);
            return stock < minLevel;
        }).length;
        
        // Calculate invoice stats
        const totalInvoices = invoices.length;
        const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;
        const totalRevenue = invoices.filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
        
        return `📊 **System Statistics:**\n\n` +
               `**Inventory:**\n` +
               `• Total Stock: ${totalStock.toFixed(2)} kg\n` +
               `• Items: ${inventory.length}\n` +
               `• Low Stock Items: ${lowStockItems}\n\n` +
               `**Invoices:**\n` +
               `• Total: ${totalInvoices}\n` +
               `• Pending: ${pendingInvoices}\n` +
               `• Revenue: ₱${totalRevenue.toFixed(2)}\n\n` +
               `**Employees:**\n` +
               `• Total: ${users.length}\n` +
               `• Attendance Records: ${attendance.length}`;
    }

    handleActivityQuery() {
        const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
        
        if (logs.length === 0) {
            return "📋 No activity logs found.";
        }
        
        // Get recent activities
        const recentLogs = logs.slice(-5).reverse();
        
        let response = `📋 **Recent Activities** (last 5):\n\n`;
        recentLogs.forEach(log => {
            response += `• ${log.activity || 'Unknown'}: ${log.details || ''}\n`;
            response += `  _${log.date || 'Unknown date'}_\n\n`;
        });
        
        return response;
    }

    handleLowStockQuery() {
        const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
        const lowStockItems = inventory.filter(item => {
            const stock = parseFloat(item.currentStock || 0);
            const minLevel = parseFloat(item.minimumLevel || 0);
            return stock < minLevel;
        });
        
        if (lowStockItems.length === 0) {
            return "✅ Great! All items are above minimum stock levels.";
        }
        
        let response = `⚠️ **Low Stock Items** (${lowStockItems.length}):\n\n`;
        lowStockItems.forEach(item => {
            const stock = parseFloat(item.currentStock || 0);
            const minLevel = parseFloat(item.minimumLevel || 0);
            const needed = minLevel - stock;
            response += `• **${item.oilType}**\n`;
            response += `  Current: ${stock.toFixed(2)} kg\n`;
            response += `  Minimum: ${minLevel.toFixed(2)} kg\n`;
            response += `  Need to order: ${needed.toFixed(2)} kg\n\n`;
        });
        
        return response;
    }

    handleBestSellingOilQuery(message) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        
        if (invoices.length === 0) {
            return "📊 No sales data available. No invoices found in the system.";
        }
        
        // Filter only Delivery invoices with oil quantities
        const deliveryInvoices = invoices.filter(inv => 
            inv.invoiceType === 'Delivery' && 
            (inv.coconutQuantity || inv.palmQuantity)
        );
        
        if (deliveryInvoices.length === 0) {
            return "📊 No delivery invoices with oil quantities found.";
        }
        
        // Determine time period
        let period = 'all';
        let periodLabel = 'All Time';
        let startDate = null;
        
        if (message.includes('week') || message.includes('this week')) {
            period = 'week';
            periodLabel = 'This Week';
            const now = new Date();
            // Start of week: Monday (day 1). If today is Sunday (day 0), go back 6 days
            const dayOfWeek = now.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            startDate = new Date(now);
            startDate.setDate(now.getDate() - daysToMonday);
            startDate.setHours(0, 0, 0, 0);
        } else if (message.includes('month') || message.includes('this month')) {
            period = 'month';
            periodLabel = 'This Month';
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
        } else if (message.includes('year') || message.includes('this year')) {
            period = 'year';
            periodLabel = 'This Year';
            const now = new Date();
            startDate = new Date(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);
        }
        
        // Filter invoices by date range
        let filteredInvoices = deliveryInvoices;
        if (startDate) {
            filteredInvoices = deliveryInvoices.filter(inv => {
                const invoiceDate = this.parseInvoiceDate(inv.date);
                return invoiceDate && invoiceDate >= startDate;
            });
        }
        
        if (filteredInvoices.length === 0) {
            return `📊 No delivery invoices found for ${periodLabel.toLowerCase()}.`;
        }
        
        // Calculate total quantities sold
        let coconutTotal = 0;
        let palmTotal = 0;
        let coconutRevenue = 0;
        let palmRevenue = 0;
        let coconutCount = 0;
        let palmCount = 0;
        
        filteredInvoices.forEach(inv => {
            // Get oil prices from inventory
            const inventory = JSON.parse(localStorage.getItem('currentInventory')) || [];
            const coconutPrice = inventory.find(item => item.oilType.toLowerCase().includes('coconut'))?.unitPrice || 65;
            const palmPrice = inventory.find(item => item.oilType.toLowerCase().includes('palm'))?.unitPrice || 45;
            
            if (inv.coconutQuantity) {
                const qty = parseFloat(inv.coconutQuantity);
                coconutTotal += qty;
                coconutRevenue += qty * parseFloat(coconutPrice);
                coconutCount++;
            }
            
            if (inv.palmQuantity) {
                const qty = parseFloat(inv.palmQuantity);
                palmTotal += qty;
                palmRevenue += qty * parseFloat(palmPrice);
                palmCount++;
            }
        });
        
        // Determine best seller
        let bestSeller = '';
        let bestQuantity = 0;
        let bestRevenue = 0;
        
        if (coconutTotal > palmTotal) {
            bestSeller = 'Coconut Oil';
            bestQuantity = coconutTotal;
            bestRevenue = coconutRevenue;
        } else if (palmTotal > coconutTotal) {
            bestSeller = 'Palm Oil';
            bestQuantity = palmTotal;
            bestRevenue = palmRevenue;
        } else if (coconutTotal === palmTotal && coconutTotal > 0) {
            bestSeller = 'Tie (Both Equal)';
            bestQuantity = coconutTotal;
            bestRevenue = coconutRevenue + palmRevenue;
        } else {
            return `📊 No sales data available for ${periodLabel.toLowerCase()}.`;
        }
        
        // Format response
        let response = `📊 **Best Selling Oil - ${periodLabel}**\n\n`;
        response += `🏆 **Winner: ${bestSeller}**\n\n`;
        response += `**Sales Summary:**\n\n`;
        response += `**Coconut Oil:**\n`;
        response += `• Quantity Sold: ${coconutTotal.toFixed(2)} kg\n`;
        response += `• Revenue: ₱${coconutRevenue.toFixed(2)}\n`;
        response += `• Number of Sales: ${coconutCount}\n\n`;
        response += `**Palm Oil:**\n`;
        response += `• Quantity Sold: ${palmTotal.toFixed(2)} kg\n`;
        response += `• Revenue: ₱${palmRevenue.toFixed(2)}\n`;
        response += `• Number of Sales: ${palmCount}\n\n`;
        response += `**Total Sales:**\n`;
        response += `• Total Quantity: ${(coconutTotal + palmTotal).toFixed(2)} kg\n`;
        response += `• Total Revenue: ₱${(coconutRevenue + palmRevenue).toFixed(2)}\n`;
        response += `• Total Invoices: ${filteredInvoices.length}\n\n`;
        
        if (bestSeller !== 'Tie (Both Equal)') {
            const percentage = ((bestQuantity / (coconutTotal + palmTotal)) * 100).toFixed(1);
            response += `📈 ${bestSeller} accounts for ${percentage}% of total sales.`;
        }
        
        return response;
    }

    parseInvoiceDate(dateStr) {
        if (!dateStr) return null;
        
        try {
            // Parse date format: "MM/DD/YYYY, HH:MM AM/PM" or "MM/DD/YYYY HH:MM AM/PM"
            let datePart = dateStr;
            if (dateStr.includes(',')) {
                [datePart] = dateStr.split(', ');
            } else if (dateStr.includes(' ')) {
                // Check if it's date and time separated by space
                const parts = dateStr.split(' ');
                if (parts.length >= 3) {
                    datePart = parts[0];
                }
            }
            
            if (!datePart) return null;
            
            const [month, day, year] = datePart.split('/');
            if (!month || !day || !year) return null;
            
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } catch (e) {
            console.error('Error parsing invoice date:', e, dateStr);
            return null;
        }
    }

    formatInventoryItem(item) {
        const stock = parseFloat(item.currentStock || 0);
        const minLevel = parseFloat(item.minimumLevel || 0);
        const status = stock < minLevel ? '⚠️ Low Stock' : '✅ Normal';
        
        return `📦 **${item.oilType}**\n\n` +
               `• Current Stock: ${stock.toFixed(2)} kg\n` +
               `• Minimum Level: ${minLevel.toFixed(2)} kg\n` +
               `• Maximum Capacity: ${parseFloat(item.maximumCapacity || 0).toFixed(2)} kg\n` +
               `• Unit Price: ₱${parseFloat(item.unitPrice || 0).toFixed(2)}\n` +
               `• Status: ${status}`;
    }

    getHelpMessage() {
        return `🤖 **I can help you with:**\n\n` +
               `📦 **Inventory:**\n` +
               `• "Show me my inventory"\n` +
               `• "What's my coconut oil stock?"\n` +
               `• "Show me low stock items"\n\n` +
               `📄 **Invoices:**\n` +
               `• "What are my pending invoices?"\n` +
               `• "Show me overdue invoices"\n` +
               `• "What's my total revenue?"\n\n` +
               `👥 **Employees:**\n` +
               `• "Show me today's attendance"\n` +
               `• "How many employees do I have?"\n\n` +
               `📊 **Statistics:**\n` +
               `• "Show me system statistics"\n` +
               `• "Give me an overview"\n\n` +
               `📈 **Sales Analysis:**\n` +
               `• "What's the best selling oil this week?"\n` +
               `• "Best selling oil this month"\n` +
               `• "Best selling oil this year"\n` +
               `• "Show me sales data"\n\n` +
               `📋 **Activities:**\n` +
               `• "Show me recent activities"\n` +
               `• "What's the latest activity?"`;
    }

    getDefaultResponse() {
        const responses = [
            "I'm not sure I understand. Try asking about inventory, invoices, employees, or statistics.",
            "Could you rephrase that? I can help with inventory, invoices, employees, or system statistics.",
            "I'm here to help with inventory management. Try asking about stock levels, invoices, or employees.",
            "Not sure what you mean. Ask me about your inventory, invoices, employees, or ask for help!"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(sender, text, save = true) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${sender}`;
        
        // Format text (support basic markdown-like formatting)
        const formattedText = this.formatMessage(text);
        
        messageDiv.innerHTML = `
            <div class="chatbot-message-content">
                ${formattedText}
            </div>
            <div class="chatbot-message-time">${this.getCurrentTime()}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        if (save) {
            this.messages.push({ sender, text, time: new Date().toISOString() });
            this.saveChatHistory();
        }
    }

    formatMessage(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/([📦📄👥📊📋⚠️✅❌🤖•])/g, '<span class="emoji">$1</span>');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chatbot-typing';
        typingDiv.className = 'chatbot-message chatbot-message-assistant';
        typingDiv.innerHTML = `
            <div class="chatbot-message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typing = document.getElementById('chatbot-typing');
        if (typing) {
            typing.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    saveChatHistory() {
        // Save last 50 messages
        const recentMessages = this.messages.slice(-50);
        localStorage.setItem('chatbotHistory', JSON.stringify(recentMessages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('chatbotHistory');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
                // Optionally load previous messages (commented out to start fresh each session)
                // this.messages.forEach(msg => {
                //     this.addMessage(msg.sender, msg.text, false);
                // });
            } catch (e) {
                console.error('Error loading chat history:', e);
            }
        }
    }
}

// Initialize chatbot when page loads
let chatbot;
window.addEventListener('load', () => {
    chatbot = new InventoryChatbot();
});

