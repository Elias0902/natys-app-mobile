<?php
// Copy this file to natys-larence/api/logout_movil.php
// Ends the PHP session opened by login_movil.php.
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

echo json_encode(['status' => true]);
