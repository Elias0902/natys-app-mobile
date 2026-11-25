import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder } from '../features/ecommerce/services/ecommerceApi';
import { sessionExpired, signOut } from './authSlice';

const initialState = { items: {} };

// Antes este cálculo vivía en AppNavigator; ahora el checkout consume el store.
export const checkoutOrder = createAsyncThunk(
  'cart/checkoutOrder',
  async (contact, { getState, rejectWithValue }) => {
    const items = Object.values(getState().cart.items).map((i) => ({
      id_producto: i.p.id_producto,
      cantidad: i.qty,
    }));

    if (!items.length) {
      return rejectWithValue('Tu carrito está vacío.');
    }

    try {
      return await createOrder({ ...contact, items });
    } catch (error) {
      return rejectWithValue(error.message || 'No se pudo registrar el pedido.');
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, { payload }) {
      const id = payload?.id_producto;
      if (!id) return;
      const qty = (state.items[id]?.qty || 0) + 1;
      state.items[id] = { p: payload, qty };
    },
    changeQty(state, { payload }) {
      const { product, delta } = payload;
      const id = product?.id_producto;
      if (!id) return;

      const qty = (state.items[id]?.qty || 0) + delta;
      if (qty <= 0) delete state.items[id];
      else state.items[id] = { p: product, qty };
    },
    clearCart() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutOrder.fulfilled, () => initialState)
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const { addItem, changeQty, clearCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.items;
export const selectCartCount = (state) =>
  Object.values(state.cart.items).reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal = (state) =>
  Object.values(state.cart.items).reduce(
    (sum, i) => sum + i.qty * Number(i.p?.precio_venta || 0),
    0,
  );

export default cartSlice.reducer;
