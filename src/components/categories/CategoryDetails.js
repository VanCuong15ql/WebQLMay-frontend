import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryDetails = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [rowsByTable, setRowsByTable] = useState({});

  const [showAddTable, setShowAddTable] = useState(false);
  const [tableName, setTableName] = useState('');
  const [tableDesc, setTableDesc] = useState('');
  const [columns, setColumns] = useState([]);
  const [colLabel, setColLabel] = useState('');
  const [colType, setColType] = useState('text');
  const [colDesc, setColDesc] = useState('');

  const [showAddRow, setShowAddRow] = useState(false);
  const [currentTableForRow, setCurrentTableForRow] = useState(null);
  const [rowValues, setRowValues] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [currentTableForColumn, setCurrentTableForColumn] = useState(null);
  const [newColLabel, setNewColLabel] = useState('');
  const [newColType, setNewColType] = useState('text');
  const [newColDesc, setNewColDesc] = useState('');
  const [users, setUsers] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
    fetchTables();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTables = async () => {
    setLoadingTables(true);
    try {
      const res = await fetch(`${API_BASE}/tables?category=${id}`);
      if (!res.ok) throw new Error('Failed to load tables');
      const data = await res.json();
      setTables(data);
      // fetch rows for each table
      data.forEach(t => fetchRowsForTable(t._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchRowsForTable = async (tableId) => {
    try {
      const res = await fetch(`${API_BASE}/rows?table=${tableId}`);
      if (!res.ok) throw new Error('Failed to load rows');
      const data = await res.json();
      setRowsByTable(prev => ({ ...prev, [tableId]: data }));
    } catch (err) {
      console.error(err);
      setRowsByTable(prev => ({ ...prev, [tableId]: [] }));
    }
  };

  const role = localStorage.getItem('role');
  const canEdit = role === 'edit' || role === 'admin';
  const currentUsername = localStorage.getItem('username') || '';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const addColumn = () => {
    if (!colLabel.trim()) return;
    setColumns(prev => [...prev, { label: colLabel, type: colType, description: colDesc }]);
    setColLabel('');
    setColType('text');
    setColDesc('');
  };

  const removeColumn = (index) => {
    setColumns(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateTable = async () => {
    if (!tableName.trim()) return window.alert('Tên bảng không được để trống');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ categories_id: id, name: tableName, description: tableDesc, columns })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Lỗi khi tạo bảng');
      }
      const created = await res.json();
      setTables(prev => [created, ...prev]);
      setShowAddTable(false);
      setTableName('');
      setTableDesc('');
      setColumns([]);
      // fetch rows for new table (should be empty)
      setRowsByTable(prev => ({ ...prev, [created._id]: [] }));
    } catch (err) {
      window.alert('Lỗi khi thêm bảng: ' + err.message);
    }
  };

  const openAddRow = (table) => {
    const initial = {};
    (table.columns || []).forEach(c => { initial[c.label] = ''; });
    setCurrentTableForRow(table);
    setRowValues(initial);
    setEditingRow(null);
    setShowAddRow(true);
  };

  const openAddColumn = (table) => {
    setCurrentTableForColumn(table);
    setNewColLabel('');
    setNewColType('text');
    setNewColDesc('');
    setShowAddColumn(true);
  };

  const handleCreateColumn = async () => {
    if (!currentTableForColumn || !newColLabel.trim()) return window.alert('Label không được để trống');
    try {
      const token = localStorage.getItem('token');
      const tableId = currentTableForColumn._id;
      const updatedColumns = [
        ...(currentTableForColumn.columns || []),
        { label: newColLabel, type: newColType, description: newColDesc }
      ];
      const res = await fetch(`${API_BASE}/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ columns: updatedColumns })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setTables(prev => prev.map(t => t._id === updated._id ? updated : t));
      // ensure rowsByTable keeps same rows (no change), new column will show empty values
      setShowAddColumn(false);
      setCurrentTableForColumn(null);
    } catch (err) {
      window.alert('Lỗi khi thêm cột: ' + err.message);
    }
  };

  const openEditRow = (table, row) => {
    if (row.confirmed) {
      window.alert('Row đã được xác nhận, không thể sửa.');
      return;
    }
    setCurrentTableForRow(table);
    setRowValues(row.values || {});
    setEditingRow(row);
    setShowAddRow(true);
  };

  const handleSubmitRow = async () => {
    if (!currentTableForRow) return;
    try {
      const token = localStorage.getItem('token');
      if (editingRow) {
        // update
        const res = await fetch(`${API_BASE}/rows/${editingRow._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ values: rowValues })
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setRowsByTable(prev => ({ ...prev, [currentTableForRow._id]: prev[currentTableForRow._id].map(r => r._id === updated._id ? updated : r) }));
      } else {
        // create
        const res = await fetch(`${API_BASE}/rows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ tables_id: currentTableForRow._id, values: rowValues })
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setRowsByTable(prev => ({ ...prev, [currentTableForRow._id]: [created, ...(prev[currentTableForRow._id] || [])] }));
      }
      setShowAddRow(false);
      setRowValues({});
      setEditingRow(null);
    } catch (err) {
      window.alert('Lỗi khi lưu row: ' + err.message);
    }
  };

  const handleDeleteRow = async (tableId, rowId) => {
    if (!window.confirm('Bạn có chắc muốn xóa row này?')) return;
    try {
      const res = await fetch(`${API_BASE}/rows/${rowId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setRowsByTable(prev => ({ ...prev, [tableId]: (prev[tableId] || []).filter(r => r._id !== rowId) }));
    } catch (err) {
      window.alert('Lỗi khi xóa row: ' + err.message);
    }
  };

  const handleConfirmRow = async (table, row) => {
    const message = 'sau khi xác nhận thông tin thì không thể hoàn tác, thông tin này sẽ không được chỉnh sửa nữa, tuy nhiên vẫn có thể được xóa bởi quản trị viên, bạn có chắc chắn xác nhận thông tin chứ';
    if (!window.confirm(message)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/rows/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          confirmed: true,
          confirmedBy: currentUsername,
          confirmedAt: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setRowsByTable(prev => ({
        ...prev,
        [table._id]: (prev[table._id] || []).map(r => (r._id === updated._id ? updated : r))
      }));
    } catch (err) {
      window.alert('Lỗi khi xác nhận row: ' + err.message);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Bạn có chắc muốn xóa table này?')) return;
    try {
      const res = await fetch(`${API_BASE}/tables/${tableId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setTables(prev => prev.filter(t => t._id !== tableId));
      setRowsByTable(prev => { const copy = { ...prev }; delete copy[tableId]; return copy; });
    } catch (err) {
      window.alert('Lỗi khi xóa table: ' + err.message);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  if (!category) return <div>Không tìm thấy category</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        {role === 'edit' || role === 'admin' ? (
          <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => setShowAddTable(true)}>
            Add table
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-gray-700">{category.description || 'Không có mô tả'}</p>
      <div className="mt-4">
        <small className="text-gray-500">Ngày tạo: {new Date(category.createdAt).toLocaleString()}</small>
      </div>

      <section className="mt-6">
        <h3 className="font-semibold mb-3">Bảng thuộc category</h3>
        {loadingTables ? (
          <div>Đang tải bảng...</div>
        ) : tables.length === 0 ? (
          <div className="text-gray-500">Chưa có bảng nào</div>
        ) : (
          <div className="space-y-6">
            {tables.map(t => (
              <div key={t._id} className="border rounded p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    
                    <div className="font-medium">{t.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(role === 'edit' || role === 'admin') && (
                      <>
                        <button className="px-2 py-1 bg-black text-white rounded text-sm" onClick={() => openAddRow(t)}>Add row</button>
                        <button className="px-2 py-1 bg-black text-white rounded text-sm" onClick={() => openAddColumn(t)}>Add coloum</button>
                      </>
                    )}
                    {canEdit ? (
                      <button className="text-sm text-gray-600" onClick={() => handleDeleteTable(t._id)}>Delete</button>
                    ) : null}
                  </div>
                </div>

                {/* render table */}
                <div className="overflow-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {(t.columns || []).map((c, idx) => (
                          <th key={idx} className="text-left p-2 border">{c.label}</th>
                        ))}
                        <th className="p-2 border whitespace-nowrap w-px">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rowsByTable[t._id] || []).map(row => (
                        <tr key={row._id} className="border-b">
                          {(t.columns || []).map((c, idx) => (
                            <td key={idx} className="p-2 border">{String((row.values || {})[c.label] ?? '')}</td>
                          ))}
                          <td className="p-2 border whitespace-nowrap w-px">
                            <div className="flex gap-2">
                              {(() => {
                                const userColumn = (t.columns || []).find(c => c.type === 'user');
                                if (!userColumn) return null;
                                const rowUser = (row.values || {})[userColumn.label] || '';
                                const canConfirm = !!rowUser && rowUser === currentUsername && !row.confirmed;
                                const confirmClass = row.confirmed
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-blue-600 border border-blue-600';
                                return (
                                  <button
                                    className={`text-sm px-2 py-1 rounded ${confirmClass} ${canConfirm ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    onClick={() => (canConfirm ? handleConfirmRow(t, row) : null)}
                                    disabled={!canConfirm}
                                  >
                                    Confirm
                                  </button>
                                );
                              })()}
                              {canEdit ? (
                                <>
                                  <button className={`text-sm ${row.confirmed ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`} onClick={() => (row.confirmed ? null : openEditRow(t, row))}>
                                    Sửa
                                  </button>
                                  <button className="text-sm text-red-600" onClick={() => handleDeleteRow(t._id, row._id)}>Xóa</button>
                                </>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Tạo bảng mới</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="border p-2 rounded" placeholder="Tên bảng" value={tableName} onChange={e => setTableName(e.target.value)} />
              <textarea className="border p-2 rounded" placeholder="Mô tả (tùy chọn)" value={tableDesc} onChange={e => setTableDesc(e.target.value)} />

              <div className="border p-3 rounded">
                <div className="font-medium mb-2">Cột</div>
                <div className="flex gap-2 mb-2">
                  <input className="border p-2 rounded flex-1" placeholder="Label" value={colLabel} onChange={e => setColLabel(e.target.value)} />
                  <select className="border p-2 rounded" value={colType} onChange={e => setColType(e.target.value)}>
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="boolean">boolean</option>
                    <option value="user">user</option>
                  </select>
                  <input className="border p-2 rounded flex-1" placeholder="Mô tả" value={colDesc} onChange={e => setColDesc(e.target.value)} />
                  <button className="bg-blue-600 text-white px-3 rounded" onClick={addColumn}>Thêm</button>
                </div>
                <div className="space-y-2">
                  {columns.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <div className="font-medium">{c.label} <span className="text-sm text-gray-500">({c.type})</span></div>
                        <div className="text-sm text-gray-600">{c.description}</div>
                      </div>
                      <button className="text-red-500" onClick={() => removeColumn(idx)}>Xóa</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowAddTable(false)}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCreateTable}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showAddColumn && currentTableForColumn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm cột cho {currentTableForColumn.name}</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="border p-2 rounded" placeholder="Label" value={newColLabel} onChange={e => setNewColLabel(e.target.value)} />
              <select className="border p-2 rounded" value={newColType} onChange={e => setNewColType(e.target.value)}>
                <option value="text">text</option>
                <option value="number">number</option>
                <option value="date">date</option>
                <option value="boolean">boolean</option>
                <option value="user">user</option>
              </select>
              <input className="border p-2 rounded" placeholder="Mô tả (tùy chọn)" value={newColDesc} onChange={e => setNewColDesc(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => { setShowAddColumn(false); setCurrentTableForColumn(null); }}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCreateColumn}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Row Modal */}
      {showAddRow && currentTableForRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">{editingRow ? 'Sửa row' : 'Thêm row'} - {currentTableForRow.name}</h3>
            <div className="grid grid-cols-1 gap-3">
              {(currentTableForRow.columns || []).map((c, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">{c.label}</label>
                  {c.type === 'number' ? (
                    <input type="number" className="border p-2 rounded w-full" value={rowValues[c.label] || ''} onChange={e => setRowValues(prev => ({ ...prev, [c.label]: e.target.value }))} />
                  ) : c.type === 'date' ? (
                    <input type="date" className="border p-2 rounded w-full" value={rowValues[c.label] || ''} onChange={e => setRowValues(prev => ({ ...prev, [c.label]: e.target.value }))} />
                  ) : c.type === 'boolean' ? (
                    <select className="border p-2 rounded w-full" value={rowValues[c.label] || ''} onChange={e => setRowValues(prev => ({ ...prev, [c.label]: e.target.value }))}>
                      <option value="">(chọn)</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : c.type === 'user' ? (
                    <select className="border p-2 rounded w-full" value={rowValues[c.label] || ''} onChange={e => setRowValues(prev => ({ ...prev, [c.label]: e.target.value }))}>
                      <option value="">(trống)</option>
                      {users.map(user => (
                        <option key={user._id} value={user.username}>{user.username}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" className="border p-2 rounded w-full" value={rowValues[c.label] || ''} onChange={e => setRowValues(prev => ({ ...prev, [c.label]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => { setShowAddRow(false); setEditingRow(null); }}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmitRow}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
