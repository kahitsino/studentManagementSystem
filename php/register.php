<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // if email already taken
    $email = $conn->real_escape_string($_POST['email']);
    $checkEmail = $conn->query("SELECT id  FROM students WHERE email = '$email'");

    if ($checkEmail->num_rows > 0) {
        header('Location: ../public/register.html?error=email_taken');
        exit();
    }

    $requiredFields = ['fname', 'lname', 'email', 'password', 'level'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            die("Error: $field is required");
        }
    }

    // password if not match
    if ($_POST['password'] !== $_POST['confirm_password']) {
        header('Location: ../public/register.html?error=password_not_match');
        exit();
    }

    $fname = $conn->real_escape_string($_POST['fname']);
    $lname = $conn->real_escape_string($_POST['lname']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $level = $conn->real_escape_string($_POST['level']);
    $program = $conn->real_escape_string($level === 'strand' ? $_POST['strand'] : $_POST['course']);

    $sql = "INSERT INTO students (fname, lname, email, password, level, program) VALUES ('$fname', '$lname', '$email', '$password', '$level', '$program')";

    if ($conn->query($sql) === TRUE) {
        // success register
        header('Location: ../public/studentPage.html');
        exit();
    } else {
        die('Error:' . $sql . '<br>' . $conn->error);
    }
} else {
    header('Location: ../public/register.html');
}
?>