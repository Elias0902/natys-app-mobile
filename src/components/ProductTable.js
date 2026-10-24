import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { useLayout } from '../layout';
import ProductCard from './ProductCard';

// Filters the products with the text from SearchBar and renders one ProductCard per match.
// The number of columns depends on the real width of the grid (2 on phones, up to 5 on big screens).
export default function ProductTable({ products, filterText, cart, onAdd }) {
  const { isPhone, contentWidth } = useLayout();
  const [width, setWidth] = useState(contentWidth);

  const gap = isPhone ? 10 : 16;
  const minCard = isPhone ? 150 : 230;
  const perRow = Math.max(2, Math.floor((width + gap) / (minCard + gap)));
  const cardWidth = Math.floor((width - gap * (perRow - 1)) / perRow);

  const q = filterText.trim().toLowerCase();
  const list = products.filter((p) => p.nombre_producto.toLowerCase().includes(q));

  return (
    <View style={[styles.grid, { gap }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {list.length > 0 ? (
        list.map((product) => (
          <ProductCard
            key={product.id_producto}
            product={product}
            qty={cart[product.id_producto]?.qty || 0}
            width={cardWidth}
            onAdd={onAdd}
          />
        ))
      ) : (
        <Text style={styles.noResults}>No se encontraron productos.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: colors.muted,
  },
});
