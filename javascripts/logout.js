// Logout function
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            fetch('../php/logout.php', {
                credentials: 'include',
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '../public/';
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                // Force redirect even if there's an error
                window.location.href = '../public/';
            });
        }
    }
