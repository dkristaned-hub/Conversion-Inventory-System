<?php
include 'config.php';

// Function to check if table exists
function tableExists($conn, $tableName) {
    $result = $conn->query("SHOW TABLES LIKE '$tableName'");
    return $result->num_rows > 0;
}

// Function to get table record count
function getTableCount($conn, $tableName) {
    if (tableExists($conn, $tableName)) {
        $result = $conn->query("SELECT COUNT(*) as count FROM $tableName");
        $row = $result->fetch_assoc();
        return $row['count'];
    }
    return 0;
}

// Check database connection
$connectionStatus = "Connected";
$connectionClass = "success";
$tables = [];

try {
    // Test connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Select database
    if (!$conn->select_db($dbname)) {
        throw new Exception("Database selection failed: " . $conn->error);
    }

    // List of expected tables
    $expectedTables = [
        'activity_logs',
        'employee_log',
        'employee_shifts',
        'attendance',
        'users',
        'employee_management',
        'inventory',
        'monitoring',
        'pending_invoices',
        'delivery_invoices',
        'invoices_history',
        'usage_trends',
        'storage_monitoring',
        'current_inventory',
        'stock_movement_history',
        'conversion_log_tons_to_kg',
        'conversion_log_kg_to_bottles',
        'conversion_log_storage_level',
        'conversion_logs'
    ];

    // Check each table
    foreach ($expectedTables as $table) {
        $exists = tableExists($conn, $table);
        $count = getTableCount($conn, $table);
        $tables[] = [
            'name' => $table,
            'exists' => $exists,
            'count' => $count,
            'status' => $exists ? 'Exists' : 'Missing',
            'class' => $exists ? 'success' : 'error'
        ];
    }

} catch (Exception $e) {
    $connectionStatus = "Failed: " . $e->getMessage();
    $connectionClass = "error";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Status Checker - Conversion Inventory System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .status-card {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 5px solid;
        }
        .success {
            background-color: #d4edda;
            border-left-color: #28a745;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            border-left-color: #dc3545;
            color: #721c24;
        }
        .warning {
            background-color: #fff3cd;
            border-left-color: #ffc107;
            color: #856404;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-indicator.success {
            background-color: #28a745;
            box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        }
        .status-indicator.error {
            background-color: #dc3545;
            box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
        }
        .status-indicator.warning {
            background-color: #ffc107;
            box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
        }
        .table-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .table-name {
            font-weight: bold;
        }
        .table-info {
            font-size: 0.9em;
            color: #666;
        }
        .refresh-btn {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
        }
        .refresh-btn:hover {
            background-color: #0056b3;
        }
        .nav-links {
            text-align: center;
            margin-top: 20px;
        }
        .nav-links a {
            margin: 0 10px;
            color: #007bff;
            text-decoration: none;
        }
        .nav-links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Database Status Checker</h1>

        <!-- Connection Status -->
        <div class="status-card <?php echo $connectionClass; ?>">
            <h3><span class="status-indicator <?php echo $connectionClass; ?>"></span>Database Connection</h3>
            <p>Status: <?php echo $connectionStatus; ?></p>
            <?php if ($connectionClass === 'success'): ?>
                <p>Database: <?php echo $dbname; ?> on <?php echo $servername; ?></p>
            <?php endif; ?>
        </div>

        <?php if ($connectionClass === 'success'): ?>
            <!-- Tables Status -->
            <h3>Database Tables</h3>
            <?php foreach ($tables as $table): ?>
                <div class="status-card <?php echo $table['class']; ?>">
                    <div class="table-status">
                        <div>
                            <span class="status-indicator <?php echo $table['class']; ?>"></span>
                            <span class="table-name"><?php echo $table['name']; ?></span>
                            <span class="table-info">(<?php echo $table['count']; ?> records)</span>
                        </div>
                        <div><?php echo $table['status']; ?></div>
                    </div>
                </div>
            <?php endforeach; ?>

            <!-- System Statistics -->
            <div class="status-card success">
                <h3>System Statistics</h3>
                <p>Total Users: <?php echo getTableCount($conn ?? null, 'users'); ?></p>
                <p>Total Employees: <?php echo getTableCount($conn ?? null, 'employee_log'); ?></p>
                <p>Employee Management Records: <?php echo getTableCount($conn ?? null, 'employee_management'); ?></p>
                <p>Scheduled Shifts: <?php echo getTableCount($conn ?? null, 'employee_shifts'); ?></p>
                <p>Active Attendance Records: <?php echo getTableCount($conn ?? null, 'attendance'); ?></p>
                <p>Inventory Items: <?php echo getTableCount($conn ?? null, 'inventory'); ?></p>
                <p>Current Inventory Records: <?php echo getTableCount($conn ?? null, 'current_inventory'); ?></p>
                <p>Stock Movement History: <?php echo getTableCount($conn ?? null, 'stock_movement_history'); ?></p>
                <p>Conversion Logs (Tons to KG): <?php echo getTableCount($conn ?? null, 'conversion_log_tons_to_kg'); ?></p>
                <p>Conversion Logs (KG to Bottles): <?php echo getTableCount($conn ?? null, 'conversion_log_kg_to_bottles'); ?></p>
                <p>Conversion Logs (Storage Level): <?php echo getTableCount($conn ?? null, 'conversion_log_storage_level'); ?></p>
                <p>Pending Invoices: <?php echo getTableCount($conn ?? null, 'pending_invoices'); ?></p>
                <p>Delivery Invoices: <?php echo getTableCount($conn ?? null, 'delivery_invoices'); ?></p>
                <p>Invoice History: <?php echo getTableCount($conn ?? null, 'invoices_history'); ?></p>
                <p>Usage Trends Records: <?php echo getTableCount($conn ?? null, 'usage_trends'); ?></p>
                <p>Storage Monitoring Records: <?php echo getTableCount($conn ?? null, 'storage_monitoring'); ?></p>
                <p>Conversion Logs: <?php echo getTableCount($conn ?? null, 'conversion_logs'); ?></p>
            </div>
        <?php endif; ?>

        <button class="refresh-btn" onclick="location.reload()">Refresh Status</button>

        <div class="nav-links">
            <a href="database_setup.php">Run Database Setup</a>
            <a href="login.php">Go to Login</a>
            <a href="Main.html">Dashboard</a>
        </div>
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(function() {
            location.reload();
        }, 30000);
    </script>
</body>
</html>

<?php
$conn->close();
?>
