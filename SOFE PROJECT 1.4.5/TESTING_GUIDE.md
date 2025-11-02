# Testing Guide for Automatic Features

## 🎯 Overview
This system has 3 main automatic features that run **AUTOMATICALLY** - no console needed!
1. **Automatic Overdue Invoice Detection** (Invoice page)
2. **Automatic Low Stock Alerts** (Inventory page)
3. **Automatic Inventory Updates** (from Monitoring submissions)

## ⚡ IMPORTANT: Everything Works Automatically!
- ✅ **No need to open console** - features run automatically in the background
- ✅ **Starts when page loads** - automation initializes automatically
- ✅ **Runs on schedule** - checks happen every 15-30 minutes
- ✅ **Updates happen instantly** - when you submit data

**Console is ONLY for:**
- Manual testing (to trigger checks immediately instead of waiting)
- Viewing logs/debugging
- Not required for normal operation!

---

## 1. Testing Automatic Overdue Invoice Detection

### What it does:
- Checks pending invoices every 30 minutes
- Marks invoices as "Overdue" if due date has passed
- Logs activity when an invoice is marked overdue

### How to test:

**Method 1: Create a test invoice with past due date**
1. Go to **Invoice** page
2. Submit a new invoice with:
   - Due Date: Set to **yesterday's date** (or any past date)
   - Status: **Pending**
3. Open browser console (F12 → Console tab)
4. Wait 30 minutes OR manually trigger the check:
   - Type in console: `checkAndUpdateOverdueInvoices()`
   - Press Enter
5. **Expected Result:**
   - Invoice status changes from "Pending" to "Overdue"
   - Activity log shows: "Invoice [ID] marked as overdue"
   - Pending Invoices table shows the updated status

**Method 2: Check existing pending invoices**
1. Go to **Invoice** page
2. Open browser console (F12)
3. Run: `checkAndUpdateOverdueInvoices()`
4. Check if any pending invoices with past due dates are updated

**Check Activity Log:**
- Go to **Activity Log** page
- Look for entries like: "Invoice [ID] marked as overdue - Due date passed"

---

## 2. Testing Automatic Low Stock Alerts

### What it does:
- Checks inventory levels every 15 minutes
- Compares current stock with minimum level
- Creates alerts and logs activity for low stock items

### How to test:

**Method 1: Set up low stock scenario**
1. Go to **Inventory** page
2. Check "Current Inventory" table
3. Find an item (e.g., "Coconut Oil") that has:
   - Current Stock: **300 kg**
   - Minimum Level: **400 kg** (higher than current)
4. Open browser console (F12 → Console tab)
5. Run: `checkLowStockLevels()`
6. **Expected Result:**
   - Activity log shows: "Low stock alert: Coconut Oil - Current: 300 kg, Minimum: 400 kg"
   - Alerts appear in Monitoring page (if configured)

**Method 2: Create test inventory data**
1. Open browser console (F12)
2. Run this command to set test data:
```javascript
const testInventory = [
    {
        oilType: "Test Oil",
        currentStock: 50,
        minimumLevel: 100,
        maximumCapacity: 1000,
        unitPrice: 50,
        status: "Normal",
        conductedBy: "Admin"
    }
];
localStorage.setItem('currentInventory', JSON.stringify(testInventory));
```
3. Go to **Inventory** page
4. Run: `checkLowStockLevels()`
5. Check **Activity Log** for the alert

**Check Activity Log:**
- Go to **Activity Log** page
- Look for entries like: "Low stock alert: [Oil Type] - Current: X kg, Minimum: Y kg"

---

## 3. Testing Automatic Inventory Updates from Monitoring

### What it does:
- When you submit monitoring data with "Stock In" or "Stock Out"
- Automatically updates the Current Inventory table
- Updates status (Normal/Low Stock/Critical)
- Triggers low stock check

### How to test:

