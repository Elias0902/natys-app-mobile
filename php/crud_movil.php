<?php
// Copy this file to natys-larence/api/crud_movil.php
// CRUD for the mobile app: POST ?modulo=pedidos&accion=registrar|modificar|eliminar  (JSON body)
//   -> Model::manejarAccion('<accion del modelo>', $data)
// Check that the action names below match the ones your models use in manejarAccion().
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

if (!isset($_SESSION['s_usuario'])) {
    http_response_code(401);
    echo json_encode(['status' => false, 'message' => 'Sesión no iniciada']);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

$map = [
    'clientes'       => 'Cliente',
    'proveedores'    => 'Proveedor',
    'categorias'     => 'Categoria',
    'productos'      => 'Producto',
    'materias'       => 'MateriaPrima',
    'producciones'   => 'Produccion',
    'pedidos'        => 'Pedido',
    'entregas'       => 'Entrega',
    'compras'        => 'Compra',
    'promociones'    => 'Promocion',
    'pagos'          => 'Pago',
    'cobrar'         => 'CuentaCobrar',
    'pagar'          => 'CuentaPagar',
    'tipos_clientes' => 'TipoCliente',
    'notificaciones' => 'Notificacion',
    'tasa'           => 'Tasa',
    'moneda'         => 'Moneda',
    'unidades'       => 'UnidadMedida',
    'camiones'       => 'Camion',
    'roles'          => 'Rol',
    'modulos'        => 'Modulo',
    'usuarios'       => 'Usuario',
    'bitacora'       => 'Bitacora',
    'respaldos'      => 'Respaldo',
];

// App action  ->  model action (adjust if your models use other names)
$acciones = [
    'registrar' => 'agregar',
    'modificar' => 'actualizar',
    'eliminar'  => 'eliminar',
];

$modulo = $_GET['modulo'] ?? '';
$accion = $_GET['accion'] ?? '';
if (!isset($map[$modulo]) || !isset($acciones[$accion])) {
    echo json_encode(['status' => false, 'message' => 'Módulo o acción no válidos']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    echo json_encode(['status' => false, 'message' => 'Datos no válidos']);
    exit;
}

try {
    $class = 'App\\Natys\\Models\\' . $map[$modulo];
    $modelo = new $class();
    $res = $modelo->manejarAccion($acciones[$accion], $data);
    $ok = is_array($res) ? ($res['status'] ?? true) : (bool) $res;
    echo json_encode([
        'status'  => (bool) $ok,
        'message' => is_array($res) ? ($res['msj'] ?? $res['message'] ?? '') : '',
        'data'    => is_array($res) ? ($res['data'] ?? null) : null,
    ]);
} catch (Throwable $e) {
    echo json_encode(['status' => false, 'message' => 'Error al procesar la operación']);
}
