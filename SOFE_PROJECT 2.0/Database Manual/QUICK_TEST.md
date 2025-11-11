# Quick Test Guide

## Test Role-Based Access in 5 Minutes

### Step 1: Login as Admin
1. Open your browser to: `http://localhost/inventory/Login.html`
2. Login with:
   - Username: `admin123`
   - Password: `admin123`
3. Check: You should see "Admin Mode" in the sidebar
4. Check: The "Employee" tab should be visible

### Step 2: Create a Staff User
1. Click on the "Employee" tab
2. Scroll down to "Employee Management" section
3. Click the "Add Account" button
4. Fill in the form:
   - Username: `teststaff`
   - Password: `teststaff`
   - Full Name: `Test Staff`
   - Privilege Level: `Staff`
5. Click "Submit"
6. Click "Log Out" in the sidebar

### Step 3: Login as Staff
1. Login again with:
   - Username: `teststaff`
   - Password: `teststaff`
2. Check: You should see "Staff Mode" in the sidebar
3. Check: The "Employee" tab should NOT be visible
4. Try to go directly to the Employee page by typing the URL
5. Check: You should get an "Access Denied" message and be redirected

---

## Results

**If everything works:**
- Admin can see and access the Employee tab
- Staff cannot see the Employee tab
- Staff cannot access the Employee page directly

**If something doesn't work:**
- Check the browser console (press F12) for error messages
- Make sure you logged out completely between tests
- Try clearing your browser data if needed


