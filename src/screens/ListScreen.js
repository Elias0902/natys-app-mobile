import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Page, PageHeader } from '../components/Page';
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

  // Table columns: ID + the fields of the module
  const columns = [
    { key: config.id, label: config.idLabel || 'ID', kind: 'id' },
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

  const header = (
    <PageHeader
      icon={item.icon}
      title={`Gestión de ${item.label}`}
      crumb={['Inicio', item.group, item.label].filter(Boolean).join('  ›  ')}>
      {!error && <ActionButton icon="plus" size="lg" label={`Registrar ${config.singular}`} onPress={openCreate} />}
    </PageHeader>
  );

  if (error) {
    return (
      <Page>
        {header}
        <Text style={styles.error}>{error}</Text>
      </Page>
    );
  }

  return (
    <>
      <Page refreshing={loading && records.length > 0} onRefresh={load}>
        {header}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <FilterableRecordTable
          title={`Consulta de ${item.label}`}
          records={records}
          columns={columns}
          idKey={config.id}
          moduleKey={item.key}
          loading={loading}
          onView={setViewing}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      </Page>

      <RecordDetailModal record={viewing} moduleLabel={config.singular} onClose={() => setViewing(null)} onEdit={openEdit} />
      <RecordFormModal visible={formOpen} config={config} record={editing} moduleLabel={config.singular} onClose={closeForm} onSave={save} />
      <ConfirmDeleteModal record={deleting} title={deleting ? recordTitle(deleting) : ''} onClose={() => setDeleting(null)} onConfirm={remove} />
    </>
  );
}

const styles = StyleSheet.create({
  message: { backgroundColor: '#14532d', color: '#4ade80', fontWeight: '700', textAlign: 'center', padding: 10, marginBottom: 14, borderRadius: 8, overflow: 'hidden' },
  error: { color: colors.redSoft, textAlign: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 24, overflow: 'hidden' },
});
