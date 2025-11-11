<?php
include 'config.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Check if request is AJAX
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

$messages = [];
$errors = [];

// Check if database is connected
if ($conn->ping()) {
    $messages[] = "Database is connected.";
} else {
    $errors[] = "Database connection failed.";
}

// Drop database if exists and create new
$sql = "DROP DATABASE IF EXISTS conversion_inventory_system";
if ($conn->query($sql) === TRUE) {
    $messages[] = "Old database dropped if existed.";
}
$sql = "CREATE DATABASE conversion_inventory_system";
if ($conn->query($sql) === TRUE) {
    $messages[] = "Database created successfully or already exists.";
    $conn->select_db('conversion_inventory_system');
} else {
    $errors[] = "Error creating database: " . $conn->error;
}



// Create activity_logs table
$activity_logs_table = "CREATE TABLE IF NOT EXISTS activity_logs (
    id integer PRIMARY KEY AUTO_INCREMENT,
    activity_date date,
    activity_description text,
    conducted_by varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($activity_logs_table) === TRUE) {
    $messages[] = "Activity logs table created successfully.";
} else {
    $errors[] = "Error creating activity logs table: " . $conn->error;
}

// Create employee_log table
$employee_log_table = "CREATE TABLE IF NOT EXISTS employee_log (
    id integer PRIMARY KEY AUTO_INCREMENT,
    employee_name varchar(255),
    position varchar(255),
    id_number varchar(255),
    log_date timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($employee_log_table) === TRUE) {
    $messages[] = "Employee log table created successfully.";
} else {
    $errors[] = "Error creating employee log table: " . $conn->error;
}

// Create employee_shifts table
$employee_shifts_table = "CREATE TABLE IF NOT EXISTS employee_shifts (
    id integer PRIMARY KEY AUTO_INCREMENT,
    employee_name varchar(255),
    employee_id varchar(255),
    shift_start time,
    shift_end time,
    day_start varchar(255),
    day_end varchar(255),
    conducted_by varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($employee_shifts_table) === TRUE) {
    $messages[] = "Employee shifts table created successfully.";
} else {
    $errors[] = "Error creating employee shifts table: " . $conn->error;
}

// Create attendance table
$attendance_table = "CREATE TABLE IF NOT EXISTS attendance (
    id integer PRIMARY KEY AUTO_INCREMENT,
    employee_name varchar(255),
    employee_id varchar(255),
    check_in time,
    check_out time,
    status varchar(255),
    conducted_by varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($attendance_table) === TRUE) {
    $messages[] = "Attendance table created successfully.";
} else {
    $errors[] = "Error creating attendance table: " . $conn->error;
}

// Create users table
$users_table = "CREATE TABLE IF NOT EXISTS users (
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) UNIQUE NOT NULL,
    full_name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role enum('admin','manager','staff','guest') DEFAULT 'staff',
    profile_picture_url varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($users_table) === TRUE) {
    $messages[] = "Users table created successfully.";
} else {
    $errors[] = "Error creating users table: " . $conn->error;
}

// Create employee_management table
$employee_management_table = "CREATE TABLE IF NOT EXISTS employee_management (
    id integer PRIMARY KEY AUTO_INCREMENT,
    employee_id integer NOT NULL,
    manager_id integer,
    department varchar(255),
    status varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($employee_management_table) === TRUE) {
    $messages[] = "Employee management table created successfully.";
} else {
    $errors[] = "Error creating employee management table: " . $conn->error;
}

// Create inventory table
$inventory_table = "CREATE TABLE IF NOT EXISTS inventory (
    id integer PRIMARY KEY AUTO_INCREMENT,
    oil_type varchar(255) NOT NULL,
    current_stock decimal(10,2) NOT NULL,
    min_level decimal(10,2) NOT NULL,
    max_capacity decimal(10,2) NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    status enum('Low Stock','Normal','Out of Stock') NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($inventory_table) === TRUE) {
    $messages[] = "Inventory table created successfully.";
} else {
    $errors[] = "Error creating inventory table: " . $conn->error;
}

