<?php
// Copy this file to natys-larence/api/crud_movil.php
// CRUD for the mobile app: POST ?modulo=pedidos&accion=registrar|modificar|eliminar  (JSON body)
//   -> Model::manejarAccion('<accion>', json)
require_once __DIR__ . '/_movil_comun.php';

movil_exigir_sesion();

// App action => permission name in the `permisos` table (the models use the same action names)
const ACCIONES = [
    'registrar' => 'Agregar',
    'modificar' => 'Modificar',
    'eliminar'  => 'Eliminar',
];

$modulo = $_GET['modulo'] ?? '';
$accion = $_GET['accion'] ?? '';
if (!isset(MOVIL_MODULOS[$modulo]) || !isset(ACCIONES[$accion])) movil_salir(400, 'Módulo o acción no válidos');
[$modelo_nombre, $modulo_permiso] = MOVIL_MODULOS[$modulo];

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) movil_salir(400, 'Datos no válidos');

try {
    movil_exigir_permiso($modulo_permiso, ACCIONES[$accion]);

    $class = 'App\\Natys\\Models\\' . $modelo_nombre;
    $res = (new $class())->manejarAccion($accion, json_encode($data));
    $ok = is_array($res) ? ($res['status'] ?? true) : (bool) $res;
    echo json_encode([
        'status'  => (bool) $ok,
        'message' => is_array($res) ? ($res['msj'] ?? $res['message'] ?? '') : '',
        'data'    => is_array($res) ? ($res['data'] ?? null) : null,
    ]);
} catch (Throwable $e) {
    error_log('crud_movil: ' . $e->getMessage());
    echo json_encode(['status' => false, 'message' => 'Error al procesar la operación']);
}
