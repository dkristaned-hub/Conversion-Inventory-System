# System Testing Guide

## Automatic Features

The system runs several automatic tasks in the background:

- **Invoice Overdue Check**: Every 30 minutes, checks for invoices past their due date and marks them as "Overdue"
- **Low Stock Alerts**: Every 15 minutes, checks inventory levels and creates alerts for items below minimum stock
- **Inventory Updates**: Updates stock levels when monitoring data is submitted
- **Dashboard Stats**: Updates statistics every 5 minutes

## Manual Testing Steps

### Test Invoice Overdue System
1. Go to the Invoice page
2. Create a new invoice with a due date that is already past
3. Check the Activity Log page after 30 minutes (or refresh the page)
4. You should see an entry about the invoice being marked as overdue

### Test Low Stock Alerts
1. Go to the Inventory page
2. Find an item where the current stock is below the minimum level
3. Check the Activity Log page
4. You should see alerts about low stock items

### Test Inventory Updates
1. Go to the Monitoring page
2. Submit a new stock in/out entry
3. Go back to the Inventory page
4. The stock numbers should be updated automatically

### Test Dashboard Statistics
1. Create a new invoice or employee
2. Wait 5 minutes or refresh the Dashboard page
3. The statistics should show the updated numbers

## Expected Results

When everything is working correctly, you should see:

- Invoices automatically marked as "Overdue" when past due
- Activity log entries for all automatic system actions
- Inventory levels updating when you submit monitoring data
- Dashboard statistics showing current totals

The system handles these tasks automatically in the background.