// Create monitoring table
$monitoring_table = "CREATE TABLE IF NOT EXISTS monitoring (
    submission_id integer PRIMARY KEY AUTO_INCREMENT,
    monitoring_type enum('Usage','Temperature','Stock') NOT NULL,
    oil_type_id integer NOT NULL,
    transaction_type enum('Stock In','Stock Out') NOT NULL,
    monitoring_date date NOT NULL,
    quantity decimal(10,2) NOT NULL,
    notes text,
    submitted_by varchar(255) NOT NULL
)";

if ($conn->query($monitoring_table) === TRUE) {
    $messages[] = "Monitoring table created successfully.";
} else {
    $errors[] = "Error creating monitoring table: " . $conn->error;
}

// Create pending_invoices table
$pending_invoices_table = "CREATE TABLE IF NOT EXISTS pending_invoices (
    id integer PRIMARY KEY AUTO_INCREMENT,
    invoice_id varchar(50) NOT NULL,
    amount decimal(10,2) NOT NULL,
    due_date date NOT NULL,
    status varchar(255) DEFAULT 'Pending',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($pending_invoices_table) === TRUE) {
    $messages[] = "Pending invoices table created successfully.";
} else {
    $errors[] = "Error creating pending invoices table: " . $conn->error;
}

// Create delivery_invoices table
$delivery_invoices_table = "CREATE TABLE IF NOT EXISTS delivery_invoices (
    id integer PRIMARY KEY AUTO_INCREMENT,
    invoice_id varchar(50) NOT NULL,
    delivery_date date NOT NULL,
    amount decimal(10,2) NOT NULL,
    status varchar(255) DEFAULT 'Delivered',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($delivery_invoices_table) === TRUE) {
    $messages[] = "Delivery invoices table created successfully.";
} else {
    $errors[] = "Error creating delivery invoices table: " . $conn->error;
}

// Create invoice table
$invoice_table = "CREATE TABLE IF NOT EXISTS invoice (
    invoice_id integer PRIMARY KEY AUTO_INCREMENT,
    invoice_number varchar(50) NOT NULL UNIQUE,
    customer_name varchar(255) NOT NULL,
    total_amount decimal(10,2) NOT NULL,
    status enum('Pending','Paid','Overdue','Cancelled') DEFAULT 'Pending',
    issue_date date NOT NULL,
    due_date date NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($invoice_table) === TRUE) {
    $messages[] = "Invoice table created successfully.";
} else {
    $errors[] = "Error creating invoice table: " . $conn->error;
}

// Create invoices_history table
$invoices_history_table = "CREATE TABLE IF NOT EXISTS invoices_history (
    history_id integer PRIMARY KEY AUTO_INCREMENT,
    invoice_id varchar(50) NOT NULL,
    action enum('Payment','Status Update') NOT NULL,
    action_date timestamp DEFAULT CURRENT_TIMESTAMP,
    payment_date timestamp NULL,
    amount_paid decimal(10,2),
    status enum('Pending','Paid','Overdue'),
    conducted_by varchar(255)
)";

if ($conn->query($invoices_history_table) === TRUE) {
    $messages[] = "Invoices history table created successfully.";
} else {
    $errors[] = "Error creating invoices history table: " . $conn->error;
}

// Create usage_trends table
$usage_trends_table = "CREATE TABLE IF NOT EXISTS usage_trends (
    trend_id integer PRIMARY KEY AUTO_INCREMENT,
    oil_type_id integer NOT NULL,
    consumption_date date NOT NULL,
    consumption decimal(10,2) NOT NULL,
    trend enum('Increasing','Stable','Decreasing') NOT NULL,
    notes text,
    conducted_by varchar(255) NOT NULL
)";

if ($conn->query($usage_trends_table) === TRUE) {
    $messages[] = "Usage trends table created successfully.";
} else {
    $errors[] = "Error creating usage trends table: " . $conn->error;
}

