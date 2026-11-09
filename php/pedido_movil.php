<?php
// Copy this file to natys-larence/api/pedido_movil.php
// Creates an order from the mobile cart. Client, prices, total, state and date are decided here,
// never taken from the app. Pedido::Registrar_Pedido applies the 100-300 boxes rule, stock and the receivable.
require_once __DIR__ . '/_movil_comun.php';

use App\Natys\Models\Cliente;
use App\Natys\Models\Notificacion;
use App\Natys\Models\Pedido;
use App\Natys\Models\Producto;

date_default_timezone_set('America/Caracas');
movil_exigir_sesion();

$rol = (int) $_SESSION['s_usuario']['id_rol_usuario'];
if (!in_array($rol, [3, 4], true)) movil_exigir_permiso('Pedidos', 'Agregar');

$id_cliente = (int) ($_SESSION['s_usuario']['id_cliente'] ?? 0);
if ($id_cliente <= 0) movil_salir(400, 'Tu cuenta no tiene un cliente asociado.');

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in) || empty($in['items']) || !is_array($in['items'])) movil_salir(400, 'El carrito está vacío.');

$digitos = preg_replace('/\D/', '', (string) ($in['telefono'] ?? ''));
if (strlen($digitos) !== 11) movil_salir(400, 'Ingresa un teléfono válido. Ej: 0412-1234567');
$telefono = substr($digitos, 0, 4) . '-' . substr($digitos, 4);

$texto = fn($k) => trim((string) filter_var($in[$k] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

try {
    $precios_vigentes = array_column((new Producto())->manejarAccion('consultar', null)['data'] ?? [], 'precio_venta', 'id_producto');

    $productos = $cantidades = $precios = [];
    $total = 0;
    foreach ($in['items'] as $item) {
        $id = (int) ($item['id_producto'] ?? 0);
        $cantidad = filter_var($item['cantidad'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($cantidad === false) movil_salir(400, 'Hay una cantidad no válida en el carrito.');
        if (!isset($precios_vigentes[$id])) movil_salir(400, 'Uno de los productos ya no está disponible.');

        $productos[]  = $id;
        $cantidades[] = $cantidad;
        $precios[]    = (float) $precios_vigentes[$id];
        $total       += round($cantidad * (float) $precios_vigentes[$id], 2);
    }

    // Credit days come from the client type and set the due date of the receivable
    $cliente = (new Cliente())->manejarAccion('obtenerPorEmail', json_encode(['email' => $_SESSION['s_usuario']['email_usuario']]));

    $res = (new Pedido())->manejarAccion('registrar', json_encode([
        'cliente_id'        => $id_cliente,
        'dias_credito'      => (int) ($cliente['data']['dias_credito'] ?? 0),
        'fecha'             => date('Y-m-d'),
        'estado'            => 1, // Pendiente
        'telefono'          => $telefono,
        'direccion_entrega' => $texto('direccion'),
        'observaciones'     => $texto('observaciones'),
        'total'             => $total,
        'productos'         => $productos,
        'cantidades'        => $cantidades,
        'precios'           => $precios,
    ]));

    if (($res['status'] ?? false) !== true) {
        echo json_encode(['status' => false, 'message' => $res['msj'] ?? 'No se pudo registrar el pedido.']);
        exit;
    }

    // New-order or low-stock notification, same as PedidoController. The order is already saved if this fails.
    if (!empty($res['notif']['tipo'])) {
        try {
            (new Notificacion())->manejarAccion('registrar', json_encode([
                'id_usuario'        => $_SESSION['s_usuario']['id_usuario'],
                'titulo'            => $res['notif']['titulo'],
                'descripcion'       => $res['notif']['descripcion'],
                'tipo_notificacion' => $res['notif']['tipo'],
                'alcance'           => $res['notif']['alcance'],
                'enlace'            => 'index.php?url=pedidos',
                'fecha'             => date('Y-m-d H:i:s'),
            ]));
        } catch (Throwable $e) {
            error_log('pedido_movil (notificacion): ' . $e->getMessage());
        }
    }

    echo json_encode(['status' => true, 'message' => $res['msj'] ?? 'Pedido guardado exitosamente.']);
} catch (Throwable $e) {
    error_log('pedido_movil: ' . $e->getMessage());
    echo json_encode(['status' => false, 'message' => 'Error al registrar el pedido.']);
}
