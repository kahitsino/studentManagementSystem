    // Fixed Login JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                fetch('../php/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'include', // This is important for sessions
                    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '../public/studentPage.html';
                    } else {
                        alert('Login failed: ' + (data.error === 'password' ? 'Invalid password' : 'User not found'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred during login');
                });
            });
        }
    });