import { request } from '../../../utils/http';

export async function getPerfil() {
    const response = await request('perfil&action=verPerfil', { method: 'GET' });
    const res = Array.isArray(response) ? response[0] : response;

      if (!res || !res.status) {
        throw new Error(res?.msj || 'No se pudo cargar el perfil');
      }

      return res || [];
    }