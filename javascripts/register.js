/**
 * Registration Form Handler - Fixed Version
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const form = document.getElementById('enrollmentForm');
    const emailField = document.querySelector('[name="email"]');
    const levelSelect = document.getElementById('level');
    
    // Set up event listeners
    if (levelSelect) levelSelect.addEventListener('change', showOptions);
    if (form) form.addEventListener('submit', validateForm);
    
    // Special handling for email field
    if (emailField) {
        emailField.addEventListener('input', function() {
            // Clear any existing email error when typing
            const emailError = document.getElementById('emailTakenError');
            if (this.classList.contains('is-invalid') && emailError) {
                this.classList.remove('is-invalid');
                emailError.style.display = 'none';
                
                // Remove error from URL if present
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('error')) {
                    const errors = urlParams.get('error').split(',').filter(e => e !== 'email_taken');
                    if (errors.length > 0) {
                        urlParams.set('error', errors.join(','));
                    } else {
                        urlParams.delete('error');
                    }
                    window.history.replaceState({}, '', `?${urlParams.toString()}`);
                }
            }
            
            // Add real-time email validation
            if (this.value.length > 3 && this.value.includes('@')) {
                checkEmailAvailability(this.value);
            }
        });
    }
    
    // Restore form state from URL parameters
    restoreFormState();
});

// New function to check email availability in real-time
function checkEmailAvailability(email) {
    fetch('../php/check_email.php?email=' + encodeURIComponent(email))
        .then(response => response.json())
        .then(data => {
            const emailField = document.querySelector('[name="email"]');
            const emailError = document.getElementById('emailTakenError');
            
            if (data.taken && emailField && emailError) {
                emailField.classList.add('is-invalid');
                emailError.style.display = 'block';
            } else if (emailField && emailError) {
                emailField.classList.remove('is-invalid');
                emailError.style.display = 'none';
            }
        })
        .catch(error => console.error('Error checking email:', error));
}

function showOptions() {
    const level = document.getElementById('level').value;
    const strandDiv = document.getElementById('strand-options');
    const courseDiv = document.getElementById('course-options');
    
    strandDiv?.classList.add('d-none');
    courseDiv?.classList.add('d-none');
    
    if (level === 'shs') {
        strandDiv?.classList.remove('d-none');
        document.getElementById('strand')?.setAttribute('required', '');
    } else if (level === 'college') {
        courseDiv?.classList.remove('d-none');
        document.getElementById('course')?.setAttribute('required', '');
    }
}

function validateForm(event) {
    event.preventDefault();
    const form = event.target;
    
    // Clear previous errors
    resetErrorStates();
    
    // Validate all fields
    let isValid = true;
    
    // Password match validation
    const password = form.querySelector('[name="password"]');
    const confirmPassword = form.querySelector('#confirm_password');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        password.classList.add('is-invalid');
        confirmPassword.classList.add('is-invalid');
        document.getElementById('passwordMismatchError').style.display = 'block';
        isValid = false;
    }
    
    // Program selection validation
    const level = document.getElementById('level').value;
    if (level === 'shs' && !document.getElementById('strand').value) {
        document.getElementById('strand').classList.add('is-invalid');
        isValid = false;
    } else if (level === 'college' && !document.getElementById('course').value) {
        document.getElementById('course').classList.add('is-invalid');
        isValid = false;
    }
    
    // Submit if valid
    if (isValid && form.checkValidity()) {
        form.submit();
    } else {
        form.classList.add('was-validated');
    }
}

function restoreFormState() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Restore field values
    ['fname', 'lname', 'email', 'level', 'strand', 'course'].forEach(field => {
        const element = document.querySelector(`[name="${field}"]`) || document.getElementById(field);
        if (element && urlParams.has(field)) {
            element.value = urlParams.get(field);
        }
    });
    
    // Show appropriate options
    if (urlParams.has('level')) {
        showOptions();
    }
    
    // Show errors from URL
    const errors = urlParams.get('error')?.split(',') || [];
    
    // Email taken error
    if (errors.includes('email_taken')) {
        const emailField = document.querySelector('[name="email"]');
        const emailError = document.getElementById('emailTakenError');
        if (emailField && emailError) {
            emailField.classList.add('is-invalid');
            emailError.style.display = 'block';
            emailField.focus();
        }
    }
    
    // Password mismatch error
    if (errors.includes('password_not_match')) {
        const passwordField = document.querySelector('[name="password"]');
        const confirmField = document.getElementById('confirm_password');
        const passwordError = document.getElementById('passwordMismatchError');
        if (passwordField && confirmField && passwordError) {
            passwordField.classList.add('is-invalid');
            confirmField.classList.add('is-invalid');
            passwordError.style.display = 'block';
        }
    }
    
    // Program selection errors
    if (errors.includes('strand_required')) {
        document.getElementById('shs')?.classList.add('is-invalid');
    }
    if (errors.includes('course_required')) {
        document.getElementById('college')?.classList.add('is-invalid');
    }
}

function resetErrorStates() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

// Real-time password validation
const confirmPassword = document.getElementById('confirm_password');
if (confirmPassword) {
    confirmPassword.addEventListener('input', function() {
        const password = document.querySelector('[name="password"]');
        const errorMsg = document.getElementById('passwordMismatchError');
        
        if (password && errorMsg) {
            if (this.value !== password.value) {
                password.classList.add('is-invalid');
                this.classList.add('is-invalid');
                errorMsg.style.display = 'block';
            } else {
                password.classList.remove('is-invalid');
                this.classList.remove('is-invalid');
                errorMsg.style.display = 'none';
            }
        }
    });
}