// show options based on the selected value
function showOptions() {
    console.log('showOptions called');
    const option = document.getElementById("level").value;
    console.log('Selected option:', option)

    const strandDiv = document.getElementById("strand-options");
    const courseDiv = document.getElementById("course-options");
    const strandSelect = document.getElementById('strand')
    const courseSelect = document.getElementById('course')


    strandDiv.classList.add('d-none');
    courseDiv.classList.add('d-none');
    strandSelect.removeAttribute('required');
    courseSelect.removeAttribute('required')

    if (level.value === 'strand') {
        strandDiv.classList.remove('d-none');
        strandSelect.setAttribute('required', '');
    } else if (level.value === 'course') {
        courseDiv.classList.remove('d-none');
        courseSelect.setAttribute('required', '');
    }
}

document.getElementById('enrollmentForm').addEventListener('submit', function(event) {
    const form = this;

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        event.preventDefault();
        event.stopPropagation();
    }

    const level = document.getElementById('level');
    if (level.value === 'strand') {
        const strand = document.getElementById('strand');
        if (!stand.value) {
            strand.classList.add('is-invalid');
            event.preventDefault();
            event.stopPropagation();
        }
    } else if (level.value === 'course') {
        const course = document.getElementById('course');
        if (!course.vale) {
            course.classList.add('is-invalid');
            event.preventDefault();
            event.stopPropagation();
        }
    }

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add('was-validated');
}, false)

document.querySelectorAll('.form-control, .form-select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.id === 'confirm_password') {
            const password = document.getElementById('password');
            if (input.value === password.value) {
                input.classList.remove('is-invalid');
            }
        } else {
            input.classList.remove('is-invalid');
        }
    })
})

// password miss match error
// Check for error messages in URL and display them
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
            
    const emailError = document.getElementById('emailTakenError');
    const passwordError = document.getElementById('passwordMissmatchError');
            
    if (error === 'email_taken') {
        emailError.style.display = 'block';
        // Highlight the email field
        document.getElementById('email').classList.add('is-invalid');
    } else {
        emailError.style.display = 'none';
    }

    if (error === 'password_not_match') {
        passwordError.style.display = 'block';
        // Highlight the password fields
        document.getElementById('password').classList.add('is-invalid');
        document.getElementById('confirm_password').classList.add('is-invalid');
    } else {
        passwordError.style.display = 'none';
    }
});