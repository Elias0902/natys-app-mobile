import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FilterableRecordTable from '../components/FilterableRecordTable';
import RecordDetailModal from '../components/RecordDetailModal';
import RecordFormModal from '../components/RecordFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ActionButton from '../components/ActionButton';
import { getList, createRecord, updateRecord, deleteRecord } from '../api';
import { fieldsFor } from '../fields';
import { recordTitle } from '../ui';
import { colors } from '../theme';

// "Gestión de ..." for every module of the menu (Proveedores, Pedidos, Pagos...)
// Registrar · Consultar (table + search) · Modificar · Eliminar
export default function ListScreen({ item }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Which modal is open
  const [viewing, setViewing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const config = fieldsFor(item.modulo, records[0]);

  // Table columns: # (id) + the fields of the module
  const columns = [
    { key: config.id, label: config.idLabel || '#', kind: 'id' },
    ...config.fields.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.key === 'estado' ? 'estado' : /total|monto/.test(f.key) ? 'money' : 'field',
    })),
  ];

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setRecords(await getList(item.modulo));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRecords([]);
    setViewing(null); setFormOpen(false); setEditing(null); setDeleting(null); setMessage('');
    load();
  }, [item.key]);

  // Short success message under the header
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 2500);
    return () => clearTimeout(t);
  }, [message]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (record) => { setViewing(null); setEditing(record); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async (data) => {
    if (editing) {
      await updateRecord(item.modulo, config.id, editing[config.id], data);
      setMessage('Registro modificado correctamente.');
    } else {
      await createRecord(item.modulo, config.id, data);
      setMessage('Registro guardado correctamente.');
    }
    closeForm();
    load();
  };

  const remove = async (record) => {
    await deleteRecord(item.modulo, config.id, record[config.id]);
    setDeleting(null);
    setMessage('Registro eliminado.');
    load();
  };

  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}><Text style={styles.icon}>☰</Text></View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.title}>Gestión de {item.label}</Text>
            <Text style={styles.crumb}>Inicio  ›  {item.label}</Text>
          </View>
        </View>
        <ActionButton label={`+  Registrar ${config.singular}`} onPress={openCreate} style={styles.addBtn} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FilterableRecordTable
        title={`Consulta de ${item.label}`}
        records={records}
        columns={columns}
        idKey={config.id}
        moduleKey={item.key}
        loading={loading}
        onRefresh={load}
        onView={setViewing}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

      <RecordDetailModal record={viewing} moduleLabel={config.singular} onClose={() => setViewing(null)} onEdit={openEdit} />
      <RecordFormModal visible={formOpen} config={config} record={editing} moduleLabel={config.singular} onClose={closeForm} onSave={save} />
      <ConfirmDeleteModal record={deleting} title={deleting ? recordTitle(deleting) : ''} onClose={() => setDeleting(null)} onConfirm={remove} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pageHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginRight: 10, marginVertical: 4 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  crumb: { color: colors.muted, fontSize: 12, marginTop: 2 },
  addBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginLeft: 0, marginVertical: 4 },
  message: { backgroundColor: '#14532d', color: '#4ade80', fontWeight: '700', textAlign: 'center', padding: 8, marginHorizontal: 12, marginBottom: 10, borderRadius: 8, overflow: 'hidden' },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  error: { color: '#f87171', textAlign: 'center' },
});