// Create storage_monitoring table
$conn->query("DROP TABLE IF EXISTS storage_monitoring");
$storage_monitoring_table = "CREATE TABLE storage_monitoring (
    monitoring_id integer PRIMARY KEY AUTO_INCREMENT,
    tank_id integer NOT NULL,
    oil_type_id integer NOT NULL,
    monitoring_date date NOT NULL,
    current_level decimal(5,2) NOT NULL,
    temperature decimal(5,2) NOT NULL,
    status enum('Normal','Warning','Critical') DEFAULT 'Normal',
    conducted_by varchar(255) NOT NULL
)";

if ($conn->query($storage_monitoring_table) === TRUE) {
    $messages[] = "Storage monitoring table created successfully.";
} else {
    $errors[] = "Error creating storage monitoring table: " . $conn->error;
}

// Create current_inventory table
$current_inventory_table = "CREATE TABLE IF NOT EXISTS current_inventory (
    inventory_id integer PRIMARY KEY AUTO_INCREMENT,
    oil_type_id integer NOT NULL,
    total_volume decimal(10,2) NOT NULL,
    stock_capacity decimal(10,2) NOT NULL
)";

if ($conn->query($current_inventory_table) === TRUE) {
    $messages[] = "Current inventory table created successfully.";
} else {
    $errors[] = "Error creating current inventory table: " . $conn->error;
}

// Create stock_movement_history table
$stock_movement_history_table = "CREATE TABLE IF NOT EXISTS stock_movement_history (
    id integer PRIMARY KEY AUTO_INCREMENT,
    movement_date date NOT NULL,
    oil_type varchar(255) NOT NULL,
    transaction_type enum('Stock In','Stock Out') NOT NULL,
    quantity decimal(10,2) NOT NULL,
    reference_no varchar(255) NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($stock_movement_history_table) === TRUE) {
    $messages[] = "Stock movement history table created successfully.";
} else {
    $errors[] = "Error creating stock movement history table: " . $conn->error;
}

// Create conversion_log_tons_to_kg table
$conversion_log_tons_to_kg_table = "CREATE TABLE IF NOT EXISTS conversion_log_tons_to_kg (
    id integer PRIMARY KEY AUTO_INCREMENT,
    input_tons decimal(10,2) NOT NULL,
    output_kg decimal(10,2) NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_tons_to_kg_table) === TRUE) {
    $messages[] = "Conversion log tons to kg table created successfully.";
} else {
    $errors[] = "Error creating conversion log tons to kg table: " . $conn->error;
}

// Create conversion_log_kg_to_bottles table
$conversion_log_kg_to_bottles_table = "CREATE TABLE IF NOT EXISTS conversion_log_kg_to_bottles (
    id integer PRIMARY KEY AUTO_INCREMENT,
    input_kg decimal(10,2) NOT NULL,
    output_bottles integer NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_kg_to_bottles_table) === TRUE) {
    $messages[] = "Conversion log kg to bottles table created successfully.";
} else {
    $errors[] = "Error creating conversion log kg to bottles table: " . $conn->error;
}

// Create conversion_log_storage_level table
$conversion_log_storage_level_table = "CREATE TABLE IF NOT EXISTS conversion_log_storage_level (
    id integer PRIMARY KEY AUTO_INCREMENT,
    tank_capacity decimal(10,2) NOT NULL,
    current_level decimal(10,2) NOT NULL,
    converted_level decimal(10,2) NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_log_storage_level_table) === TRUE) {
    $messages[] = "Conversion log storage level table created successfully.";
} else {
    $errors[] = "Error creating conversion log storage level table: " . $conn->error;
}

// Create conversion_logs table
$conversion_logs_table = "CREATE TABLE IF NOT EXISTS conversion_logs (
    id integer PRIMARY KEY AUTO_INCREMENT,
    conversion_type enum('Tons to Kg','Kg to Bottles','Storage Level') NOT NULL,
    input_value decimal(10,2) NOT NULL,
    output_value decimal(10,2) NOT NULL,
    conducted_by varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($conversion_logs_table) === TRUE) {
    $messages[] = "Conversion logs table created successfully.";
} else {
    $errors[] = "Error creating conversion logs table: " . $conn->error;
}

