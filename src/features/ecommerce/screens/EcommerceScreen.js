import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Page, PageHeader } from '../../../components/Page';
import ActionButton from '../../../components/ActionButton';
import FilterableProductTable from '../components/FilterableProductTable';
import { getProductos } from '../services/ecommerceApi';
import { colors } from '../../../utils/theme';
import { addItem, selectCart, selectCartCount } from '../../../store/cartSlice';

// Loads the products and reads the cart from Redux.
export default function EcommerceScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductos().then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <Page>
      <PageHeader icon="bag" title="Catálogo Galletas Naty's" crumb="Inicio  ›  Ecommerce">
        <ActionButton icon="cart" size="lg" label={cartCount ? `Ver carrito (${cartCount})` : 'Ver carrito'} onPress={() => navigation.navigate('carrito')} />
      </PageHeader>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FilterableProductTable products={products} cart={cart} onAdd={(p) => dispatch(addItem(p))} />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  loading: { marginVertical: 40 },
  error: { color: colors.redSoft, textAlign: 'center', padding: 24 },
});
