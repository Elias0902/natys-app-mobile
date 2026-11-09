<?php
// Copy this file to natys-larence/api/_movil_comun.php
// Shared by lista_movil.php and crud_movil.php: modules, session and role permissions.
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use App\Natys\Models\Permiso;

// App key => [model class, name in the `modulos` table used by the web permissions]
const MOVIL_MODULOS = [
    'clientes'       => ['Cliente', 'Clientes'],
    'proveedores'    => ['Proveedor', 'Proveedores'],
    'categorias'     => ['Categoria', 'Categorias'],
    'productos'      => ['Producto', 'Productos'],
    'materias'       => ['MateriaPrima', 'Materias Prima'],
    'producciones'   => ['Produccion', 'Producciones'],
    'pedidos'        => ['Pedido', 'Pedidos'],
    'entregas'       => ['Entrega', 'Entregas'],
    'compras'        => ['Compra', 'Compras'],
    'promociones'    => ['Promocion', 'Promociones'],
    'pagos'          => ['Pago', 'Pagos'],
    'cobrar'         => ['CuentaCobrar', 'Cuentas por Cobrar'],
    'pagar'          => ['CuentaPagar', 'Cuentas por Pagar'],
    'tipos_clientes' => ['TipoCliente', 'Tipos Clientes'],
    'notificaciones' => ['Notificacion', 'Notificaciones'],
    'tasa'           => ['Tasa', 'Tasa'],
    'moneda'         => ['Moneda', 'Monedas'],
    'unidades'       => ['UnidadMedida', 'Unidades de Medida'],
    'camiones'       => ['Camion', 'Camiones'],
    'roles'          => ['Rol', 'Roles'],
    'modulos'        => ['Modulo', 'Modulos'],
    'usuarios'       => ['Usuario', 'Usuarios'],
    'bitacora'       => ['Bitacora', 'Bitacoras'],
    'respaldos'      => ['Respaldo', 'Respaldos'],
];

function movil_salir(int $codigo, string $mensaje): void {
    http_response_code($codigo);
    echo json_encode(['status' => false, 'message' => $mensaje]);
    exit;
}

function movil_exigir_sesion(): void {
    if (!isset($_SESSION['s_usuario'])) movil_salir(401, 'Sesión no iniciada');
}

// Same check as tienePermiso() in the web controllers (tables accesos/modulos/permisos).
function movil_tiene_permiso(string $modulo, string $accion): bool {
    $res = (new Permiso())->manejarAccion('verificar', json_encode([
        'modulo'  => $modulo,
        'permiso' => $accion,
        'rol'     => $_SESSION['s_usuario']['id_rol_usuario'],
    ]));
    return ($res['status'] ?? false) === true;
}

function movil_exigir_permiso(string $modulo, string $accion): void {
    if (!movil_tiene_permiso($modulo, $accion)) movil_salir(403, 'No tienes permiso para esta acción.');
}

// Single rule for reading a module: protects lista_movil.php and builds the app menu.
function movil_puede_consultar(string $clave): bool {
    // Catalog and exchange rates are needed by every logged-in user (Ecommerce and header).
    if (in_array($clave, ['productos', 'tasa'], true)) return true;
    // Roles 3 and 4 access their own orders directly, like PedidoController.
    if ($clave === 'pedidos' && in_array((int) $_SESSION['s_usuario']['id_rol_usuario'], [3, 4], true)) return true;
    return movil_tiene_permiso(MOVIL_MODULOS[$clave][1], 'Consultar');
}

function movil_modulos_visibles(): array {
    return array_values(array_filter(array_keys(MOVIL_MODULOS), 'movil_puede_consultar'));
}
