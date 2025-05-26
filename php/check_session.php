<?php
session_start();

header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$response = [
    'loggedin' => false,
    'email' => null,
    'fname' => null,
    'lname' => null,
    'fullname' => null
];

if (isset($_SESSION['email']) && isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    if (filter_var($_SESSION['email'], FILTER_VALIDATE_EMAIL)) {
        $response = [
            'loggedin' => true,
            'email' => $_SESSION['email'],
            'fname' => $_SESSION['fname'] ?? '',
            'lname' => $_SESSION['lname'] ?? '',
            'fullname' => ($_SESSION['fname'] ?? '') . ' ' . ($_SESSION['lname'] ?? '')
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>