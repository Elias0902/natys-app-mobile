import { getList } from '../features/modulos/services/modulosApi';

// Exchange rates shown in the header. natys-larence is the one that keeps them updated.
export const getTasas = async () => (await getList('tasa')).filter((t) => t.nombre && t.valor);