// Create oil_types table
$oil_types_table = "CREATE TABLE IF NOT EXISTS oil_types (
    oil_type_id integer PRIMARY KEY AUTO_INCREMENT,
    oil_name varchar(255) NOT NULL,
    description text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($oil_types_table) === TRUE) {
    $messages[] = "Oil types table created successfully.";
} else {
    $errors[] = "Error creating oil types table: " . $conn->error;
}

// Add foreign key constraints

try {
    $conn->query("ALTER TABLE current_inventory DROP FOREIGN KEY fk_current_inventory_oil_type_id");
} catch (Exception $e) {
    // Constraint might not exist, continue
}
$alter_current_inventory = "ALTER TABLE current_inventory ADD CONSTRAINT fk_current_inventory_oil_type_id FOREIGN KEY (oil_type_id) REFERENCES oil_types (oil_type_id)";
try {
    $conn->query($alter_current_inventory);
} catch (Exception $e) {
    $errors[] = "Error adding foreign key to current_inventory: " . $e->getMessage();
}

try {
    $conn->query("ALTER TABLE usage_trends DROP FOREIGN KEY fk_usage_trends_oil_type_id");
} catch (Exception $e) {
    // Constraint might not exist, continue
}
$alter_usage_trends = "ALTER TABLE usage_trends ADD CONSTRAINT fk_usage_trends_oil_type_id FOREIGN KEY (oil_type_id) REFERENCES oil_types (oil_type_id)";
try {
    $conn->query($alter_usage_trends);
} catch (Exception $e) {
    $errors[] = "Error adding foreign key to usage_trends: " . $e->getMessage();
}

try {
    $conn->query("ALTER TABLE storage_monitoring DROP FOREIGN KEY fk_storage_monitoring_oil_type_id");
} catch (Exception $e) {
    // Constraint might not exist, continue
}
$alter_storage_monitoring = "ALTER TABLE storage_monitoring ADD CONSTRAINT fk_storage_monitoring_oil_type_id FOREIGN KEY (oil_type_id) REFERENCES oil_types (oil_type_id)";
try {
    $conn->query($alter_storage_monitoring);
} catch (Exception $e) {
    $errors[] = "Error adding foreign key to storage_monitoring: " . $e->getMessage();
}



// Insert default admin user if not exists
$admin_check = "SELECT user_id FROM users WHERE username = 'admin'";
$result = $conn->query($admin_check);

if ($result->num_rows == 0) {
    $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
    $insert_admin = "INSERT INTO users (username, password, full_name, role) VALUES ('admin', '$admin_password', 'System Administrator', 'admin')";

    if ($conn->query($insert_admin) === TRUE) {
        $messages[] = "Default admin user created successfully.";
    } else {
        $errors[] = "Error creating default admin user: " . $conn->error;
    }
} else {
    $messages[] = "Default admin user already exists.";
}

// Insert sample oil types
$oil_types_check = "SELECT COUNT(*) as count FROM oil_types";
$result = $conn->query($oil_types_check);
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    $insert_oil_types = [
        "INSERT INTO oil_types (oil_name, description) VALUES ('Coconut Oil', 'Virgin coconut oil for cooking')",
        "INSERT INTO oil_types (oil_name, description) VALUES ('Palm Oil', 'Refined palm oil for industrial use')"
    ];

    foreach ($insert_oil_types as $sql) {
        $conn->query($sql);
    }
    $messages[] = "Sample oil types inserted successfully.";
}

if ($isAjax) {
    header('Content-Type: application/json');
    echo json_encode(['messages' => $messages, 'errors' => $errors]);
} else {
    foreach ($messages as $msg) {
        echo $msg . "<br>";
    }
    foreach ($errors as $err) {
        echo $err . "<br>";
    }
    echo "<br>Database setup completed successfully!";
    echo "<br><a href='Login.html'>Go to Login Page</a>";
}

$conn->close();
?>
