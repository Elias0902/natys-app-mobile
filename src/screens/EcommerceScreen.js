import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import FilterableProductTable from '../components/FilterableProductTable';
import { getList } from '../api';
import { colors } from '../theme';

// Loads the products and passes them to FilterableProductTable
export default function EcommerceScreen({ cart, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getList('productos').then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.red} /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.headerBanner}>
        <Text style={styles.title}>Catálogo Galletas Naty's</Text>
      </View>

      <FilterableProductTable products={products} cart={cart} onAdd={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBanner: {
    backgroundColor: colors.red,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  error: { color: '#f87171', textAlign: 'center' },
});
