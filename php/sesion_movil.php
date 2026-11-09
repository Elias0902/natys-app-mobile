<?php
// Copy this file to natys-larence/api/sesion_movil.php
// Lets the app resume when it is opened again. Answers 200 because "no session" is a normal result here.
require_once __DIR__ . '/_movil_comun.php';

if (!isset($_SESSION['s_usuario'])) {
    echo json_encode(['status' => false]);
    exit;
}

echo json_encode(['status' => true, 'user' => movil_usuario()]);
