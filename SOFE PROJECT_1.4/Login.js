// Load remembered data on page load
window.addEventListener('load', function() {
  const savedUsername = localStorage.getItem('rememberUsername');
  const savedPassword = localStorage.getItem('rememberPassword');
  if (savedUsername && savedPassword) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('password').value = savedPassword;
    document.getElementById('remember').checked = true;
  }
});

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><line x1="3" y1="3" x2="21" y2="21" stroke="#4B5563" stroke-width="2"/></svg>';
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
  }
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  // Check for specific credentials (admin)
  if (username === "admin123" && password === "admin123") {
    // Handle remember me
    if (remember) {
      localStorage.setItem('rememberUsername', username);
      localStorage.setItem('rememberPassword', password);
    } else {
      localStorage.removeItem('rememberUsername');
      localStorage.removeItem('rememberPassword');
    }

    // Store the username for welcome message
    localStorage.setItem('userName', username);

    // Store the username
    localStorage.setItem('userUsername', username);

    // Set privilege to Admin
    localStorage.setItem('userPrivilege', 'Admin');

    // Redirect to main page
    window.location.href = 'Main.html';
  } else {
    // Check registered users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Handle remember me
      if (remember) {
        localStorage.setItem('rememberUsername', username);
        localStorage.setItem('rememberPassword', password);
      } else {
        localStorage.removeItem('rememberUsername');
        localStorage.removeItem('rememberPassword');
      }

      // Store user data
      localStorage.setItem('userName', user.fullName);
      localStorage.setItem('userUsername', user.username);
      localStorage.setItem('userPrivilege', user.privilege);

      // Redirect to main page
      window.location.href = 'Main.html';
    } else {
      alert('Invalid username or password');
    }
  }
}
