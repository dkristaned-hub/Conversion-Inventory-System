# 🤖 AI Chatbot Guide

## Overview
The AI Chatbot is an intelligent assistant integrated into your Inventory System that helps you quickly access information about inventory, invoices, employees, and system statistics.

## Features

### ✅ What the Chatbot Can Do

1. **Inventory Queries**
   - Check current stock levels
   - View inventory by oil type (Coconut/Palm)
   - Identify low stock items
   - Show inventory statistics

2. **Invoice Management**
   - View pending invoices
   - Check overdue invoices
   - Show invoice statistics
   - Calculate total revenue

3. **Employee Information**
   - View today's attendance
   - Check employee count
   - Show attendance records

4. **System Statistics**
   - Overall system overview
   - Inventory statistics
   - Invoice statistics
   - Employee statistics

5. **Activity Logs**
   - View recent activities
   - Check system activity history

6. **Sales Analysis**
   - Best selling oil by period (week/month/year)
   - Sales statistics and revenue analysis
   - Quantity sold comparisons
   - Sales performance insights

## How to Use

### Opening the Chatbot
1. Look for the blue chat icon in the bottom-right corner of any page
2. Click the icon to open the chatbot window
3. The chatbot will greet you with a welcome message

### Asking Questions

#### Natural Language Queries
You can ask questions in plain English:

**Inventory:**
- "Show me my inventory"
- "What's my coconut oil stock?"
- "Show me low stock items"
- "What's my palm oil inventory?"

**Invoices:**
- "What are my pending invoices?"
- "Show me overdue invoices"
- "What's my total revenue?"
- "How many invoices do I have?"

**Employees:**
- "Show me today's attendance"
- "How many employees do I have?"
- "Who's checked in today?"

**Statistics:**
- "Show me system statistics"
- "Give me an overview"
- "What's my dashboard summary?"

**Activities:**
- "Show me recent activities"
- "What's the latest activity?"
- "Show me activity logs"

**Sales Analysis:**
- "What's the best selling oil this week?"
- "Best selling oil this month"
- "Best selling oil this year"
- "Show me sales data"
- "What's the most popular oil?"
- "Which oil sells more?"

### Quick Actions
Use the quick action buttons at the bottom of the chatbot:
- **📦 Inventory** - Quick inventory overview
- **📄 Invoices** - View pending invoices
- **👥 Employees** - Check attendance
- **📊 Statistics** - System statistics

### Tips for Best Results

1. **Be Specific**: The more specific your question, the better the response
   - ✅ Good: "Show me low stock items"
   - ❌ Vague: "Stock"

2. **Use Keywords**: Include relevant keywords in your questions
   - Inventory, Stock, Invoices, Employees, Statistics

3. **Try Variations**: If one question doesn't work, try rephrasing
   - "What are my pending invoices?"
   - "Show me unpaid invoices"
   - "List pending invoices"

## Example Conversations

### Example 1: Checking Inventory
**You:** "Show me my inventory"
**Chatbot:** 
```
📦 Current Inventory (2 items):

**Coconut Oil**
• Current Stock: 300.00 kg
• Minimum Level: 400.00 kg
• Status: ⚠️ Low Stock
• Price: ₱65.00

**Palm Oil**
• Current Stock: 1700.00 kg
• Minimum Level: 600.00 kg
• Status: ✅ Normal
• Price: ₱45.00
```

### Example 2: Checking Invoices
**You:** "What are my pending invoices?"
**Chatbot:**
```
📄 Pending Invoices (3):

• INV-20250115-001: ₱5000.00 - Customer A
• INV-20250115-002: ₱3000.00 - Customer B
• INV-20250115-003: ₱2000.00 - Customer C

Total Pending Amount: ₱10000.00
```

### Example 3: System Statistics
**You:** "Show me system statistics"
**Chatbot:**
```
📊 System Statistics:

Inventory:
• Total Stock: 2000.00 kg
• Items: 2
• Low Stock Items: 1

Invoices:
• Total: 10
• Pending: 3
• Revenue: ₱50000.00

Employees:
• Total: 5
• Attendance Records: 50
```

### Example 4: Best Selling Oil
**You:** "What's the best selling oil this month?"
**Chatbot:**
```
📊 Best Selling Oil - This Month

🏆 Winner: Coconut Oil

Sales Summary:

Coconut Oil:
• Quantity Sold: 1500.00 kg
• Revenue: ₱97500.00
• Number of Sales: 25

Palm Oil:
• Quantity Sold: 800.00 kg
• Revenue: ₱36000.00
• Number of Sales: 15

Total Sales:
• Total Quantity: 2300.00 kg
• Total Revenue: ₱133500.00
• Total Invoices: 40

📈 Coconut Oil accounts for 65.2% of total sales.
```

## Available on Pages

The chatbot is available on all main pages:
- ✅ Dashboard (Main.html)
- ✅ Inventory (Inventory.html)
- ✅ Invoice (Invoice.html)
- ✅ Profile (Profile.html)
- ✅ Employee (Employee.html)
- ✅ Activity Log (Activitylog.html)

## Technical Details

### Data Sources
The chatbot reads data from localStorage:
- `currentInventory` - Inventory items
- `invoices` - Invoice records
- `attendance` - Employee attendance
- `users` - Employee/users list
- `activityLogs` - Activity logs

### Chat History
- Chat history is saved in localStorage as `chatbotHistory`
- Last 50 messages are saved
- History persists across sessions (optional feature)

## Troubleshooting

### Chatbot Not Appearing
1. Check if `Chatbot.css` and `Chatbot.js` are included in the page
2. Check browser console for JavaScript errors
3. Make sure localStorage is enabled in your browser

### No Data Showing
1. Make sure you have data in localStorage
2. Check if data keys match expected format:
   - `currentInventory` should be an array
   - `invoices` should be an array
   - `attendance` should be an array

### Chatbot Not Responding
1. Check browser console for errors
2. Make sure `Chatbot.js` is loaded after other scripts
3. Try refreshing the page

## Future Enhancements

Potential future features:
- Voice input support
- Advanced natural language processing
- Predictive analytics
- Automated alerts and notifications
- Integration with external AI services
- Multi-language support
- Customizable responses
- Learning from user interactions

## Support

If you encounter any issues or have suggestions for improvement:
1. Check the browser console for errors
2. Verify that all required files are present
3. Make sure data is properly formatted in localStorage
4. Try clearing browser cache and reloading

## Privacy & Security

- All data processing happens locally in your browser
- No data is sent to external servers
- Chat history is stored locally in your browser
- You can clear chat history by clearing localStorage

---

**Enjoy using your AI Chatbot Assistant! 🤖**

