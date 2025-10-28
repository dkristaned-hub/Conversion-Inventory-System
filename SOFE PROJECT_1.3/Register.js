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

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return false;
  }

  // Check if username already exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  if (existingUsers.some(user => user.username === username)) {
    alert('Username already exists.');
    return false;
  }

  // Store user data
  const newUser = { fullName, email, username, password, privilege: 'guest' };
  existingUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(existingUsers));

  alert('Registration successful! Please login.');
  window.location.href = 'Login.html';
  return false;
}
