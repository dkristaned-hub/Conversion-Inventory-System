<?php
include 'config.php';

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS conversion_inventory_system";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists.<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select the database
$conn->select_db($dbname);

// Create users table
$users_table = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    privilege ENUM('Admin', 'Staff') NOT NULL,
    email VARCHAR(100),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($users_table) === TRUE) {
    echo "Users table created successfully.<br>";
} else {
    echo "Error creating users table: " . $conn->error . "<br>";
}

// Create employee_log table
$employee_log_table = "CREATE TABLE IF NOT EXISTS employee_log (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position ENUM('Admin', 'Staff') NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($employee_log_table) === TRUE) {
    echo "Employee log table created successfully.<br>";
} else {
    echo "Error creating employee log table: " . $conn->error . "<br>";
}

// Create employee_shifts table
$employee_shifts_table = "CREATE TABLE IF NOT EXISTS employee_shifts (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    shift_date DATE NOT NULL,
    shift_start_time TIME NOT NULL,
    shift_end_time TIME NOT NULL,
    shift_type ENUM('Morning', 'Afternoon', 'Night', 'Overtime') DEFAULT 'Morning',
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    assigned_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee_log(employee_id) ON DELETE CASCADE
)";

if ($conn->query($employee_shifts_table) === TRUE) {
    echo "Employee shifts table created successfully.<br>";
} else {
    echo "Error creating employee shifts table: " . $conn->error . "<br>";
}

// Create employee_management table
$employee_management_table = "CREATE TABLE IF NOT EXISTS employee_management (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    position ENUM('Admin', 'Staff') NOT NULL,
    privilege ENUM('Admin', 'Staff') NOT NULL,
    password VARCHAR(255),
    email VARCHAR(100),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($employee_management_table) === TRUE) {
    echo "Employee management table created successfully.<br>";
} else {
    echo "Error creating employee management table: " . $conn->error . "<br>";
}

// Create attendance table
$attendance_table = "CREATE TABLE IF NOT EXISTS attendance (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    check_in_date DATE NOT NULL,
    check_in_time TIME,
    check_out_date DATE,
    check_out_time TIME,
    status ENUM('Present', 'Checked Out') DEFAULT 'Present',
    handler VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee_log(employee_id) ON DELETE CASCADE
)";

if ($conn->query($attendance_table) === TRUE) {
    echo "Attendance table created successfully.<br>";
} else {
    echo "Error creating attendance table: " . $conn->error . "<br>";
}

// Create inventory table
$inventory_table = "CREATE TABLE IF NOT EXISTS inventory (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT(11) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    min_stock INT(11) NOT NULL DEFAULT 0,
    supplier VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
)";

if ($conn->query($inventory_table) === TRUE) {
    echo "Inventory table created successfully.<br>";
} else {
    echo "Error creating inventory table: " . $conn->error . "<br>";
}

// Create monitoring table
$monitoring_table = "CREATE TABLE IF NOT EXISTS monitoring (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity_before INT(11) NOT NULL,
    quantity_after INT(11) NOT NULL,
    change_type ENUM('Addition', 'Reduction', 'Conversion') NOT NULL,
    reason TEXT,
    conducted_by VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($monitoring_table) === TRUE) {
    echo "Monitoring table created successfully.<br>";
} else {
    echo "Error creating monitoring table: " . $conn->error . "<br>";
}

// Create pending_invoices table
$pending_invoices_table = "CREATE TABLE IF NOT EXISTS pending_invoices (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(50) UNIQUE NOT NULL,
    date_time DATETIME NOT NULL,
    supplier_customer VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Overdue', 'Paid') DEFAULT 'Pending',
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($pending_invoices_table) === TRUE) {
    echo "Pending invoices table created successfully.<br>";
} else {
    echo "Error creating pending invoices table: " . $conn->error . "<br>";
}

// Create delivery_invoices table
$delivery_invoices_table = "CREATE TABLE IF NOT EXISTS delivery_invoices (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(50) UNIQUE NOT NULL,
    date_time DATETIME NOT NULL,
    supplier VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($delivery_invoices_table) === TRUE) {
    echo "Delivery invoices table created successfully.<br>";
} else {
    echo "Error creating delivery invoices table: " . $conn->error . "<br>";
}

// Create invoices_history table
$invoices_history_table = "CREATE TABLE IF NOT EXISTS invoices_history (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(50) UNIQUE NOT NULL,
    date_time DATETIME NOT NULL,
    supplier_customer VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    status ENUM('Paid', 'Cancelled', 'Refunded') DEFAULT 'Paid',
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($invoices_history_table) === TRUE) {
    echo "Invoices history table created successfully.<br>";
} else {
    echo "Error creating invoices history table: " . $conn->error . "<br>";
}

// Create invoices table (legacy delivery invoices)
$invoices_table = "CREATE TABLE IF NOT EXISTS invoices (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier VARCHAR(100) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT(11) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    invoice_date DATE NOT NULL,
    received_date DATE,
    status ENUM('Pending', 'Received', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($invoices_table) === TRUE) {
    echo "Invoices table created successfully.<br>";
} else {
    echo "Error creating invoices table: " . $conn->error . "<br>";
}

// Create activity_logs table
$activity_logs_table = "CREATE TABLE IF NOT EXISTS activity_logs (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11),
    username VARCHAR(50),
    activity VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)";

