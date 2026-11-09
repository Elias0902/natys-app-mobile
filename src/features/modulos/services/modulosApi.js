import { USE_MOCK } from '../../../utils/config';
import { MOCK } from '../../../utils/mock';
import { request } from '../../../utils/http';

// Generic list call (see php/lista_movil.php)
export async function getList(modulo) {
  if (USE_MOCK) return MOCK[modulo] || [];
  const data = await request(`lista_movil.php?modulo=${modulo}`);
  if (!data.status) throw new Error(data.message || 'Error al consultar');
  return data.data;
}

// ---- CRUD of the modules (see php/crud_movil.php) ----
// In mock mode the changes are kept in memory until the page is reloaded.
async function crud(modulo, accion, payload) {
  const json = await request(`crud_movil.php?modulo=${modulo}&accion=${accion}`, { method: 'POST', body: payload });
  if (!json.status) throw new Error(json.message || 'No se pudo completar la operación');
  return json;
}

const nextId = (rows, idKey) => rows.reduce((max, r) => Math.max(max, Number(r[idKey]) || 0), 0) + 1;

export async function createRecord(modulo, idKey, data) {
  if (USE_MOCK) {
    const rows = MOCK[modulo] || [];
    const id = data[idKey] !== undefined && data[idKey] !== '' ? data[idKey] : nextId(rows, idKey);
    if (rows.some((r) => String(r[idKey]) === String(id))) throw new Error('Ya existe un registro con ese código.');
    const record = { [idKey]: id, ...data, [idKey]: id };
    MOCK[modulo] = [record, ...rows];
    return record;
  }
  return (await crud(modulo, 'registrar', data)).data;
}

export async function updateRecord(modulo, idKey, id, data) {
  if (USE_MOCK) {
    MOCK[modulo] = (MOCK[modulo] || []).map((r) => (String(r[idKey]) === String(id) ? { ...r, ...data, [idKey]: r[idKey] } : r));
    return;
  }
  await crud(modulo, 'modificar', { ...data, [idKey]: id });
}

export async function deleteRecord(modulo, idKey, id) {
  if (USE_MOCK) {
    MOCK[modulo] = (MOCK[modulo] || []).filter((r) => String(r[idKey]) !== String(id));
    return;
  }
  await crud(modulo, 'eliminar', { [idKey]: id });
}
