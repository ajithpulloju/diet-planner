const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');

registerTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.add('toggled');
});

loginTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.remove('toggled');
});

// Configure Backend URL
const API_URL = 'http://localhost:3001/api/auth';

// Register Handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (data.status === 'success') {
            alert('Signup successful! You can now log in.');
            document.getElementById('register-form').reset();
            authWrapper.classList.remove('toggled'); // switch to login
        } else {
            alert(data.message || 'Signup failed. Please try again.');
        }
    } catch (err) {
        console.error('Signup Error:', err);
        alert('Unable to connect to server. Ensure the backend is running.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Login Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.status === 'success') {
            // Save tokens exactly as the main app expects: nu_user and nu_token
            localStorage.setItem('nu_token', data.token);
            localStorage.setItem('nu_user', JSON.stringify(data.user));
            
            alert('Login successful!');
            // Redirect back to main page or specific route
            window.location.href = 'http://localhost:3001/elite-diet-planner-v5.html';
        } else {
            alert(data.message || 'Invalid credentials');
        }
    } catch (err) {
        console.error('Login Error:', err);
        alert('Unable to connect to server. Ensure the backend is running.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});