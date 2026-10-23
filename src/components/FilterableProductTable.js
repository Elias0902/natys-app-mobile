import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from './SearchBar';
import ProductTable from './ProductTable';

// Joins the search bar and the product table; the filter text is shared state between both
export default function FilterableProductTable({ products, cart, onAdd }) {
  const [textoFiltrado, setTextoFiltrado] = useState('');

  return (
    <View style={styles.container}>
      <SearchBar
        filterText={textoFiltrado}
        onChangeText={setTextoFiltrado}
        placeholder="Buscar galletas..."
      />
      <ProductTable
        products={products}
        filterText={textoFiltrado}
        cart={cart}
        onAdd={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
