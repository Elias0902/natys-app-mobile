import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { money } from '../ui';
import ActionButton from './ActionButton';

// One product of the catalog (width comes from ProductTable)
export default function ProductCard({ product, qty, onAdd, width }) {
  return (
    <View style={[styles.productCard, width ? { width } : null]}>
      <View style={styles.image}>
        <Text style={{ fontSize: 40 }}>🍪</Text>
      </View>
      <View style={styles.badgeContainer}>
        <Text style={styles.categoryBadge} numberOfLines={1}>{product.nombre_categoria}</Text>
      </View>
      <Text style={styles.productName} numberOfLines={2}>{product.nombre_producto}</Text>
      {product.descripcion ? <Text style={styles.description} numberOfLines={2}>{product.descripcion}</Text> : null}

      <View style={styles.footerRow}>
        <Text style={styles.price}>{money(product.precio_venta)}</Text>
        <Text style={styles.stock}>STOCK: {product.stock}</Text>
      </View>

      <ActionButton icon="cart" label={qty ? `Agregar (${qty})` : 'Agregar'} onPress={() => onAdd(product)} />
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
  },
  image: {
    height: 100,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    minHeight: 36,
  },
  description: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 'auto',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  stock: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
});
