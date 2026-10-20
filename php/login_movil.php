<?php
// Copy this file to natys-larence/api/login_movil.php
// JSON login for the mobile app (same checks as AutenticatorController, without captcha/redirects).
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use App\Natys\Models\Autenticator;

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$username = filter_var($in['username'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_var($in['password'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

if ($username === '' || $password === '') {
    echo json_encode(['status' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

$modelo = new Autenticator();
$res = $modelo->manejarAccion('ingresar', json_encode(['username' => $username, 'password' => $password]));

if (empty($res['status']) || !password_verify($password, $res['data']['password_usuario'])) {
    echo json_encode(['status' => false, 'message' => 'Usuario o contraseña incorrectos.']);
    exit;
}

$u = $res['data'];
$_SESSION['s_usuario'] = [
    'id_usuario'     => $u['id_usuario'],
    'nombre_usuario' => $u['nombre_usuario'],
    'email_usuario'  => $u['email_usuario'],
    'id_rol_usuario' => $u['id_rol_usuario'],
    'rol_usuario'    => $u['nombre_rol'],
    'img_usuario'    => $u['avatar'] ?? null,
    'id_cliente'     => $u['id_cliente'] ?? null,
];

echo json_encode(['status' => true, 'user' => [
    'id_usuario'     => $u['id_usuario'],
    'nombre_usuario' => $u['nombre_usuario'],
    'email_usuario'  => $u['email_usuario'],
    'rol_usuario'    => $u['nombre_rol'],
]]);
