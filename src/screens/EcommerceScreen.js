import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Page, PageHeader } from '../components/Page';
import ActionButton from '../components/ActionButton';
import FilterableProductTable from '../components/FilterableProductTable';
import { getList } from '../api';
import { colors } from '../theme';

// Loads the products and passes them to FilterableProductTable
export default function EcommerceScreen({ cart, cartCount, onAdd, onCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getList('productos').then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <Page>
      <PageHeader icon="bag" title="Catálogo Galletas Naty's" crumb="Inicio  ›  Ecommerce">
        <ActionButton icon="cart" size="lg" label={cartCount ? `Ver carrito (${cartCount})` : 'Ver carrito'} onPress={onCart} />
      </PageHeader>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FilterableProductTable products={products} cart={cart} onAdd={onAdd} />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  loading: { marginVertical: 40 },
  error: { color: colors.redSoft, textAlign: 'center', padding: 24 },
});
