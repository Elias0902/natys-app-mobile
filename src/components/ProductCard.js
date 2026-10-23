import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { money } from '../ui';

// One product of the catalog
export default function ProductCard({ product, qty, onAdd }) {
  return (
    <View style={styles.productCard}>
      <View style={styles.image}>
        <Text style={{ fontSize: 40 }}>🍪</Text>
      </View>
      <View style={styles.badgeContainer}>
        <Text style={styles.categoryBadge}>{product.nombre_categoria}</Text>
      </View>
      <Text style={styles.productName} numberOfLines={2}>{product.nombre_producto}</Text>
      {product.descripcion ? <Text style={styles.description}>{product.descripcion}</Text> : null}

      <View style={styles.footerRow}>
        <Text style={styles.price}>{money(product.precio_venta)}</Text>
        <Text style={styles.stock}>STOCK: {product.stock}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onAdd(product)}>
        <Text style={styles.buttonText}>{qty ? `Agregar (${qty})` : 'Agregar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: '48.5%',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: colors.border,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
  },
  image: {
    height: 90,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
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
    marginBottom: 8,
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
  button: {
    backgroundColor: colors.red,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
