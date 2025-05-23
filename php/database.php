<?php
$host = 'localhost';
$db = 'student_db';
$user = 'root';
$pass = '';

if ($conn = new mysqli($host, $user, $pass, $db)) {
    // Connection successful
} else {
    die("Connection failed: " . $conn->connect_error);
}
?>