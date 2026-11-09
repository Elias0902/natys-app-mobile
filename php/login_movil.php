<?php
// Copy this file to natys-larence/api/login_movil.php
// JSON login for the mobile app (same checks as AutenticatorController, without captcha/redirects).
require_once __DIR__ . '/_movil_comun.php';

use App\Natys\Models\Autenticator;
use App\Natys\Models\Cliente;

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$username = filter_var($in['username'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_var($in['password'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

if ($username === '' || $password === '') {
    echo json_encode(['status' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

$modelo = new Autenticator();

// Same lockout after failed attempts as the web login
$bloqueo = $modelo->Verificar_Bloqueo_Login($username);
if (!empty($bloqueo['bloqueado'])) {
    echo json_encode(['status' => false, 'message' => 'Cuenta bloqueada temporalmente. Intenta en ' . $bloqueo['restante_min'] . ' minuto(s).']);
    exit;
}

$res = $modelo->manejarAccion('ingresar', json_encode(['username' => $username, 'password' => $password]));

if (empty($res['status']) || !password_verify($password, $res['data']['password_usuario'])) {
    $bloqueo = $modelo->Registrar_Intento_Fallido($username);
    $mensaje = !empty($bloqueo['bloqueado'])
        ? 'Demasiados intentos fallidos. Cuenta bloqueada por ' . $bloqueo['restante_min'] . ' minuto(s).'
        : 'Usuario o contraseña incorrectos.';
    echo json_encode(['status' => false, 'message' => $mensaje]);
    exit;
}

$modelo->Limpiar_Intentos_Login($username);
session_regenerate_id(true);

$u = $res['data'];

// Accounts without a linked client are resolved by email, like the web login
if (empty($u['id_cliente'])) {
    try {
        $cliente = (new Cliente())->manejarAccion('obtenerPorEmail', json_encode(['email' => $u['email_usuario']]));
        if (!empty($cliente['data']['id_cliente'])) $u['id_cliente'] = $cliente['data']['id_cliente'];
    } catch (Throwable $e) {
        error_log('login_movil: ' . $e->getMessage());
    }
}

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
    'modulos'        => movil_modulos_visibles(), // the app builds its menu from this list
]]);
