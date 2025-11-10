<?php
include 'config.php';

// Get all tables in the database
$sql = "SHOW TABLES FROM $dbname";
$result = $conn->query($sql);

echo '<html>
<head>
    <title>Database Tables</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        h2 {
            color: #333;
            margin-top: 30px;
        }
        .container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
<div class="container">';

echo "<h1>Database: $dbname</h1>";

if ($result->num_rows > 0) {
    // Output data of each table
    while($row = $result->fetch_array()) {
        $table = $row[0];
        echo "<h2>Table: $table</h2>";
        
        // Get table structure
        $structure = $conn->query("DESCRIBE $table");
        if ($structure) {
            echo "<table>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            while($field = $structure->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $field['Field'] . "</td>";
                echo "<td>" . $field['Type'] . "</td>";
                echo "<td>" . $field['Null'] . "</td>";
                echo "<td>" . $field['Key'] . "</td>";
                echo "<td>" . ($field['Default'] ?? 'NULL') . "</td>";
                echo "<td>" . $field['Extra'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";

            // Get table data
            $data = $conn->query("SELECT * FROM $table LIMIT 5");
            if ($data && $data->num_rows > 0) {
                echo "<h3>Sample Data (up to 5 rows):</h3>";
                echo "<table>";
                
                // Header
                $fields = $data->fetch_fields();
                echo "<tr>";
                foreach($fields as $field) {
                    echo "<th>" . $field->name . "</th>";
                }
                echo "</tr>";
                
                // Reset data pointer
                $data->data_seek(0);
                
                // Data rows
                while($row = $data->fetch_assoc()) {
                    echo "<tr>";
                    foreach($row as $value) {
                        echo "<td>" . htmlspecialchars($value ?? 'NULL') . "</td>";
                    }
                    echo "</tr>";
                }
                echo "</table>";
            }
        }
    }
} else {
    echo "No tables found in database.";
}

echo '</div></body></html>';

$conn->close();
?>