# Database Setup Guide

## What You Need

- Windows computer
- Internet connection
- About 500MB free space

## Step-by-Step Setup

### Step 1: Download and Install XAMPP

1. Open your web browser
2. Go to: https://www.apachefriends.org/
3. Click "Download" (for Windows)
4. Run the downloaded file
5. Follow the installation steps
6. When asked what to install, make sure these are checked:
   - Apache (web server)
   - MySQL (database)
   - PHP (programming language)

### Step 2: Start the Services

1. Find XAMPP on your computer and open it
2. Click "Start" next to Apache
3. Click "Start" next to MySQL
4. You should see green lights next to both services

### Step 3: Put the System Files in Place

1. Find the folder where you downloaded this system
2. Copy the entire folder
3. Go to: `C:\xampp\htdocs\`
4. Paste the folder there
5. Rename the folder to something simple like "inventory"

### Step 4: Set Up the Database

1. Open your web browser
2. Go to: `http://localhost/inventory/database_setup.php`
3. The system will automatically create the database and all tables
4. You should see success messages on the page

### Step 5: Check the Database (Optional)

1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. Login with username "root" and no password
4. You should see the "conversion_inventory_system" database
5. Click on it to see all the tables that were created

### Step 6: Login to the System

1. Go to: `http://localhost/inventory/Login.html`
2. Login with:
   - Username: `admin123`
   - Password: `admin123`

### Step 7: Change Default Password

1. After logging in, go to Profile Settings
2. Change the password from `admin123` to something secure

## If Something Goes Wrong

### Can't Access the System?
- Make sure XAMPP is running (green lights for Apache and MySQL)
- Check that the folder is in `C:\xampp\htdocs\`
- Try: `http://localhost/inventory/Login.html`

### Can't Login?
- Username: `admin123`
- Password: `admin123`
- Make sure you typed it correctly

### Database Not Working?
- Go to: `http://localhost/inventory/database_setup.php`
- Run the setup again
- Check that MySQL is running in XAMPP

### Need More Help?
- Check the status page: `http://localhost/inventory/db_status.php`
- This shows if everything is working


