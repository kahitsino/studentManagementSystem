<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $errors = [];
    $presaveData = [];

    $fields = ['fname', 'lname', 'email', 'level', 'strand', 'course'];
    foreach ($fields as $field) {
        $presaveData[$field] = $_POST[$field] ?? '';
    }

    // Check if email already taken
    $email = $conn->real_escape_string($_POST['email']);
    $checkEmail = $conn->query("SELECT students_id FROM students WHERE email = '$email'");

    if ($checkEmail->num_rows > 0) {
        $errors[] = 'email_taken';
    }

    // Check password match
    if ($_POST['password'] !== $_POST['confirm_password']) {
        $errors[] = 'password_not_match';
    }

    // Check required fields
    $required = ['fname', 'lname', 'email', 'password', 'level'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            die("Error: $field is required");
        }
    }

    // Check program selection
    if ($_POST['level'] === 'shs' && empty($_POST['strand'])) {
        $errors[] = 'strand_required';
    } elseif ($_POST['level'] === 'college' && empty($_POST['course'])) {
        $errors[] = 'course_required';
    }
    
    if (!empty($errors)) {
        $redirectUrl = '../public/register.html?error=' . implode(',', $errors);
        foreach ($presaveData as $key => $value) {
            if (!empty($value) && $key !== 'password' && $key !== 'confirm_password') {
                $redirectUrl .= '&' . $key . '=' . urlencode($value);
            }
        }
        header('Location: ' . $redirectUrl);
        exit();
    }

    // Insert new user
    $fname = $conn->real_escape_string($_POST['fname']);
    $lname = $conn->real_escape_string($_POST['lname']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $level = $conn->real_escape_string($_POST['level']);
    $program = $conn->real_escape_string($level === 'shs' ? $_POST['strand'] : $_POST['course']);

    $sql = "INSERT INTO students (fname, lname, email, password, level, program) 
            VALUES ('$fname', '$lname', '$email', '$password', '$level', '$program')";

    if ($conn->query($sql)) {  
        // Start session and store user data including names
        session_start();
        $_SESSION['students_id'] = $conn->insert_id;
        $_SESSION['email'] = $email;
        $_SESSION['fname'] = $fname;
        $_SESSION['lname'] = $lname;
        $_SESSION['loggedin'] = true;
        header('Location: ../public/studentPage.html');
        exit();
    } else {
        die('Error:' . $sql . '<br>' . $conn->error);
    }
} else {
    header('Location: ../public/register.html');
    exit();
}
?>