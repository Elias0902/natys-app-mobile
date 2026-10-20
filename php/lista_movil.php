<?php
// Copy this file to natys-larence/api/lista_movil.php
// Generic JSON list for the mobile app: ?modulo=pedidos  ->  Model::manejarAccion('consultar')
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

$modulo = $_GET['modulo'] ?? '';
if (!isset($map[$modulo])) {
    echo json_encode(['status' => false, 'message' => 'Módulo no válido']);
    exit;
}

try {
    $class = 'App\\Natys\\Models\\' . $map[$modulo];
    $modelo = new $class();
    $res = $modelo->manejarAccion('consultar', null);
    $data = $res['data'] ?? [];
    // Never send password hashes to the app
    foreach ($data as &$row) {
        if (is_array($row)) unset($row['password_usuario'], $row['password']);
    }
    echo json_encode(['status' => true, 'data' => array_values($data)]);
} catch (Throwable $e) {
    echo json_encode(['status' => false, 'message' => 'Error al consultar']);
}
