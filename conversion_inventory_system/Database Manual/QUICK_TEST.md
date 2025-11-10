# 🚀 Quick 5-Minute Test

## Test the Role-Based Navigation in 3 Simple Steps

### Step 1: Login as Admin (2 minutes)
1. Open `Login.html` in your browser
2. Login with:
   - Username: `admin123`
   - Password: `admin123`
3. ✅ **Check:** Employee tab should be **VISIBLE** in sidebar
4. ✅ **Check:** Sidebar should say "Admin Mode"

### Step 2: Create a Test Staff User (2 minutes)
1. Click on the **Employee** tab
2. Scroll down to "Employee Management"
3. Click **"Add Account"**
4. Fill in:
   - Username: `teststaff`
   - Password: `teststaff`
   - Full Name: `Test Staff`
   - Privilege: **Staff**
5. Click **Submit**
6. Click **Log Out**

### Step 3: Login as Staff & Verify Hidden Tab (1 minute)
1. Login with:
   - Username: `teststaff`
   - Password: `teststaff`
2. ✅ **Check:** Employee tab should be **HIDDEN**
3. ✅ **Check:** Sidebar should say "Staff Mode"
4. Try going to `Employee.html` directly
5. ✅ **Check:** Should show alert "Access Denied" and redirect

---

## 🎯 That's It!

**Working correctly?** ✅
- Admin sees Employee tab
- Staff/Manager don't see Employee tab
- Direct access blocked for non-admins

**Not working?** 
- Check browser console (F12) for errors
- Make sure you're logged out between tests
- Clear localStorage if needed