**Step 1: Check current inventory**
1. Go to **Inventory** page
2. Note the current stock for "Coconut Oil" (e.g., 300 kg)

**Step 2: Submit monitoring entry**
1. Go to **Monitoring** page
2. Fill out the form:
   - Monitoring Type: **Stock Monitoring**
   - Oil Type: **Coconut Oil**
   - Transaction Type: **Stock In** (or Stock Out)
   - Quantity: **200 kg** (or any amount)
   - Date: Today's date
3. Click **Submit Monitoring**
4. **Expected Result:**
   - Go back to **Inventory** page
   - "Coconut Oil" stock should be updated:
     - If Stock In: 300 + 200 = **500 kg**
     - If Stock Out: 300 - 200 = **100 kg**
   - Status may update if it crosses thresholds

**Step 3: Verify in Activity Log**
1. Go to **Activity Log** page
2. Look for entries like:
   - "Inventory updated: Coconut Oil - Stock In: 200 kg"
   - "Low stock alert: ..." (if stock goes below minimum)

**Step 4: Test with Stock Out that causes low stock**
1. Set inventory to borderline (e.g., 450 kg when minimum is 400 kg)
2. Submit monitoring with Stock Out: 100 kg
3. Expected: Status changes to "Low Stock" and alert is generated

---

## 4. Testing Automatic Stats Updates

### What it does:
- Updates dashboard statistics every 5 minutes
- Recalculates totals, pending payments, etc.

### How to test:

**Method:**
1. Go to **Invoice** page
2. Submit a new invoice
3. Check the stats at the top:
   - Total Invoices
   - Pending Payments
   - Overdue Invoices
4. Wait 5 minutes OR open console and run:
   ```javascript
   autoUpdateStats();
   updateInvoiceStats();
   ```
5. **Expected Result:** Stats are recalculated and updated

---

## 🔍 Quick Testing Commands (Browser Console)

Open browser console (F12) and use these commands:

### Invoice Automation:
```javascript
// Check overdue invoices immediately
checkAndUpdateOverdueInvoices();

// Update stats immediately
autoUpdateStats();
updateInvoiceStats();

// View all invoices
console.log(JSON.parse(localStorage.getItem('invoices')));
```

### Inventory Automation:
```javascript
// Check low stock immediately
checkLowStockLevels();

// View current inventory
console.log(JSON.parse(localStorage.getItem('currentInventory')));

// View monitoring data
console.log(JSON.parse(localStorage.getItem('monitoringData')));
```

### Activity Log:
```javascript
// View all activity logs
console.log(JSON.parse(localStorage.getItem('activityLogs')));
```

---

## ⏱️ Automatic Schedule

- **Overdue Invoice Check:** Every 30 minutes
- **Low Stock Check:** Every 15 minutes  
- **Stats Update:** Every 5 minutes
- **Inventory Update:** Immediately when monitoring is submitted

---

## 📝 Notes

1. **Console Logs:** Open browser console (F12) to see detailed logs of what's happening
2. **Local Storage:** All data is stored in browser's localStorage
3. **Manual Testing:** Use console commands to test without waiting for intervals
4. **Activity Log:** Always check Activity Log page to verify actions are logged
5. **Page Refresh:** Some updates require page refresh to see changes

---

## 🐛 Troubleshooting

**If automatic features don't work:**
1. Check browser console for errors (F12)
2. Verify functions exist: Type function name in console (e.g., `checkLowStockLevels`)
3. Check localStorage has data: `localStorage.getItem('invoices')`
4. Make sure pages are refreshed after data changes
5. Check that scripts are loaded (no 404 errors in Network tab)

---

## ✅ Testing Checklist

- [ ] Created invoice with past due date → marked as overdue
- [ ] Low stock alert generated when stock < minimum level
- [ ] Inventory updated automatically from monitoring submission
- [ ] Stats updated after invoice submission
- [ ] Activity logs showing all automatic actions
- [ ] All features work on page refresh
- [ ] Console shows no errors

