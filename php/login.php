<?php
require_once 'database.php';
session_start();

// Debug log setup
$debug_log = "=== Login Attempt ===\n";
$debug_log .= "Time: " . date('Y-m-d H:i:s') . "\n";

$response = ['success' => false, 'error' => ''];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $conn->real_escape_string($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $debug_log .= "Email Input: $email\n";
    $debug_log .= "Password Length: " . strlen($password) . "\n";

    // Check if email exists and get user data including names
    $query = "SELECT students_id, email, fname, lname, password FROM students WHERE email = '$email'";
    $debug_log .= "Query: $query\n";
    
    $result = $conn->query($query);
    $debug_log .= "Query Result Rows: " . $result->num_rows . "\n";
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $debug_log .= "User Found: ID=" . $user['students_id'] . ", Email=" . $user['email'] . "\n";
        $debug_log .= "User Names: " . $user['fname'] . " " . $user['lname'] . "\n";
        $debug_log .= "Stored Password Hash: " . $user['password'] . "\n";
        
        // Verify password
        $password_check = password_verify($password, $user['password']);
        $debug_log .= "Password Verification: " . ($password_check ? 'SUCCESS' : 'FAILED') . "\n";
        
        if ($password_check) {
            // Store all user data in session
            $_SESSION['students_id'] = $user['students_id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['fname'] = $user['fname'];
            $_SESSION['lname'] = $user['lname'];
            $_SESSION['loggedin'] = true;
            $response['success'] = true;
            
            $debug_log .= "Login SUCCESS - Session Variables Set:\n";
            $debug_log .= "students_id: " . $_SESSION['students_id'] . "\n";
            $debug_log .= "email: " . $_SESSION['email'] . "\n";
            $debug_log .= "fname: " . $_SESSION['fname'] . "\n";
            $debug_log .= "lname: " . $_SESSION['lname'] . "\n";
        } else {
            $response['error'] = 'password';
            $debug_log .= "Login FAILED: Invalid password\n";
        }
    } else {
        $response['error'] = 'user';
        $debug_log .= "Login FAILED: User not found\n";
    }
} else {
    $debug_log .= "Invalid request method: " . $_SERVER['REQUEST_METHOD'] . "\n";
}

// Write debug log to file
$debug_log .= "Response: " . json_encode($response) . "\n";
$debug_log .= "=== End Login Attempt ===\n\n";
file_put_contents('../debug_login.txt', $debug_log, FILE_APPEND | LOCK_EX);

header('Content-Type: application/json');
echo json_encode($response);
?>