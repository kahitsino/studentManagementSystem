    // Updated protectedPages.js functionality
    function checkSession() {
        fetch('../php/check_session.php', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const currentPage = window.location.pathname.split('/').pop();
            const protectedPages = ['studentPage.html', 'home.html', 'gallery.html', 'messages.html'];
            
            if (!data.loggedin && protectedPages.includes(currentPage)) {
                window.location.href = '../public/';
                return;
            }
            
            if (data.loggedin) {
                // Update welcome message in navbar
                const welcomeMsg = document.getElementById('welcomeMessage');
                if (welcomeMsg && data.fullname) {
                    welcomeMsg.textContent = `Hello, ${data.fname}`;
                }
                
                // Update full welcome message
                const fullWelcomeMsg = document.getElementById('fullWelcomeMessage');
                if (fullWelcomeMsg && data.fullname) {
                    fullWelcomeMsg.textContent = `Welcome back, ${data.fullname.trim()}! You have successfully logged in.`;
                }
                
                // Store user data globally
                window.currentUser = {
                    email: data.email,
                    fname: data.fname,
                    lname: data.lname,
                    fullname: data.fullname
                };
            }
    })}