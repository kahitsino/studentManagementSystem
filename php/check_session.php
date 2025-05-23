<?php
session_start();

// Strict session validation
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$response = [
    'loggedin' => false,
    'username' => null
];

if (isset($_SESSION['username'], $_SESSION['password'])) {
    if (filter_var($_SESSION['email'], FILTER_VALIDATE_EMAIL) &&
        !empty(trim($_SESSION['password']))) {
        
        $response = [
            'loggedin' => true,
            'email' => filter_var($_SESSION['email'])
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>