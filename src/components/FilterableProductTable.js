import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { useLayout } from '../layout';
import SearchBar from './SearchBar';
import ProductTable from './ProductTable';

// Joins the search bar and the product grid; the filter text is shared state between both
export default function FilterableProductTable({ products, cart, onAdd }) {
  const { isPhone } = useLayout();
  const [textoFiltrado, setTextoFiltrado] = useState('');

  return (
    <View>
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        {!isPhone && <Text style={styles.count}>{products.length} productos disponibles</Text>}
        <SearchBar
          filterText={textoFiltrado}
          onChangeText={setTextoFiltrado}
          placeholder="Buscar galletas..."
          style={isPhone ? styles.searchPhone : styles.searchWide}
        />
      </View>
      <ProductTable products={products} filterText={textoFiltrado} cart={cart} onAdd={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  toolbarPhone: { marginBottom: 12 },
  count: { color: colors.muted, fontSize: 13 },
  searchWide: { width: 320, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
});
