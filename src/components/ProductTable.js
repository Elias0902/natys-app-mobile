import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '../theme';
import ProductCard from './ProductCard';

// Filters the products with the text from SearchBar and renders one ProductCard per match
export default function ProductTable({ products, filterText, cart, onAdd }) {
  const rows = [];

  products.forEach((product) => {
    if (product.nombre_producto.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }

    rows.push(
      <ProductCard
        key={product.id_producto}
        product={product}
        qty={cart[product.id_producto]?.qty || 0}
        onAdd={onAdd}
      />
    );
  });

  return (
    <ScrollView style={styles.tableContainer} contentContainerStyle={styles.grid}>
      {rows.length > 0 ? (
        rows
      ) : (
        <Text style={styles.noResults}>No se encontraron productos.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: colors.muted,
  },
});
