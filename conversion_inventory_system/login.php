<?php
include 'config.php';
include 'auth.php';

$auth = new Auth($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = "Please enter both username and password.";
    } else {
        $result = $auth->login($username, $password);
        if ($result['success']) {
            // Redirect based on privilege
            if ($result['user']['privilege'] === 'Admin') {
                header('Location: Main.html');
            } else {
                header('Location: Main.html');
            }
            exit;
        } else {
            $error = $result['message'];
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Conversion Inventory System</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-form">
            <h1 class="login-title">Conversion Inventory System</h1>
            <p class="login-subtitle">Please sign in to continue</p>

            <?php if (isset($error)): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" name="username" class="form-input" required>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" name="password" class="form-input" required>
                </div>

                <button type="submit" class="login-button">Sign In</button>
            </form>

            <div class="login-footer">
                <p>Default Admin: admin123 / admin123</p>
            </div>
        </div>
    </div>
</body>
</html>
