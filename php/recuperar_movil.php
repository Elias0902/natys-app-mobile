<?php
// Copy this file to natys-larence/api/recuperar_movil.php
// Starts the web password recovery: the model emails the code and the link to change it.
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use App\Natys\Models\Autenticator;

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim((string) filter_var($in['email'] ?? '', FILTER_SANITIZE_EMAIL));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => false, 'message' => 'Ingresa un correo válido.']);
    exit;
}

try {
    (new Autenticator())->manejarAccion('recuperar', json_encode(['email' => $email]));
} catch (Throwable $e) {
    error_log('recuperar_movil: ' . $e->getMessage());
    echo json_encode(['status' => false, 'message' => 'Error interno. Intenta de nuevo.']);
    exit;
}

// Same answer whether or not the account exists, so emails cannot be discovered from the app
echo json_encode(['status' => true, 'message' => 'Si el correo está registrado, recibirás las instrucciones.']);
