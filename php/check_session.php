<?php
session_start();

// Strict session validation
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$response = [
    'loggedin' => false,
    'email' => null
];

if (isset($_SESSION['email'], $_SESSION['loggedin']) === true) {
    if (filter_var($_SESSION['email'], FILTER_VALIDATE_EMAIL) && $_SESSION['loggedin'] === true) {
        
        $response = [
            'loggedin' => true,
            'email' => filter_var($_SESSION['email'], FILTER_SANITIZE_EMAIL)
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>