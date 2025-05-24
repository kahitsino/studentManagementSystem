<?php
require_once 'database.php';

if (isset($_GET['email'])) {
    $email = $conn->real_escape_string($_GET['email']);
    $checkEmail = $conn->query("SELECT id FROM students WHERE email = '$email'");
    
    header('Content-Type: application/json');
    echo json_encode(['taken' => $checkEmail->num_rows > 0]);
    exit();
}

header('HTTP/1.1 400 Bad Request');
echo json_encode(['error' => 'Email parameter missing']);
?>