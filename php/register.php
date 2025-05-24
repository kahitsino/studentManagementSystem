<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $errors = [];
    $presaveData = [];

    $fields = ['fname', 'lname', 'email', 'level', 'program'];
    foreach ($fields as $field) {
        $presaveData[$field] = $_POST[$field] ?? '';
    }

    // if email already taken
    $email = $conn->real_escape_string($_POST['email']);
    $checkEmail = $conn->query("SELECT id FROM students WHERE email = '$email'");

    if ($checkEmail->num_rows > 0) {
        $errors[] = 'email_taken';
    }

    // password if not match
    if ($_POST['password'] !== $_POST['confirm_password']) {
        $errors[] = 'password_not_match';
    }

    $required = ['fname', 'lname', 'email', 'password', 'level'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            die("Error: $field is required");
        }
    }

    if ($_POST['level'] === 'strand' && empty($_POST['strand'])) {
        $errors[] = 'strand_required';
    } elseif ($_POST['level'] === 'course' && empty($_POST['course'])) {
        $errors[] = 'course_required';
    }
    
    if (!empty($errors)) {
        // save all input data in fields
        $redirectUrl = '../public/register.html?error=' . implode(',', $errors);
        foreach ($presaveData as $key => $value) {
            if (!empty($value) && $key !== 'password' && $key !== 'confirm_password') {
                $redirectUrl .= '&' .$key . '=' . urlencode($value);
            }
        }
        header('Location: ' . $redirectUrl);
        exit();
    }

    $fname = $conn->real_escape_string($_POST['fname']);
    $lname = $conn->real_escape_string($_POST['lname']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $level = $conn->real_escape_string($_POST['level']);
    $program = $conn->real_escape_string($level === 'strand' ? $_POST['strand'] : $_POST['course']);

    $sql = "INSERT INTO students (fname, lname, email, password, level, program) VALUES ('$fname', '$lname', '$email', '$password', '$level', '$program')";

    if ($conn->query($sql)) {  
        session_start();
        $_SESSION['email'] = $email;
        $_SESSION['loggedin'] = true;
        // success register
        header('Location: ../public/index.html');
        exit();
    } else {
        die('Error:' . $sql . '<br>' . $conn->error);
    }
} else {
    header('Location: ../public/register.html');
    exit();
}
?>