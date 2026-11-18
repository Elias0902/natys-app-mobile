// Validaciones compartidas por los formularios de la app.
// Las reglas espejan al backend (ValidacionTrait, Usuario.php, Perfil.php).

export const PHONE_RE = /^(0251|0212|0412|0414|0416|0422|0424|0426)\d{7}$/;

// Acepta teléfono con guiones o espacios para validarlo, pero siempre devuelve
// solo dígitos para enviarlo a la API (el backend exige 11 dígitos seguidos).
export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

export const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USERNAME_RE = /^[a-zA-Z0-9@_]{5,20}$/;
export const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\.)[a-zA-Z0-9.]{6,11}$/;
export const RIF_RE = /^\d+$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === '';

export const isPhone = (value) => PHONE_RE.test(digitsOnly(value));

export const isEmail = (value) => EMAIL_RE.test(String(value ?? '').trim());

export const isRif = (value) => RIF_RE.test(String(value ?? '').trim());

export const isUsername = (value) => USERNAME_RE.test(String(value ?? '').trim());

export const isPassword = (value) => PASSWORD_RE.test(String(value ?? ''));

export const isNumber = (value) => {
  if (isBlank(value)) return false;
  const n = Number(value);
  return Number.isFinite(n);
};

export const isNonNegative = (value) => isNumber(value) && Number(value) >= 0;

export const isPositive = (value) => isNumber(value) && Number(value) > 0;

export const isInteger = (value) => {
  if (isBlank(value)) return false;
  return /^\d+$/.test(String(value).trim());
};

export const normalizeDate = (value) => {
  const text = String(value ?? '').trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const latin = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (latin) return `${latin[3]}-${latin[2]}-${latin[1]}`;
  return '';
};

export const isDate = (value) => {
  const text = normalizeDate(value);
  if (!DATE_RE.test(text)) return false;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export const isDateRange = (start, end) => isDate(start) && isDate(end) && normalizeDate(start) <= normalizeDate(end);

export const inList = (value, list) => list.map(String).includes(String(value ?? '').trim());

export const lengthBetween = (value, min, max) => {
  const length = String(value ?? '').trim().length;
  return length >= min && length <= max;
};

// Devuelve el primer mensaje de una lista de pares [condiciónFalla, mensaje].
export function firstError(checks) {
  const falla = checks.find(([fallaCondition]) => fallaCondition);
  return falla ? falla[1] : '';
}
