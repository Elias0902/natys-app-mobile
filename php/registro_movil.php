<?php
// Copy this file to natys-larence/api/registro_movil.php
// Public sign up for the mobile app: same steps as Registrar() in AutenticatorController, in JSON.
// The account stays inactive until the email link is confirmed.
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use App\Natys\Models\Autenticator;
use App\Natys\Models\Cliente;
use App\Natys\Models\Usuario;

function responder(bool $ok, string $mensaje): void {
    echo json_encode(['status' => $ok, 'message' => $mensaje]);
    exit;
}

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$texto = fn($k) => trim((string) filter_var($in[$k] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

$email     = trim((string) filter_var($in['email'] ?? '', FILTER_SANITIZE_EMAIL));
$password  = $texto('password');
$username  = $texto('username');
$rif       = $texto('rif');
$nombre    = $texto('nombre');
$tipo_id   = $texto('tipo_id');
$tlf       = $texto('tlf');
$direccion = $texto('direccion');
$sector    = $texto('sector');

if ($email === '' || $password === '' || $username === '' || $rif === '' || $nombre === '' || $tlf === '' || $direccion === '') {
    responder(false, 'Todos los campos son obligatorios.');
}
if (!ctype_digit($rif)) responder(false, 'La cédula o RIF solo debe tener números.');
if (!in_array($tipo_id, ['V', 'J', 'G', 'E'], true)) responder(false, 'Tipo de documento no válido.');
if (!in_array($sector, ['Norte', 'Sur', 'Este', 'Oeste'], true)) responder(false, 'Selecciona un sector.');

// Role is fixed here: public sign up can only create clients
$usuario_json = json_encode(['username' => $username, 'email' => $email, 'password' => $password, 'rol' => 3]);

try {
    $resultado = (new Autenticator())->manejarAccion('registrar', $usuario_json);
    if (empty($resultado['status'])) responder(false, $resultado['msj'] ?? 'Error al registrar usuario.');

    $usuarioModelo = new Usuario();
    $res_cliente = (new Cliente())->manejarAccion('registrar', json_encode([
        'id'        => $rif,
        'tipo_id'   => $tipo_id,
        'email'     => $email,
        'tipo'      => null,
        'nombre'    => $nombre,
        'tlf'       => $tlf,
        'direccion' => $direccion,
        'imagen'    => 'assets/img/perfiles/default.png',
        'estado'    => 'Pendiente',
        'sector'    => $sector,
    ]));

    if (empty($res_cliente['status'])) {
        // Keep both databases consistent, like the web flow
        try {
            $usuarioModelo->manejarAccion('eliminarUser', $usuario_json);
        } catch (Throwable $e) {
            error_log('registro_movil (eliminarUser): ' . $e->getMessage());
        }
        responder(false, 'Error al registrar cliente: ' . ($res_cliente['msj'] ?? ''));
    }

    try {
        $usuarioModelo->manejarAccion('vincularUser', json_encode(['username' => $username, 'id_cliente' => $rif]));
    } catch (Throwable $e) {
        error_log('registro_movil (vincularUser): ' . $e->getMessage());
    }

    if (!empty($resultado['mail_failed'])) {
        responder(true, 'Cuenta creada, pero no pudimos enviar el correo de activación. Contacta a soporte.');
    }
    responder(true, 'Cuenta creada. Revisa tu correo para activarla.');
} catch (Throwable $e) {
    error_log('registro_movil: ' . $e->getMessage());
    responder(false, 'Error interno. Intenta de nuevo.');
}
