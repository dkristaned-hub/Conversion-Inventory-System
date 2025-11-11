# Testing User Permissions

## Overview

This guide helps you test that the system correctly shows different menus and access levels based on user roles.

## Test Scenarios

### Admin User Access
1. Login with admin account (admin123/admin123)
2. Verify: "Admin Mode" appears in sidebar
3. Verify: Employee tab is visible in navigation menu
4. Verify: Can click Employee tab and access the page

### Staff User Access
1. Create a staff user account (as admin)
2. Logout and login as the staff user
3. Verify: "Staff Mode" appears in sidebar
4. Verify: Employee tab is NOT visible in navigation menu
5. Verify: Trying to access Employee.html directly shows "Access Denied" and redirects

### Manager User Access
1. Create a manager user account (as admin)
2. Logout and login as the manager user
3. Verify: "Manager Mode" appears in sidebar
4. Verify: Employee tab is NOT visible in navigation menu
5. Verify: Trying to access Employee.html directly shows "Access Denied" and redirects

## Expected Behavior Table

| User Role | Employee Tab Visible | Can Access Employee Page | Sidebar Display |
|-----------|---------------------|--------------------------|-----------------|
| Admin    | ✅ Yes             | ✅ Yes                  | "Admin Mode"   |
| Staff    | ❌ No              | ❌ No (blocked)         | "Staff Mode"   |
| Manager  | ❌ No              | ❌ No (blocked)         | "Manager Mode" |

## Testing Tips

- Always logout completely between user tests
- Clear browser cache if you see unexpected behavior
- Check browser console (F12) for any JavaScript errors
- The system should automatically redirect unauthorized users

The permission system is working correctly when only administrators can access employee management features.


