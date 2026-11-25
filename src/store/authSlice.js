import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  login as loginRequest,
  restoreSession as restoreSessionRequest,
  logout as logoutRequest,
} from '../features/auth/services/authApi';
import { request } from '../utils/http';

const SESSION_EXPIRED_MESSAGE = 'Tu sesión venció. Inicia sesión de nuevo.';

// Mismo formato que se mostraba antes en AppNavigator y en Mi Perfil.
function buildLastAccess() {
  const d = new Date();
  const p2 = (n) => String(n).padStart(2, '0');
  const h = d.getHours() % 12 || 12;
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(h)}:${p2(d.getMinutes())}:${p2(d.getSeconds())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

// Los permisos se consultan con el token ya guardado por authApi.
async function withAllowedModules(user) {
  if (!user) return null;

  const rolId = user.id_rol_usuario || user.id_rol;
  if (!rolId) return user;

  try {
    const data = await request(`permisos&action=obtener_modulo&ID=${rolId}`, { method: 'GET' });
    const permitidas = Array.isArray(data)
      ? data
          .filter((p) => Number(p.status) === 1 && p.nombre_permiso === 'Consultar' && p.ruta)
          .map((p) => p.ruta)
      : [];
    return { ...user, modulos: [...new Set(permitidas)] };
  } catch (error) {
    console.error('Error cargando permisos de módulos:', error);
    return { ...user, modulos: [] };
  }
}

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const user = await restoreSessionRequest();
  return withAllowedModules(user);
});

export const signIn = createAsyncThunk('auth/signIn', async ({ username, password }) => {
  const user = await loginRequest(username, password);
  return withAllowedModules(user);
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await logoutRequest();
});

const initialState = {
  user: null,
  checkingSession: true,
  loginNotice: '',
  lastAccess: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Lo dispara utils/http cuando el backend responde 401.
    sessionExpired(state) {
      state.user = null;
      state.loginNotice = SESSION_EXPIRED_MESSAGE;
      state.lastAccess = '';
    },
    clearLoginNotice(state) {
      state.loginNotice = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.checkingSession = true;
      })
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.checkingSession = false;
        // Si el token venció, conservamos el aviso que puso sessionExpired.
        state.loginNotice = payload ? '' : state.loginNotice;
        state.lastAccess = payload ? buildLastAccess() : '';
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.checkingSession = false;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.loginNotice = '';
        state.lastAccess = payload ? buildLastAccess() : '';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loginNotice = '';
        state.lastAccess = '';
      })
      .addCase(signOut.rejected, (state) => {
        // Aunque falle la API, localmente la sesión debe cerrarse.
        state.user = null;
        state.loginNotice = '';
        state.lastAccess = '';
      });
  },
});

export const { sessionExpired, clearLoginNotice } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectCheckingSession = (state) => state.auth.checkingSession;
export const selectLoginNotice = (state) => state.auth.loginNotice;
export const selectLastAccess = (state) => state.auth.lastAccess;

export default authSlice.reducer;
