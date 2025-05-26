// Updated protectedPages.js with name display and logout

// Session management
function checkSession() {
    fetch('../php/check_session.php', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Session data received:', data); // Debug log
        
        const currentPage = window.location.pathname.split('/').pop();
        
        // Redirect to login if not logged in and on protected page
        if (!data.loggedin && protectedPages.includes(currentPage)) {
            window.location.href = '../public/';
            return;
        }
        
        if (data.loggedin) {
            // Clean up fullname - remove extra spaces
            const cleanFullname = data.fullname ? data.fullname.trim() : '';
            
            // Update welcome message with user's first name
            const welcomeMsg = document.getElementById('welcomeMessage');
            if (welcomeMsg) {
                if (data.fname && data.fname.trim()) {
                    welcomeMsg.textContent = `Hello, ${data.fname.trim()}`;
                } else {
                    welcomeMsg.textContent = 'Hello';
                }
            }
            
            // Update full welcome message
            const fullWelcomeMsg = document.getElementById('fullWelcomeMessage');
            if (fullWelcomeMsg) {
                if (cleanFullname) {
                    fullWelcomeMsg.textContent = `Welcome back, ${cleanFullname}! You have successfully logged in.`;
                } else if (data.fname && data.fname.trim()) {
                    fullWelcomeMsg.textContent = `Welcome back, ${data.fname.trim()}! You have successfully logged in.`;
                } else {
                    fullWelcomeMsg.textContent = 'Welcome! You have successfully logged in.';
                }
            }
            
            // Update any other user-specific elements
            const userEmail = document.getElementById('userEmail');
            if (userEmail && data.email) {
                userEmail.textContent = data.email;
            }
            
            const userFullName = document.getElementById('userFullName');
            if (userFullName) {
                if (cleanFullname) {
                    userFullName.textContent = cleanFullname;
                } else if (data.fname && data.fname.trim()) {
                    userFullName.textContent = data.fname.trim();
                } else {
                    userFullName.textContent = 'Name not available';
                }
            }
            
            // Show protected content
            const protectedContent = document.querySelector('.protected-content');
            if (protectedContent) protectedContent.style.display = 'block';
            
            // Store user data globally for other scripts to use
            window.currentUser = {
                email: data.email,
                fname: data.fname ? data.fname.trim() : '',
                lname: data.lname ? data.lname.trim() : '',
                fullname: cleanFullname
            };
            
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('userDataLoaded', { 
                detail: window.currentUser 
            }));
        }
    })
    .catch(error => {
        console.error('Session check failed:', error);
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = '../public/';
        }
    });
}

// Enhanced logout function with confirmation
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Show loading state if logout button exists
        const logoutBtn = document.querySelector('[onclick="logout()"]');
        if (logoutBtn) {
            logoutBtn.textContent = 'Logging out...';
            logoutBtn.disabled = true;
        }
        
        fetch('../php/logout.php', {
            credentials: 'include',
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear any stored user data
                window.currentUser = null;
                
                // Optional: Show success message briefly
                if (logoutBtn) {
                    logoutBtn.textContent = 'Logged out! Redirecting...';
                }
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '../public/';
                }, 500);
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Force redirect even if there's an error
            window.location.href = '../public/';
        });
    }
}

// Function to get current user data
function getCurrentUser() {
    return window.currentUser || null;
}

// Function to update user display elements
function updateUserDisplay(userData) {
    const cleanFullname = userData.fullname ? userData.fullname.trim() : '';
    const cleanFirstname = userData.fname ? userData.fname.trim() : '';
    
    const elements = {
        'welcomeMessage': cleanFirstname ? `Hello, ${cleanFirstname}` : 'Hello',
        'fullWelcomeMessage': cleanFullname ? `Welcome back, ${cleanFullname}!` : (cleanFirstname ? `Welcome back, ${cleanFirstname}!` : 'Welcome!'),
        'userEmail': userData.email || '',
        'userFullName': cleanFullname || cleanFirstname || 'Name not available',
        'userName': cleanFullname || cleanFirstname || userData.email || ''
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Array of protected pages - add your pages here
const protectedPages = [
    'studentPage.html', 
    'home.html', 
    'gallery.html', 
    'messages.html',
    'profile.html',
    'courses.html'
];

// Initialize session check on protected pages
const currentPage = window.location.pathname.split('/').pop();
if (protectedPages.includes(currentPage)) {
    document.addEventListener('DOMContentLoaded', function() {
        checkSession();
        
        // Set up periodic session checking
        setInterval(checkSession, 300000); // Check every 5 minutes
        
        // Add logout event listeners to any logout buttons
        document.querySelectorAll('.logout-btn, [data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', logout);
        });
    });
}

// Listen for user data loaded event
window.addEventListener('userDataLoaded', function(event) {
    updateUserDisplay(event.detail);
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkSession,
        logout,
        getCurrentUser,
        updateUserDisplay
    };
}