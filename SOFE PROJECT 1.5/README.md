# Conversion Inventory System - PHP Database Version

This is a PHP/MySQL version of the Conversion Inventory System that replaces the localStorage-based system with a proper database backend.

## Features

- User authentication and authorization (Admin/Staff roles)
- Employee management with attendance tracking
- Inventory management with monitoring
- Invoice management
- Activity logging
- Profile management

## Setup Instructions

### 1. Database Setup

1. Make sure you have XAMPP, WAMP, or a similar PHP development environment installed
2. Start Apache and MySQL services
3. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
4. Create a database named `conversion_inventory_system` (or update the database name in `config.php`)

### 2. Configuration

1. Update `config.php` with your database credentials:
   ```php
   $servername = "localhost";
   $username = "your_db_username"; // Usually 'root' for local development
   $password = "your_db_password"; // Usually empty for local development
   $dbname = "conversion_inventory_system";
   ```

### 3. Database Initialization

1. Open your browser and go to: `http://localhost/your-project-folder/database_setup.php`
2. This will create all necessary tables and insert default admin user

### 4. Default Login

- **Username:** admin123
- **Password:** admin123

## File Structure

```
/
├── config.php              # Database configuration
├── database_setup.php      # Database initialization script
├── auth.php                # Authentication class
├── api.php                 # API endpoints
├── login.php               # Login page (PHP version)
├── Login.html              # Original HTML login page
├── Main.html               # Dashboard
├── Employee.html           # Employee management
├── Inventory.html          # Inventory management
├── Monitoring.html         # Monitoring page
├── Invoice.html            # Invoice management
├── Profile.html            # Profile settings
├── Activitylog.html        # Activity logs
├── *.css                   # Stylesheets
├── *.js                    # JavaScript files
└── README.md               # This file
```

## API Endpoints

The system provides RESTful API endpoints in `api.php`:

- `GET /api.php?action=login` - User login
- `POST /api.php?action=logout` - User logout
- `POST /api.php?action=register` - Register new user (Admin only)
- `GET /api.php?action=get_users` - Get all users (Admin only)
- `GET /api.php?action=get_employee_log` - Get employee logs
- `GET /api.php?action=get_attendance` - Get attendance records
- `POST /api.php?action=record_attendance` - Record attendance
- `POST /api.php?action=checkout` - Record checkout
- `GET /api.php?action=get_inventory` - Get inventory
- `POST /api.php?action=update_inventory` - Update inventory
- `GET /api.php?action=get_activity_logs` - Get activity logs
- `GET /api.php?action=get_current_user` - Get current user info

## Migration from localStorage

The original HTML/JavaScript files can still be used, but for full functionality with persistent data storage, use the PHP backend.

To migrate existing localStorage data:

1. Export data from localStorage in the browser console
2. Use the API endpoints to import data into the database
3. Update JavaScript files to use API calls instead of localStorage

## Security Notes

- Passwords are hashed using PHP's `password_hash()` function
- Session-based authentication
- Input validation and prepared statements to prevent SQL injection
- Activity logging for audit trails

## Development

To extend the system:

1. Add new API endpoints in `api.php`
2. Create new database tables in `database_setup.php`
3. Update the Auth class in `auth.php` for additional authentication features
4. Modify HTML/JS files to use the new API endpoints

## Troubleshooting

1. **Database connection errors**: Check your database credentials in `config.php`
2. **Permission errors**: Make sure the web server has write permissions to the project directory
3. **Session issues**: Ensure PHP sessions are properly configured
4. **API errors**: Check the browser's developer console for detailed error messages

## License

This project is for educational purposes. Modify and distribute as needed.
