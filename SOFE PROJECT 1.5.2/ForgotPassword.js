function handleForgotPassword(event) {
  event.preventDefault();

  const username = document.getElementById('reset-username').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const resultDiv = document.getElementById('reset-result');

  if (newPassword !== confirmPassword) {
    resultDiv.textContent = 'Passwords do not match.';
    return;
  }

  if (newPassword.length < 6) {
    resultDiv.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  // Check if user exists
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex !== -1) {
    // Update password for registered user
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    resultDiv.textContent = 'Password reset successfully!';
    resultDiv.style.color = '#059669';
    setTimeout(() => {
      window.location.href = 'Login.html';
    }, 2000);
  } else if (username === 'admin123') {
    // For admin, we can't reset via localStorage, but we can show a message
    resultDiv.textContent = 'Admin password cannot be reset here. Please contact system administrator.';
  } else {
    resultDiv.textContent = 'Username not found.';
  }
}
