/**
 * VastraVerse Authentication System
 * Handles user registration, login, validation and session management
 */

// Initialize users array from localStorage or create empty array
let users = JSON.parse(localStorage.getItem('vastraverse_users')) || [];

// User session management
const currentUser = JSON.parse(localStorage.getItem('vastraverse_current_user'));
if (currentUser) {
  // Update UI elements for logged in user
  updateUIForLoggedInUser(currentUser);
}

// DOM elements for login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const loginEmail = document.getElementById('email');
  const loginPassword = document.getElementById('password');
  const loginEmailError = document.getElementById('emailError');
  const loginPasswordError = document.getElementById('passwordError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  
  // Password visibility toggle
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPassword.setAttribute('type', type);
      togglePasswordBtn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
  }
  
  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset error messages
    loginEmailError.classList.add('hidden');
    loginPasswordError.classList.add('hidden');
    
    // Validate inputs
    let valid = true;
    
    if (!validateEmail(loginEmail.value)) {
      loginEmailError.classList.remove('hidden');
      valid = false;
    }
    
    if (loginPassword.value.length < 6) {
      loginPasswordError.classList.remove('hidden');
      valid = false;
    }
    
    if (valid) {
      // Attempt login
      const user = users.find(u => u.email === loginEmail.value && u.password === loginPassword.value);
      
      if (user) {
        // Set current user in localStorage
        localStorage.setItem('vastraverse_current_user', JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }));
        
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to home page after delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        // Show error message
        showNotification('Invalid email or password', 'error');
      }
    }
  });
}

// DOM elements for signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const terms = document.getElementById('terms');
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
  
  // Password visibility toggles
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      togglePasswordBtn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
  }
  
  if (toggleConfirmPasswordBtn) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPassword.setAttribute('type', type);
      toggleConfirmPasswordBtn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
  }
  
  // Signup form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset error messages
    firstNameError.classList.add('hidden');
    lastNameError.classList.add('hidden');
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');
    confirmPasswordError.classList.add('hidden');
    
    // Validate inputs
    let valid = true;
    
    if (!firstName.value.trim()) {
      firstNameError.classList.remove('hidden');
      valid = false;
    }
    
    if (!lastName.value.trim()) {
      lastNameError.classList.remove('hidden');
      valid = false;
    }
    
    if (!validateEmail(email.value)) {
      emailError.classList.remove('hidden');
      valid = false;
    }
    
    if (password.value.length < 6) {
      passwordError.classList.remove('hidden');
      valid = false;
    }
    
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.classList.remove('hidden');
      valid = false;
    }
    
    if (!terms.checked) {
      showNotification('Please agree to the Terms of Service', 'error');
      valid = false;
    }
    
    if (valid) {
      // Check if email already exists
      if (users.some(user => user.email === email.value)) {
        showNotification('Email already registered', 'error');
        return;
      }
      
      // Add new user
      const newUser = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        registeredDate: new Date().toISOString()
      };
      
      users.push(newUser);
      
      // Save to localStorage
      localStorage.setItem('vastraverse_users', JSON.stringify(users));
      
      // Set current user in localStorage (auto login)
      localStorage.setItem('vastraverse_current_user', JSON.stringify({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }));
      
      // Show success message
      showNotification('Account created successfully! Redirecting...', 'success');
      
      // Redirect to home page after delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  });
}

// Google authentication
const googleSignInBtn = document.getElementById('googleSignIn');
const googleSignUpBtn = document.getElementById('googleSignUp');

if (googleSignInBtn) {
  googleSignInBtn.addEventListener('click', () => {
    googleAuth('signin');
  });
}

if (googleSignUpBtn) {
  googleSignUpBtn.addEventListener('click', () => {
    googleAuth('signup');
  });
}

function googleAuth(action) {
  // In a real implementation, this would use the Google Identity Services API
  // For this demo, we'll simulate a successful Google login
  
  const mockGoogleUser = {
    firstName: 'Google',
    lastName: 'User',
    email: 'googleuser@gmail.com'
  };
  
  // Check if user exists (for sign in)
  if (action === 'signin') {
    const existingUser = users.find(u => u.email === mockGoogleUser.email);
    
    if (!existingUser) {
      showNotification('No account found with this Google account', 'error');
      return;
    }
  } else {
    // For signup, check if user already exists
    if (users.some(u => u.email === mockGoogleUser.email)) {
      showNotification('This Google account is already registered', 'error');
      return;
    }
    
    // Add new user
    users.push({
      firstName: mockGoogleUser.firstName,
      lastName: mockGoogleUser.lastName,
      email: mockGoogleUser.email,
      googleAuth: true,
      registeredDate: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('vastraverse_users', JSON.stringify(users));
  }
  
  // Set current user in localStorage
  localStorage.setItem('vastraverse_current_user', JSON.stringify(mockGoogleUser));
  
  // Show success message
  showNotification(`Google ${action === 'signin' ? 'sign in' : 'sign up'} successful! Redirecting...`, 'success');
  
  // Redirect to home page after delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// Helper Functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 opacity-0 translate-y-4';
    document.body.appendChild(notification);
  }
  
  // Set notification color based on type
  if (type === 'success') {
    notification.className = notification.className.replace(/bg-\w+-\d+/g, '') + ' bg-green-500 text-white';
  } else if (type === 'error') {
    notification.className = notification.className.replace(/bg-\w+-\d+/g, '') + ' bg-red-500 text-white';
  } else {
    notification.className = notification.className.replace(/bg-\w+-\d+/g, '') + ' bg-blue-500 text-white';
  }
  
  // Set message
  notification.textContent = message;
  
  // Show notification
  setTimeout(() => {
    notification.classList.remove('opacity-0', 'translate-y-4');
  }, 10);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-4');
  }, 3000);
}

// Check if user is logged in and update UI
function updateUIForLoggedInUser(user) {
  // Create navigation links for logged in users
  const loggedInLinks = `
    <a href="#" id="logoutBtn" class="hover:text-pink-500 transition-colors">Logout</a>
  `;
  
  // Update navigation
  const navLinksContainer = document.querySelector('.hidden.md\\:flex.items-center.space-x-8');
  if (navLinksContainer) {
    navLinksContainer.innerHTML += loggedInLinks;
  }
  
  // Update mobile menu
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    const mobileContainer = mobileMenu.querySelector('.container');
    if (mobileContainer) {
      mobileContainer.innerHTML += `
        <a href="profile.html" class="block py-2 hover:text-pink-500 transition-colors">My Profile</a>
        <a href="#" id="mobileLogoutBtn" class="block py-2 hover:text-pink-500 transition-colors">Logout</a>
      `;
    }
  }
  
  // Replace login/signup buttons with user info
  const authButtonsContainer = document.querySelector('.flex.items-center.space-x-4');
  if (authButtonsContainer) {
    authButtonsContainer.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-gray-400">Hello, ${user.firstName}</span>
        <a href="profile.html" class="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors">
          <i class="fas fa-user mr-1"></i> Profile
        </a>
      </div>
    `;
  }
  
  // Add logout functionality
  document.addEventListener('click', (e) => {
    if (e.target.id === 'logoutBtn' || e.target.id === 'mobileLogoutBtn') {
      e.preventDefault();
      logout();
    }
  });
}

function logout() {
  // Remove current user from localStorage
  localStorage.removeItem('vastraverse_current_user');
  
  // Show notification
  showNotification('Logged out successfully', 'success');
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}
