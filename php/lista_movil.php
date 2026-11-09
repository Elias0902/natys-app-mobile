<?php
// Copy this file to natys-larence/api/lista_movil.php
// Generic JSON list for the mobile app: ?modulo=pedidos  ->  Model::manejarAccion('consultar')
require_once __DIR__ . '/_movil_comun.php';

use App\Natys\Models\Entrega;

movil_exigir_sesion();

$modulo = $_GET['modulo'] ?? '';
if (!isset(MOVIL_MODULOS[$modulo])) movil_salir(400, 'Módulo no válido');
$modelo_nombre = MOVIL_MODULOS[$modulo][0];

$rol = (int) $_SESSION['s_usuario']['id_rol_usuario'];

try {
    if (!movil_puede_consultar($modulo)) movil_salir(403, 'No tienes permiso para esta acción.');

    $class = 'App\\Natys\\Models\\' . $modelo_nombre;
    $res = (new $class())->manejarAccion('consultar', null);
    $data = $res['data'] ?? [];

    // Same visibility as the web: only roles 1 and 2 see every order
    if ($modulo === 'pedidos' && !in_array($rol, [1, 2], true)) {
        if ($rol === 4) {
            $id_usuario = (int) $_SESSION['s_usuario']['id_usuario'];
            $entregas = (new Entrega())->manejarAccion('consultar', null)['data'] ?? [];
            $propios = [];
            foreach ($entregas as $e) {
                if ((int) ($e['id_usuario_repartidor'] ?? 0) === $id_usuario) $propios[] = (int) $e['id_pedido'];
            }
            $data = array_filter($data, fn($p) => in_array((int) $p['id_pedido'], $propios, true));
        } else {
            $id_cliente = (int) ($_SESSION['s_usuario']['id_cliente'] ?? 0);
            $data = array_filter($data, fn($p) => $id_cliente > 0 && (int) ($p['id_cliente'] ?? 0) === $id_cliente);
        }
    }

    // Never send password hashes to the app
    foreach ($data as &$row) {
        if (is_array($row)) unset($row['password_usuario'], $row['password']);
    }
    unset($row);
    echo json_encode(['status' => true, 'data' => array_values($data)]);
} catch (Throwable $e) {
    error_log('lista_movil: ' . $e->getMessage());
    echo json_encode(['status' => false, 'message' => 'Error al consultar']);
}
