<?php
// Email functions for sending alerts

function sendEmailAlert($to, $subject, $message) {
    $headers = "From: noreply@yourdomain.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // For local development, you might need to configure SMTP in php.ini
    // For production, use a proper SMTP server

    if (mail($to, $subject, $message, $headers)) {
        return true;
    } else {
        // Log error or handle failure
        error_log("Failed to send email to $to");
        return false;
    }
}

function sendInventoryChangeAlert($changeType, $details) {
    global $conn;

    // Get all users with email addresses
    $stmt = $conn->prepare("SELECT email FROM users WHERE email IS NOT NULL AND email != ''");
    $stmt->execute();
    $result = $stmt->get_result();

    $subject = "Inventory Alert: $changeType";
    $message = "
    <html>
    <body>
        <h2>Inventory Change Notification</h2>
        <p><strong>Type:</strong> $changeType</p>
        <p><strong>Details:</strong> $details</p>
        <p><strong>Time:</strong> " . date('Y-m-d H:i:s') . "</p>
        <p>Please check the system for more details.</p>
    </body>
    </html>
    ";

    while ($row = $result->fetch_assoc()) {
        sendEmailAlert($row['email'], $subject, $message);
    }
}

function sendActivityLogAlert($activity, $details) {
    global $conn;

    // Get all admin users with email addresses
    $stmt = $conn->prepare("SELECT email FROM users WHERE privilege = 'Admin' AND email IS NOT NULL AND email != ''");
    $stmt->execute();
    $result = $stmt->get_result();

    $subject = "Activity Log Alert: $activity";
    $message = "
    <html>
    <body>
        <h2>Activity Log Notification</h2>
        <p><strong>Activity:</strong> $activity</p>
        <p><strong>Details:</strong> $details</p>
        <p><strong>Time:</strong> " . date('Y-m-d H:i:s') . "</p>
        <p>Please review the activity logs in the system.</p>
    </body>
    </html>
    ";

    while ($row = $result->fetch_assoc()) {
        sendEmailAlert($row['email'], $subject, $message);
    }
}
?>
