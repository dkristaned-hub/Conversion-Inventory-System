# Database Setup Manual - Conversion Inventory System

This manual provides step-by-step instructions for setting up the PHP/MySQL backend for the Conversion Inventory System.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Migration Guide](#migration-guide)

## Prerequisites

Before proceeding, ensure you have the following installed:

### Required Software

1. **Web Server Environment**
   - XAMPP (recommended for Windows): [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - WAMP (alternative for Windows): [https://www.wampserver.com/en/](https://www.wampserver.com/en/)
   - MAMP (for macOS): [https://www.mamp.info/en/](https://www.mamp.info/en/)
   - LAMP (for Linux): Install via package manager (e.g., `sudo apt install apache2 mysql-server php`)

2. **PHP Version**
   - PHP 7.4 or higher
   - With MySQLi extension enabled

3. **MySQL Database**
   - MySQL 5.7 or higher
   - MariaDB 10.0 or higher

4. **Web Browser**
   - Chrome, Firefox, Safari, or Edge (latest versions)

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, Linux (Ubuntu/CentOS)
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Disk Space**: 500MB free space
- **Network**: Internet connection for initial setup

## Installation

### Step 1: Download and Install XAMPP

1. Visit [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Download XAMPP for your operating system
3. Run the installer and follow the setup wizard
4. Choose components to install:
   - Apache
   - MySQL
   - PHP
   - phpMyAdmin (optional but recommended)

### Step 2: Start XAMPP Services

1. Open XAMPP Control Panel
2. Start the following services:
   - Apache (web server)
   - MySQL (database server)
3. Verify services are running (green status indicators)

### Step 3: Project Setup

1. Copy **ALL project files** to your web server directory:
   - **XAMPP**: `C:\xampp\htdocs\conversion_inventory`
   - **WAMP**: `C:\wamp\www\conversion_inventory`
   - **Manual**: Your web server's document root

   **Required Files to Copy:**
   - All PHP files: `config.php`, `database_setup.php`, `auth.php`, `api.php`, `login.php`, `db_status.php`
   - All HTML files: `Main.html`, `Employee.html`, `Inventory.html`, etc.
   - All JavaScript files: `Employee.js`, `Inventory.js`, etc.
   - All CSS files: `Employee.css`, `Inventory.css`, etc.
   - Documentation: `README.md`, `SETUP_MANUAL.md`

2. Ensure all PHP files have proper permissions (readable by web server)

## Configuration

### Step 1: Database Configuration

1. Open `config.php` in your project directory
2. Update the database connection settings:

   **For XAMPP (default installation):**
   ```php
   $servername = "localhost";        // Usually 'localhost'
   $username = "root";               // Default MySQL username for XAMPP
   $password = "";                   // Default is empty for XAMPP
   $dbname = "conversion_inventory_system";  // Database name
   ```

   **For WAMP or custom installations:**
   ```php
   $servername = "localhost";        // Usually 'localhost'
   $username = "root";               // Default MySQL username
   $password = "";                   // Default is empty, change if set
   $dbname = "conversion_inventory_system";  // Database name
   ```

   **Troubleshooting Database Connection Errors:**
   - If you get "Access denied for user 'root'@'localhost'", ensure MySQL service is running
   - For XAMPP, the default root password is empty (blank)
   - If you've set a password for root, update the `$password` variable accordingly
   - You can create a dedicated database user in phpMyAdmin if preferred

**Note**: For security, change the default MySQL root password in production and consider creating a dedicated database user with limited privileges.

### Step 2: Verify PHP Configuration

1. Create a test file `phpinfo.php` in your project directory:
   - Open a text editor (e.g., Notepad, VS Code)
   - Copy and paste the following code into a new file:

   ```php
   <?php
   phpinfo();
   ?>
   ```

   - Save the file as `phpinfo.php` in your project root directory (e.g., `C:\xampp\htdocs\conversion_inventory\phpinfo.php`)

2. Access the file in your web browser:
   - Open your web browser
   - Navigate to: `http://localhost/conversion_inventory/phpinfo.php`
   - You should see a detailed PHP configuration page

   **Troubleshooting**: If you get a "Not Found" error:
   - Ensure Apache service is running in XAMPP/WAMP control panel
   - Verify the project files are in the correct web server directory (e.g., `C:\xampp\htdocs\conversion_inventory`)
   - Replace `conversion_inventory` in the URL with your actual project folder name if different
   - Check that the file was saved as `phpinfo.php` (not `phpinfo.php.txt`)

3. Verify the following requirements:
   - **PHP Version**: Should be 7.4 or higher (check the "PHP Version" section at the top)
   - **MySQLi Extension**: Look for "mysqli" in the "Loaded Extensions" section (it should be listed)
   - **Session Support**: Look for "session" in the "Loaded Extensions" section (it should be enabled)

4. **Important Security Note**: Delete `phpinfo.php` immediately after verification. This file exposes sensitive server information and poses a security risk if left accessible.
   - Right-click the file in your file explorer and delete it, or use your text editor to delete it.
   - If you encounter any issues accessing the file, ensure Apache and MySQL services are running in XAMPP/WAMP control panel.

## Database Setup

### Method 1: Automated Setup (Recommended)

1. Open your web browser
2. Navigate to: `http://localhost/conversion_inventory_system/database_setup.php`
3. The script will:
   - Create the database if it doesn't exist
   - Create all required tables
   - Insert default admin user
   - Display setup progress

4. Check for success messages
5. Access the status checker: `http://localhost/conversion_inventory_system/db_status.php`

### Method 2: Manual Setup via phpMyAdmin

1. **Access phpMyAdmin**:
   - Open your web browser
   - Navigate to: `http://localhost/phpmyadmin`
   - Login with your MySQL credentials (default: username `root`, password empty for XAMPP)

2. **Viewing the Database**:
   - Once logged in, you'll see the phpMyAdmin dashboard
   - Click on your database name `conversion_inventory_system` in the left sidebar to view tables
   - You can browse tables, view data, run queries, and manage the database structure

3. **Manual Database Creation**:
   - If the database doesn't exist, click "New" in the left sidebar
   - Enter database name: `conversion_inventory_system`
   - Click "Create"
   - Then create tables manually or import SQL files if available

**Note**: phpMyAdmin provides a web-based interface to manage MySQL databases. You can view tables, run queries, export/import data, and perform administrative tasks.

### Default Admin Account

After setup, you can login with:
- **Username**: `admin123`
- **Password**: `admin123`

**Important**: Change the default password immediately after first login!

## Testing

### Step 1: Database Connection Test

1. Visit: `http://localhost/conversion_inventory/db_status.php`
2. Verify:
   - Database connection shows "Connected"
   - All tables show "Exists" status
   - Record counts are displayed

#### Using the Database Status Checker

The Database Status Checker (`db_status.php`) provides real-time monitoring of your system's database health and statistics.

**Features:**
- **Connection Status**: Shows if database is connected and accessible
- **Table Status**: Lists all required tables with existence and record counts
- **System Statistics**: Displays total users, employees, attendance records, inventory items, and pending invoices
- **Auto-refresh**: Updates every 30 seconds automatically
- **Manual Refresh**: Click "Refresh Status" button for immediate update

**Color Coding:**
- 🟢 **Green/Success**: Everything working properly
- 🔴 **Red/Error**: Issues that need attention
- 🟡 **Yellow/Warning**: Potential issues or incomplete setup

**Navigation Links:**
- **Run Database Setup**: Takes you to `database_setup.php` to initialize/reset database
- **Go to Login**: Direct link to login page
- **Dashboard**: Access the main application

**Common Status Messages:**
- **"Connected"**: Database connection successful
- **"Table Exists"**: Required table is present with record count
- **"Table Missing"**: Critical table not found - run database setup
- **"Failed"**: Database connection issues - check credentials and MySQL service

### Step 2: Login Test

1. Visit: `http://localhost/conversion_inventory/login.php`
2. Login with default credentials
3. Verify successful login and redirection

### Step 3: API Test

1. Test API endpoints using browser or tools like Postman:

```bash
# Test login API
curl -X POST http://localhost/conversion_inventory/api.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin123","password":"admin123"}'
```

### Step 4: Full System Test

1. Login to the system
2. Test all major functions:
   - User management (Admin only)
   - Employee registration
   - Attendance recording
   - Inventory management
   - Invoice creation

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Failed

**Error**: "Connection failed: Access denied for user 'root'@'localhost'" or "Access denied for user 'admin123'@'localhost'"

**Solutions**:
- **For XAMPP users**: Update `config.php` with:
  ```php
  $username = "root";
  $password = "";  // Empty password is default
  ```
- **For WAMP users**: Check if root password is set in MySQL. If set, update `$password` in `config.php`
- Ensure MySQL service is running in XAMPP/WAMP control panel
- If you've changed the MySQL root password, update it in `config.php`
- Create a dedicated database user in phpMyAdmin with proper privileges if preferred

#### 2. Tables Not Created

**Error**: Tables show "Missing" in status checker

**Solutions**:
- Check database user permissions
- Run `database_setup.php` again
- Manually create tables using phpMyAdmin

#### 3. PHP Errors

**Error**: "Fatal error: Uncaught mysqli_sql_exception"

**Solutions**:
- Enable MySQLi extension in `php.ini`
- Check PHP error logs
- Verify PHP version compatibility

#### 4. Permission Errors

**Error**: "Permission denied" when accessing files

**Solutions**:
- Set proper file permissions (755 for directories, 644 for files)
- Ensure web server user has access to project directory

#### 5. Session Issues

**Error**: Cannot login or sessions not working

**Solutions**:
- Check if `session.save_path` is writable
- Clear browser cookies/cache
- Verify PHP session configuration

### Debug Mode

Enable debug mode by adding to `config.php`:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Log Files

Check these locations for error logs:
- **XAMPP**: `C:\xampp\apache\logs\error.log`
- **PHP**: `C:\xampp\php\logs\php_error_log`
- **MySQL**: `C:\xampp\mysql\data\mysql_error.log`

## Migration Guide

### From localStorage to Database

If you have existing data in localStorage, follow these steps:

1. **Export localStorage Data**
   ```javascript
   // Run in browser console on your existing system
   console.log(JSON.stringify(localStorage));
   ```

2. **Import Data via API**
   - Use the API endpoints to recreate users, inventory, etc.
   - Or create custom import scripts

3. **Update JavaScript Files**
   - Replace localStorage calls with API calls
   - Example:
     ```javascript
     // Old
     localStorage.setItem('users', JSON.stringify(users));

     // New
     fetch('api.php?action=register', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(userData)
     });
     ```

### Backup Strategy

1. **Regular Backups**
   - Use phpMyAdmin export feature
   - Create automated backup scripts
   - Store backups in secure locations

2. **Data Export**
   ```sql
mysqldump -u root -p conversion_inventory_system > backup.sql
```

3. **Data Import**
   ```sql
   mysql -u root -p conversion_inventory_system < backup.sql
   ```

## Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Update database credentials
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall
- [ ] Set proper file permissions
- [ ] Disable debug mode
- [ ] Regular security updates
- [ ] Backup procedures in place

## Support

If you encounter issues:

1. Check this manual first
2. Review error logs
3. Test with the status checker
4. Verify all prerequisites
5. Check community forums or documentation

## Quick Reference

### URLs
- **Status Checker**: `http://localhost/conversion_inventory/db_status.php`
- **Database Setup**: `http://localhost/conversion_inventory/database_setup.php`
- **Login Page**: `http://localhost/conversion_inventory/login.php`
- **Dashboard**: `http://localhost/conversion_inventory/Main.html`

### Default Credentials
- **Username**: admin123
- **Password**: admin123

### File Locations
- **Project Root**: `C:\xampp\htdocs\conversion_inventory\`
- **Config File**: `config.php`
- **Database Setup**: `database_setup.php`
- **Status Checker**: `db_status.php`

---

**Last Updated**: December 2024
**Version**: 1.0
