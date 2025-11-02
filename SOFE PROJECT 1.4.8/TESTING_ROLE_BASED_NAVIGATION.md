# Testing Guide: Role-Based Navigation System

This guide will help you test the newly implemented employee-only navigation system.

## 🎯 What We're Testing

The system should:
1. **Hide** the Employee tab from non-admin users
2. **Show** the Employee tab to Admin users
3. **Block** non-admin users from accessing Employee.html directly
4. **Display** the correct mode (Admin Mode, Staff Mode, Manager Mode, etc.)

---

## 📋 Testing Steps

### **Step 1: Test as Admin User**

#### 1.1 Log in as Admin
- Open `Login.html` in your browser
- **Username:** `admin123`
- **Password:** `admin123`
- Click "Sign In"

#### 1.2 Verify Admin Access
✅ **Check the sidebar:**
- You should see "Admin Mode" displayed in the sidebar
- The **Employee** tab should be **VISIBLE** in the navigation menu
- All 7 navigation tabs should be visible:
  - Dashboard
  - Inventory
  - Monitoring
  - Invoice
  - **Employee** ← Should be visible
  - Profile Settings
  - Activity Log

#### 1.3 Test Employee Page Access
✅ Click on the **Employee** tab
- You should be able to access the Employee Management page successfully
- No alert or redirect should occur

---

### **Step 2: Create a Test Staff User**

#### 2.1 Create Test Employee Account
- While logged in as Admin, go to the **Employee** tab
- Scroll down to the "Employee Management" section
- Click the **"Add Account"** button
- Fill in the form:
  - **Username:** `staff123`
  - **Password:** `staff123`
  - **Full Name:** `Test Staff User`
  - **Privilege Level:** Select **"Staff"**
- Click **"Submit"**
- You should see a success message: "Account added successfully!"

#### 2.2 Log Out
- Click **"Log Out"** in the sidebar
- Confirm the logout

---

### **Step 3: Test as Staff User (Employee Tab Should Be Hidden)**

#### 3.1 Log in as Staff
- On the login page, enter:
  - **Username:** `staff123`
  - **Password:** `staff123`
- Click "Sign In"

#### 3.2 Verify Staff Access
✅ **Check the sidebar:**
- You should see "Staff Mode" displayed in the sidebar
- The **Employee** tab should be **HIDDEN** from the navigation menu
- Only 6 navigation tabs should be visible:
  - Dashboard
  - Inventory
  - Monitoring
  - Invoice
  - ~~Employee~~ ← Should be hidden
  - Profile Settings
  - Activity Log

#### 3.3 Test Employee Page Block
✅ Try accessing the Employee page directly:
- Type in the address bar: `Employee.html` OR click this link in your bookmarks
- You should see an alert: **"Access Denied: This page is only available for Admin users."**
- You should be automatically redirected to the Dashboard (Main.html)

---

### **Step 4: Test as Manager User**

#### 4.1 Create Test Manager Account
- Log out (if still logged in as staff)
- Log back in as Admin (`admin123` / `admin123`)
- Go to **Employee** tab → **Add Account**
- Fill in:
  - **Username:** `manager123`
  - **Password:** `manager123`
  - **Full Name:** `Test Manager User`
  - **Privilege Level:** Select **"Manager"**
- Click **"Submit"**
- Log out

#### 4.2 Log in as Manager
- Enter credentials:
  - **Username:** `manager123`
  - **Password:** `manager123`
- Click "Sign In"

#### 4.3 Verify Manager Access
✅ **Check the sidebar:**
- You should see "Manager Mode" displayed
- The **Employee** tab should be **HIDDEN**
- Try accessing `Employee.html` directly → Should be blocked with alert

---

### **Step 5: Testing on Different Pages**

#### 5.1 Verify Employee Tab Hidden Across All Pages
- While logged in as Staff or Manager, navigate to each page:
  - Dashboard (Main.html)
  - Inventory
  - Monitoring
  - Invoice
  - Profile Settings
  - Activity Log

✅ **On each page, verify:**
- Employee tab is hidden in the sidebar
- All other functionality works normally

---

## 🎨 Visual Testing Checklist

### Admin View
- [x] "Admin Mode" shown in sidebar
- [x] Employee tab visible in navigation
- [x] Can access Employee Management page
- [x] Can create/view/edit employee accounts

### Staff/Manager View
- [x] "Staff Mode" or "Manager Mode" shown in sidebar
- [x] Employee tab NOT visible in navigation
- [x] Blocked from accessing Employee.html
- [x] All other pages accessible and working

---

## 🐛 Troubleshooting

### Issue: Employee tab still showing for non-admin users
**Solution:** 
1. Clear your browser's localStorage
2. Refresh the page
3. The `manageNavigationByRole()` function should run on page load

### Issue: Can access Employee.html as non-admin without alert
**Solution:**
1. Check that `Employee.js` is properly loaded
2. Verify the access check code is at the start of the `window.addEventListener('load')` function

### Issue: JavaScript errors in console
**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Make sure `responsive.js` is loaded on all pages

---

## ✅ Expected Results Summary

| User Role | Employee Tab Visible? | Can Access Employee.html? | Sidebar Shows |
|-----------|----------------------|---------------------------|---------------|
| **Admin** | ✅ Yes | ✅ Yes | "Admin Mode" |
| **Staff** | ❌ No | ❌ No (blocked) | "Staff Mode" |
| **Manager** | ❌ No | ❌ No (blocked) | "Manager Mode" |

---

## 🎉 Success Criteria

The implementation is working correctly if:
1. ✅ Only Admin users can see the Employee tab
2. ✅ Non-admin users are blocked from accessing Employee.html with an alert
3. ✅ Navigation works correctly on all pages
4. ✅ User mode displays correctly (Admin/Staff/Manager)
5. ✅ All other functionality remains unaffected

---

## 📝 Notes

- The role-based navigation uses **localStorage** to store user privileges
- The system checks `userPrivilege` on every page load
- All HTML pages automatically include `responsive.js` which handles the navigation visibility
- Employee.html has its own access protection as a backup security measure

---

## 🧪 Quick Test Script

If you want to quickly verify localStorage is working:

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage**
3. Check for `userPrivilege` key
4. Verify it shows the correct value: `Admin`, `Staff`, or `Manager`

You can also manually set it:
```javascript
localStorage.setItem('userPrivilege', 'Staff');  // Test as Staff
localStorage.setItem('userPrivilege', 'Manager');  // Test as Manager
localStorage.setItem('userPrivilege', 'Admin');  // Test as Admin
```

Then refresh the page to see the changes take effect.

---

**Happy Testing! 🚀**


