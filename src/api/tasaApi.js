// Tasas de dólar en tiempo real, misma fuente pública que usa el sistema web.
// Se consultan con fetch directo (sin Authorization) para no enviar el token a un tercero.
const DOLAR_API = 'https://ve.dolarapi.com/v1/dolares';
const TIMEOUT_MS = 10000;

async function fetchDolar(tipo) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${DOLAR_API}/${tipo}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function toRow(nombre, data) {
  const valor = Number(data?.promedio ?? data?.precio ?? data?.venta ?? data?.compra);
  if (!Number.isFinite(valor) || valor <= 0) return null;
  return {
    nombre,
    valor: `${valor.toFixed(2)} Bs/$`,
    fechaActualizacion: data?.fechaActualizacion ?? null,
    fuente: data?.fuente ?? null,
  };
}

// Devuelve [{ nombre, valor }] tal como lo espera el Header.
// Si una de las dos APIs falla, se muestra la otra; si fallan ambas, se lanza error.
export async function getTasas() {
  const [oficial, paralelo] = await Promise.all([
    fetchDolar('oficial').catch(() => null),
    fetchDolar('paralelo').catch(() => null),
  ]);

  const filas = [
    toRow('BCV', oficial),
    toRow('USDT', paralelo),
  ].filter(Boolean);

  if (filas.length === 0) throw new Error('No se pudieron cargar las tasas del dólar.');
  return filas;
}
