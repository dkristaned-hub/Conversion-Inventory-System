<?php
header('Content-Type: application/json');
include 'config.php';
include 'auth.php';
include 'email_functions.php';

$auth = new Auth($conn);

// Check if user is logged in for protected endpoints
function requireLogin() {
    global $auth;
    if (!$auth->isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit;
    }
}

// Check for admin privileges
function requireAdmin() {
    global $auth;
    if (!$auth->hasPrivilege('Admin')) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin privileges required']);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $auth->login($data['username'], $data['password']);
            echo json_encode($result);
        }
        break;

    case 'logout':
        requireLogin();
        $result = $auth->logout();
        echo json_encode($result);
        break;

    case 'register':
        requireLogin();
        requireAdmin();
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $auth->register($data['username'], $data['password'], $data['full_name'], $data['privilege']);
            echo json_encode($result);
        }
        break;

    case 'get_users':
        requireLogin();
        requireAdmin();
        if ($method === 'GET') {
            $stmt = $conn->prepare("SELECT user_id, employee_id, username, full_name, role, created_at FROM users ORDER BY created_at DESC");
            $stmt->execute();
            $result = $stmt->get_result();
            $users = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(['success' => true, 'users' => $users]);
        }
        break;

    case 'get_employee_log':
        requireLogin();
        if ($method === 'GET') {
            $stmt = $conn->prepare("SELECT * FROM employee_log ORDER BY created_at DESC");
            $stmt->execute();
            $result = $stmt->get_result();
            $logs = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(['success' => true, 'logs' => $logs]);
        }
        break;

    case 'get_attendance':
        requireLogin();
        if ($method === 'GET') {
            $stmt = $conn->prepare("SELECT * FROM attendance ORDER BY created_at DESC");
            $stmt->execute();
            $result = $stmt->get_result();
            $attendance = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(['success' => true, 'attendance' => $attendance]);
        }
        break;

    case 'record_attendance':
        requireLogin();
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = $auth->getCurrentUser();

            $stmt = $conn->prepare("INSERT INTO attendance (employee_id, name, check_in_date, check_in_time, status, handler) VALUES (?, ?, CURDATE(), CURTIME(), 'Present', ?)");
            $stmt->bind_param("sss", $user['employee_id'], $user['full_name'], $user['username']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Attendance recorded']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to record attendance']);
            }
        }
        break;

    case 'checkout':
        requireLogin();
        if ($method === 'POST') {
            $user = $auth->getCurrentUser();

            $stmt = $conn->prepare("UPDATE attendance SET check_out_date = CURDATE(), check_out_time = CURTIME(), status = 'Checked Out' WHERE employee_id = ? AND DATE(check_in_date) = CURDATE() AND status = 'Present'");
            $stmt->bind_param("s", $user['employee_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Checkout recorded']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to record checkout']);
            }
        }
        break;

    case 'get_inventory':
        requireLogin();
        if ($method === 'GET') {
            $stmt = $conn->prepare("SELECT * FROM inventory ORDER BY last_updated DESC");
            $stmt->execute();
            $result = $stmt->get_result();
            $inventory = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(['success' => true, 'inventory' => $inventory]);
        }
        break;

    case 'update_inventory':
        requireLogin();
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = $auth->getCurrentUser();

            $stmt = $conn->prepare("UPDATE inventory SET quantity = ?, last_updated = NOW(), updated_by = ? WHERE id = ?");
            $stmt->bind_param("isi", $data['quantity'], $user['username'], $data['id']);

            if ($stmt->execute()) {
                // Send email alert for inventory change
                $changeType = $data['quantity'] > 0 ? 'Stock Increase' : 'Stock Decrease';
                $details = "Item ID: {$data['id']}, New Quantity: {$data['quantity']}, Updated by: {$user['username']}";
                sendInventoryChangeAlert($changeType, $details);

                echo json_encode(['success' => true, 'message' => 'Inventory updated']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update inventory']);
            }
        }
        break;

    case 'get_activity_logs':
        requireLogin();
        if ($method === 'GET') {
            $stmt = $conn->prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100");
            $stmt->execute();
            $result = $stmt->get_result();
            $logs = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(['success' => true, 'logs' => $logs]);
        }
        break;

    case 'log_activity':
        requireLogin();
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = $auth->getCurrentUser();

            $stmt = $conn->prepare("INSERT INTO activity_logs (activity_date, activity_description, conducted_by) VALUES (CURDATE(), ?, ?)");
            $stmt->bind_param("ss", $data['activity_description'], $user['username']);

            if ($stmt->execute()) {
                // Send email alert for activity log
                sendActivityLogAlert($data['activity_description'], $data['details'] ?? '');
                echo json_encode(['success' => true, 'message' => 'Activity logged']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to log activity']);
            }
        }
        break;

    case 'get_current_user':
        requireLogin();
        $user = $auth->getCurrentUser();
        echo json_encode(['success' => true, 'user' => $user]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        break;
}

$conn->close();
?>