if ($conn->query($activity_logs_table) === TRUE) {
    echo "Activity logs table created successfully.<br>";
} else {
    echo "Error creating activity logs table: " . $conn->error . "<br>";
}

// Create usage_trends table
$usage_trends_table = "CREATE TABLE IF NOT EXISTS usage_trends (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    oil_type VARCHAR(100) NOT NULL,
    consumption_kg DECIMAL(10,2) NOT NULL,
    trend ENUM('Increasing', 'Decreasing', 'Stable') DEFAULT 'Stable',
    notes TEXT,
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($usage_trends_table) === TRUE) {
    echo "Usage trends table created successfully.<br>";
} else {
    echo "Error creating usage trends table: " . $conn->error . "<br>";
}

// Create storage_monitoring table
$storage_monitoring_table = "CREATE TABLE IF NOT EXISTS storage_monitoring (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    tank_id VARCHAR(50) NOT NULL,
    oil_type VARCHAR(100) NOT NULL,
    current_level_percent DECIMAL(5,2) NOT NULL,
    temperature_celsius DECIMAL(5,2),
    status ENUM('Normal', 'Low', 'High', 'Critical') DEFAULT 'Normal',
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($storage_monitoring_table) === TRUE) {
    echo "Storage monitoring table created successfully.<br>";
} else {
    echo "Error creating storage monitoring table: " . $conn->error . "<br>";
}

// Create current_inventory table
$current_inventory_table = "CREATE TABLE IF NOT EXISTS current_inventory (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    oil_type VARCHAR(100) NOT NULL,
    current_stock_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    minimum_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    maximum_capacity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_price_php DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('Normal', 'Low', 'High', 'Critical') DEFAULT 'Normal',
    conducted_by VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($current_inventory_table) === TRUE) {
    echo "Current inventory table created successfully.<br>";
} else {
    echo "Error creating current inventory table: " . $conn->error . "<br>";
}

// Create stock_movement_history table
$stock_movement_history_table = "CREATE TABLE IF NOT EXISTS stock_movement_history (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    oil_type VARCHAR(100) NOT NULL,
    transaction_type ENUM('Addition', 'Reduction', 'Transfer', 'Adjustment') NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    reference_no VARCHAR(50),
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($stock_movement_history_table) === TRUE) {
    echo "Stock movement history table created successfully.<br>";
} else {
    echo "Error creating stock movement history table: " . $conn->error . "<br>";
}

// Create conversion_log_tons_to_kg table
$conversion_log_tons_to_kg_table = "CREATE TABLE IF NOT EXISTS conversion_log_tons_to_kg (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    tons DECIMAL(10,2) NOT NULL,
    kilograms DECIMAL(10,2) NOT NULL,
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_tons_to_kg_table) === TRUE) {
    echo "Conversion log tons to kg table created successfully.<br>";
} else {
    echo "Error creating conversion log tons to kg table: " . $conn->error . "<br>";
}

// Create conversion_log_kg_to_bottles table
$conversion_log_kg_to_bottles_table = "CREATE TABLE IF NOT EXISTS conversion_log_kg_to_bottles (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    kilograms DECIMAL(10,2) NOT NULL,
    bottles INT(11) NOT NULL,
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_kg_to_bottles_table) === TRUE) {
    echo "Conversion log kg to bottles table created successfully.<br>";
} else {
    echo "Error creating conversion log kg to bottles table: " . $conn->error . "<br>";
}

// Create conversion_log_storage_level table
$conversion_log_storage_level_table = "CREATE TABLE IF NOT EXISTS conversion_log_storage_level (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    capacity_tons DECIMAL(10,2) NOT NULL,
    level_percent DECIMAL(5,2) NOT NULL,
    current_kg DECIMAL(10,2) NOT NULL,
    tons DECIMAL(10,2) NOT NULL,
    conducted_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_storage_level_table) === TRUE) {
    echo "Conversion log storage level table created successfully.<br>";
} else {
    echo "Error creating conversion log storage level table: " . $conn->error . "<br>";
}

// Create conversion_logs table (legacy)
$conversion_logs_table = "CREATE TABLE IF NOT EXISTS conversion_logs (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    conversion_type ENUM('tons_to_kg', 'kg_to_bottles', 'storage_level') NOT NULL,
    quantity_before DECIMAL(10,2) NOT NULL,
    quantity_after DECIMAL(10,2) NOT NULL,
    unit_before VARCHAR(20) NOT NULL,
    unit_after VARCHAR(20) NOT NULL,
    conversion_rate DECIMAL(10,4),
    conducted_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_logs_table) === TRUE) {
    echo "Conversion logs table created successfully.<br>";
} else {
    echo "Error creating conversion logs table: " . $conn->error . "<br>";
}

// Insert default admin user if not exists
$admin_check = "SELECT id FROM users WHERE username = 'admin123'";
$result = $conn->query($admin_check);

if ($result->num_rows == 0) {
    $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
    $insert_admin = "INSERT INTO users (username, password, full_name, privilege) VALUES ('admin123', '$admin_password', 'System Administrator', 'Admin')";

    if ($conn->query($insert_admin) === TRUE) {
        echo "Default admin user created successfully.<br>";
    } else {
        echo "Error creating default admin user: " . $conn->error . "<br>";
    }
} else {
    echo "Default admin user already exists.<br>";
}

echo "<br>Database setup completed successfully!";
echo "<br><a href='Login.html'>Go to Login Page</a>";

$conn->close();
?>
