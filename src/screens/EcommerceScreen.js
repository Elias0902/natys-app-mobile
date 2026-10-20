import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getList } from '../api';
import { colors } from '../theme';
import { money } from '../ui';

export default function EcommerceScreen({ cart, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getList('productos').then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color={colors.red} /></View>;
  if (error) return <View style={s.center}><Text style={s.error}>{error}</Text></View>;

  return (
    <FlatList
      style={s.container}
      contentContainerStyle={{ padding: 8 }}
      numColumns={2}
      data={products}
      keyExtractor={(p) => String(p.id_producto)}
      ListHeaderComponent={<Text style={s.heading}>Nuestras galletas</Text>}
      renderItem={({ item: p }) => {
        const qty = cart[p.id_producto]?.qty || 0;
        return (
          <View style={s.card}>
            <View style={s.img}><Text style={{ fontSize: 40 }}>🍪</Text></View>
            <Text style={s.cat}>{p.nombre_categoria}</Text>
            <Text style={s.name} numberOfLines={2}>{p.nombre_producto}</Text>
            <Text style={s.price}>{money(p.precio_venta)}</Text>
            <TouchableOpacity style={s.btn} onPress={() => onAdd(p)}>
              <Text style={s.btnText}>{qty ? `Agregar (${qty})` : 'Agregar'}</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', margin: 8 },
  card: { flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 10, margin: 4, maxWidth: '48.5%' },
  img: { height: 90, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cat: { color: colors.red, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  name: { color: colors.text, fontSize: 13, fontWeight: '600', marginVertical: 3, minHeight: 34 },
  price: { color: '#fbbf24', fontWeight: '800', fontSize: 16, marginBottom: 8 },
  btn: { backgroundColor: colors.red, borderRadius: 8, padding: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  error: { color: '#f87171', textAlign: 'center' },
});
