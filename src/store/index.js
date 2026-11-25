import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

// Estado global de la app: sesión/permisos y carrito de ecommerce.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

