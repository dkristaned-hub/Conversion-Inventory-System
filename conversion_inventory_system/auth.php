<?php
include 'config.php';

class Auth {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Login function
    public function login($username, $password) {
        $stmt = $this->conn->prepare("SELECT id, username, password, full_name, privilege, employee_id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user['password'])) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['privilege'] = $user['privilege'];
                $_SESSION['employee_id'] = $user['employee_id'];

                // Log activity
                $this->logActivity($user['id'], $user['username'], 'Login', 'User logged in successfully');

                // Automatic attendance check-in for Staff on successful login
                // Do not create duplicate entries for the same day
                if (isset($user['privilege']) && $user['privilege'] === 'Staff') {
                    $employee_id = $user['employee_id'];
                    if (!empty($employee_id)) {
                        $stmt_check = $this->conn->prepare("SELECT id FROM attendance WHERE employee_id = ? AND check_in_date = CURDATE()");
                        $stmt_check->bind_param("s", $employee_id);
                        $stmt_check->execute();
                        $res_check = $stmt_check->get_result();

                        if ($res_check->num_rows == 0) {
                            $stmt_att = $this->conn->prepare("INSERT INTO attendance (employee_id, name, check_in_date, check_in_time, status, handler) VALUES (?, ?, CURDATE(), CURTIME(), 'Present', ?)");
                            $stmt_att->bind_param("sss", $employee_id, $user['full_name'], $user['username']);
                            $stmt_att->execute();
                            $this->logActivity($user['id'], $user['username'], 'Attendance Check-In', 'Automatic check-in on login');
                        }
                    }
                }

                return ['success' => true, 'message' => 'Login successful', 'user' => $user];
            } else {
                $this->logActivity(null, $username, 'Failed Login', 'Incorrect password');
                return ['success' => false, 'message' => 'Incorrect password'];
            }
        } else {
            $this->logActivity(null, $username, 'Failed Login', 'User not found');
            return ['success' => false, 'message' => 'User not found'];
        }
    }

    // Check if user is logged in
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    // Check if user has specific privilege
    public function hasPrivilege($privilege) {
        return isset($_SESSION['privilege']) && $_SESSION['privilege'] === $privilege;
    }

    // Logout function
    public function logout() {
        // Automatic attendance checkout for Staff on logout
        if (isset($_SESSION['privilege']) && $_SESSION['privilege'] === 'Staff' && isset($_SESSION['employee_id'])) {
            $employee_id = $_SESSION['employee_id'];
            if (!empty($employee_id)) {
                $stmt = $this->conn->prepare("UPDATE attendance SET check_out_date = CURDATE(), check_out_time = CURTIME(), status = 'Checked Out' WHERE employee_id = ? AND check_in_date = CURDATE() AND status = 'Present'");
                $stmt->bind_param("s", $employee_id);
                $stmt->execute();
                $this->logActivity($_SESSION['user_id'] ?? null, $_SESSION['username'] ?? null, 'Attendance Check-Out', 'Automatic checkout on logout');
            }
        }

        if (isset($_SESSION['user_id'])) {
            $this->logActivity($_SESSION['user_id'], $_SESSION['username'], 'Logout', 'User logged out');
        }

        session_destroy();
        return ['success' => true, 'message' => 'Logged out successfully'];
    }

    // Get current user info
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'full_name' => $_SESSION['full_name'],
            'privilege' => $_SESSION['privilege'],
            'employee_id' => $_SESSION['employee_id']
        ];
    }

    // Log activity
    private function logActivity($user_id, $username, $activity, $details) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        $stmt = $this->conn->prepare("INSERT INTO activity_logs (user_id, username, activity, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $user_id, $username, $activity, $details, $ip, $user_agent);
        $stmt->execute();
    }

    // Register new user (admin only)
    public function register($username, $password, $full_name, $privilege) {
        if (!$this->hasPrivilege('Admin')) {
            return ['success' => false, 'message' => 'Access denied. Admin privileges required.'];
        }

        // Check if username already exists
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();

        if ($stmt->get_result()->num_rows > 0) {
            return ['success' => false, 'message' => 'Username already exists'];
        }

        // Generate employee ID
        $employee_id = $this->generateEmployeeId($privilege);

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert user
        $stmt = $this->conn->prepare("INSERT INTO users (employee_id, username, password, full_name, privilege) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $employee_id, $username, $hashed_password, $full_name, $privilege);

        if ($stmt->execute()) {
            $user_id = $this->conn->insert_id;

            // Add to employee log
            $stmt2 = $this->conn->prepare("INSERT INTO employee_log (name, position, employee_id) VALUES (?, ?, ?)");
            $stmt2->bind_param("sss", $full_name, $privilege, $employee_id);
            $stmt2->execute();

            $this->logActivity($_SESSION['user_id'], $_SESSION['username'], 'User Registration', "Registered new user: $username ($privilege)");

            return ['success' => true, 'message' => 'User registered successfully', 'employee_id' => $employee_id];
        } else {
            return ['success' => false, 'message' => 'Registration failed'];
        }
    }

    // Generate employee ID
    private function generateEmployeeId($privilege) {
        $prefix = ($privilege === 'Admin') ? 'ADM' : 'STF';

        // Get the latest counter for this privilege
        $stmt = $this->conn->prepare("SELECT MAX(CAST(SUBSTRING(employee_id, 5) AS UNSIGNED)) as max_counter FROM users WHERE employee_id LIKE ?");
        $like_pattern = $prefix . '-%';
        $stmt->bind_param("s", $like_pattern);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        $counter = ($row['max_counter'] ?? 0) + 1;
        return $prefix . '-' . str_pad($counter, 3, '0', STR_PAD_LEFT);
    }
}
?>
