import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecordDetails = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tables, setTables] = useState([]);
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
  const [showEditTable, setShowEditTable] = useState(false);
  const [currentTableForEdit, setCurrentTableForEdit] = useState(null);
  const [editTableName, setEditTableName] = useState('');
  const [editTableColumns, setEditTableColumns] = useState([]);
  const [newColLabel, setNewColLabel] = useState('');
  const [newColType, setNewColType] = useState('text');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColOptions, setNewColOptions] = useState([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionInput, setOptionInput] = useState('');
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [isEditTableContext, setIsEditTableContext] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [currentColumnForAdvanced, setCurrentColumnForAdvanced] = useState(null);
  const [showAutoFillConfig, setShowAutoFillConfig] = useState(false);
  const [autoFillRules, setAutoFillRules] = useState({});
  const [users, setUsers] = useState([]);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTableForShare, setCurrentTableForShare] = useState(null);
  const [searchUserInput, setSearchUserInput] = useState('');
  const [filteredUsersForShare, setFilteredUsersForShare] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [currentTableForLock, setCurrentTableForLock] = useState(null);
  const [showTimeFilterModal, setShowTimeFilterModal] = useState(false);
  const [currentTableForTimeFilter, setCurrentTableForTimeFilter] = useState(null);
  const [timeFilterByTable, setTimeFilterByTable] = useState({});
  const [openColumnDesc, setOpenColumnDesc] = useState({ tableId: null, label: null });
  const [sumConfigsByTable, setSumConfigsByTable] = useState({});
  const [showSumConfigModal, setShowSumConfigModal] = useState(false);
  const [sumConfigDraft, setSumConfigDraft] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || '';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`${API_BASE}/records/${id}`, {
          headers: { ...getAuthHeaders() }
        });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
    setTables([]);
    setRowsByTable({});
    fetchTables();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openColumnDesc.tableId && !event.target.closest('.column-desc-trigger')) {
        setOpenColumnDesc({ tableId: null, label: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openColumnDesc]);

  const fetchTables = async () => {
    try {
      const res = await fetch(`${API_BASE}/tables?record=${id}`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Failed to load tables');
      const data = await res.json();
      setTables(data);
      data.forEach((t) => fetchRowsForTable(t._id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRowsForTable = async (tableId) => {
    try {
      const res = await fetch(`${API_BASE}/rows?table=${tableId}`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Failed to load rows');
      const data = await res.json();
      setRowsByTable((prev) => ({ ...prev, [tableId]: data }));
    } catch (err) {
      console.error(err);
      setRowsByTable((prev) => ({ ...prev, [tableId]: [] }));
    }
  };

  const role = localStorage.getItem('role');
  const canEdit = role === 'edit' || role === 'admin';
  const currentUserId = localStorage.getItem('userId') || '';

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

  const toggleColumnDesc = (tableId, label) => {
    setOpenColumnDesc((prev) => {
      if (prev.tableId === tableId && prev.label === label) {
        return { tableId: null, label: null };
      }
      return { tableId, label };
    });
  };

  const addColumn = () => {
    if (!colLabel.trim()) return;
    const newCol = { label: colLabel, type: colType, description: colDesc };
    if (colType === 'selection') {
      newCol.options = newColOptions;
    }
    setColumns((prev) => [...prev, newCol]);
    setColLabel('');
    setColType('text');
    setColDesc('');
    setNewColOptions([]);
  };

  const removeColumn = (index) => {
    setColumns((prev) => prev.filter((_, i) => i !== index));
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
        body: JSON.stringify({
          record_id: id,
          name: tableName,
          description: tableDesc,
          columns
        })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Lỗi khi tạo bảng');
      }
      const created = await res.json();
      setTables((prev) => [created, ...prev]);
      setShowAddTable(false);
      setTableName('');
      setTableDesc('');
      setColumns([]);
      setRowsByTable((prev) => ({ ...prev, [created._id]: [] }));
    } catch (err) {
      window.alert('Lỗi khi thêm bảng: ' + err.message);
    }
  };

  const openAddRow = (table) => {
    const initial = {};
    (table.columns || []).forEach((c) => {
      if (c.type === 'user') {
        initial[c.label] = { userId: '', confirmedAt: null };
      } else {
        initial[c.label] = '';
      }
    });
    setCurrentTableForRow(table);
    setRowValues(initial);
    setEditingRow(null);
    setShowAddRow(true);
  };

  const openEditTable = (table) => {
    setCurrentTableForEdit(table);
    setEditTableName(table.name);
    setEditTableColumns([...(table.columns || [])]);
    setNewColLabel('');
    setNewColType('text');
    setNewColDesc('');
    setNewColOptions([]);
    setShowEditTable(true);
  };

  const handleAddColumnToEdit = () => {
    if (!newColLabel.trim()) return window.alert('Label không được để trống');
    const newCol = { label: newColLabel, type: newColType, description: newColDesc };
    if (newColType === 'selection') {
      newCol.options = newColOptions;
    }
    setEditTableColumns((prev) => [...prev, newCol]);
    setNewColLabel('');
    setNewColType('text');
    setNewColDesc('');
    setNewColOptions([]);
  };

  const handleUpdateColumnInEdit = (index, field, value) => {
    setEditTableColumns((prev) => 
      prev.map((col, i) => {
        if (i === index) {
          const updated = { ...col, [field]: value };
          if (field === 'type' && value !== 'selection') {
            delete updated.options;
          }
          return updated;
        }
        return col;
      })
    );
  };

  const handleRemoveColumnFromEdit = (index) => {
    if (!window.confirm('Bạn có chắc muốn xóa cột này?')) return;
    setEditTableColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) return window.alert('Lựa chọn không được để trống');
    if (newColOptions.includes(optionInput.trim())) {
      return window.alert('Lựa chọn này đã tồn tại');
    }
    setNewColOptions((prev) => [...prev, optionInput.trim()]);
    setOptionInput('');
  };

  const handleRemoveOption = (index) => {
    if (!window.confirm('Bạn có chắc muốn xóa lựa chọn này?')) return;
    setNewColOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveOptions = () => {
    if (isEditTableContext && editingOptionIndex !== null) {
      // Update existing column options in edit table
      setEditTableColumns((prev) =>
        prev.map((col, i) => (i === editingOptionIndex ? { ...col, options: newColOptions } : col))
      );
    }
    // For new columns, options are already in newColOptions state
    setShowOptionsModal(false);
    setOptionInput('');
    setEditingOptionIndex(null);
  };

  const handleCancelOptions = () => {
    setShowOptionsModal(false);
    setOptionInput('');
    setEditingOptionIndex(null);
    if (!isEditTableContext) {
      // Reset options if canceling in add table context
      setNewColOptions([]);
    }
  };

  const openAdvancedFeatures = (columnIndex, context) => {
    const col = context === 'edit' ? editTableColumns[columnIndex] : columns[columnIndex];
    setCurrentColumnForAdvanced({ index: columnIndex, context, column: col });
    setShowAdvancedFeatures(true);
  };

  const openAdvancedFeaturesForTableColumn = (table, column, context = 'view') => {
    setCurrentColumnForAdvanced({
      context,
      column,
      tableId: table._id,
      table
    });
    setShowAdvancedFeatures(true);
  };

  const openAutoFillConfig = () => {
    if (!currentColumnForAdvanced) return;
    const col = currentColumnForAdvanced.column;
    setAutoFillRules(col.autoFill || {});
    setShowAdvancedFeatures(false);
    setShowAutoFillConfig(true);
  };

  const openSumConfigModal = () => {
    if (!currentColumnForAdvanced) return;
    const draft = getSumConfig(
      currentColumnForAdvanced.tableId,
      currentColumnForAdvanced.column.label
    );
    setSumConfigDraft({ ...draft });
    setShowAdvancedFeatures(false);
    setShowSumConfigModal(true);
  };

  const handleSaveAutoFill = () => {
    if (!currentColumnForAdvanced) return;
    const { index, context } = currentColumnForAdvanced;
    
    if (context === 'edit') {
      setEditTableColumns((prev) =>
        prev.map((col, i) => (i === index ? { ...col, autoFill: autoFillRules } : col))
      );
    } else {
      setColumns((prev) =>
        prev.map((col, i) => (i === index ? { ...col, autoFill: autoFillRules } : col))
      );
    }
    
    setShowAutoFillConfig(false);
    setCurrentColumnForAdvanced(null);
    setAutoFillRules({});
  };

  const handleAutoFillRuleChange = (optionValue, targetColumn, fillValue) => {
    setAutoFillRules((prev) => ({
      ...prev,
      [optionValue]: {
        ...(prev[optionValue] || {}),
        [targetColumn]: fillValue
      }
    }));
  };

  const handleSelectionChange = (table, columnLabel, selectedValue) => {
    const column = (table.columns || []).find(c => c.label === columnLabel);
    if (column && column.autoFill && column.autoFill[selectedValue]) {
      const fills = column.autoFill[selectedValue];
      setRowValues((prev) => ({
        ...prev,
        [columnLabel]: selectedValue,
        ...fills
      }));
    } else {
      setRowValues((prev) => ({ ...prev, [columnLabel]: selectedValue }));
    }
  };

  const handleSaveTableEdit = async () => {
    if (!currentTableForEdit || !editTableName.trim()) return window.alert('Tên bảng không được để trống');
    if (editTableColumns.length === 0) return window.alert('Bảng phải có ít nhất một cột');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tables/${currentTableForEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ 
          name: editTableName,
          columns: editTableColumns 
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setTables((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setShowEditTable(false);
      setCurrentTableForEdit(null);
    } catch (err) {
      window.alert('Lỗi khi cập nhật bảng: ' + err.message);
    }
  };

  const openEditRow = (table, row) => {
    if (isRowFullyConfirmed(table, row)) {
      window.alert('Row đã được xác nhận đầy đủ, không thể sửa.');
      return;
    }
    const normalizedValues = { ...(row.values || {}) };
    (table.columns || []).forEach((c) => {
      if (c.type === 'user') {
        const cell = normalizedValues[c.label];
        if (cell && typeof cell !== 'object') {
          normalizedValues[c.label] = { userId: cell, confirmedAt: null };
        } else if (!cell) {
          normalizedValues[c.label] = { userId: '', confirmedAt: null };
        }
      }
    });
    setCurrentTableForRow(table);
    setRowValues(normalizedValues);
    setEditingRow(row);
    setShowAddRow(true);
  };

  const handleSubmitRow = async () => {
    if (!currentTableForRow) return;
    try {
      const token = localStorage.getItem('token');
      if (editingRow) {
        const res = await fetch(`${API_BASE}/rows/${editingRow._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ values: rowValues })
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setRowsByTable((prev) => ({
          ...prev,
          [currentTableForRow._id]: prev[currentTableForRow._id].map((r) => (r._id === updated._id ? updated : r))
        }));
      } else {
        const res = await fetch(`${API_BASE}/rows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ tables_id: currentTableForRow._id, values: rowValues })
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setRowsByTable((prev) => ({
          ...prev,
          [currentTableForRow._id]: [created, ...(prev[currentTableForRow._id] || [])]
        }));
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
      setRowsByTable((prev) => ({
        ...prev,
        [tableId]: (prev[tableId] || []).filter((r) => r._id !== rowId)
      }));
    } catch (err) {
      window.alert('Lỗi khi xóa row: ' + err.message);
    }
  };

  const getUserById = (userId) => users.find((u) => u._id === userId);

  const isRowFullyConfirmed = (table, row) => {
    const userColumns = (table.columns || []).filter((c) => c.type === 'user');
    if (userColumns.length === 0) return false;
    return userColumns.every((c) => {
      const cell = (row.values || {})[c.label];
      if (!cell || typeof cell !== 'object') return false;
      return !!cell.confirmedAt;
    });
  };

  const handleConfirmCell = async (table, row, columnLabel) => {
    const cell = (row.values || {})[columnLabel];
    const userId = typeof cell === 'object' ? cell.userId : cell;
    if (!userId || userId !== currentUserId) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xác nhận cột "${columnLabel}"? Sau khi tất cả user xác nhận, row này sẽ không thể chỉnh sửa được nữa.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const newValues = {
        ...(row.values || {}),
        [columnLabel]: { userId, confirmedAt: new Date().toISOString() }
      };
      const res = await fetch(`${API_BASE}/rows/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ values: newValues })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setRowsByTable((prev) => ({
        ...prev,
        [table._id]: (prev[table._id] || []).map((r) => (r._id === updated._id ? updated : r))
      }));
    } catch (err) {
      window.alert('Lỗi khi xác nhận: ' + err.message);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Bạn có chắc muốn xóa table này?')) return;
    try {
      const res = await fetch(`${API_BASE}/tables/${tableId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setTables((prev) => prev.filter((t) => t._id !== tableId));
      setRowsByTable((prev) => {
        const copy = { ...prev };
        delete copy[tableId];
        return copy;
      });
    } catch (err) {
      window.alert('Lỗi khi xóa table: ' + err.message);
    }
  };

  const openShareModal = (table) => {
    setCurrentTableForShare(table);
    setSearchUserInput('');
    setShowShareModal(true);
    updateFilteredUsers('', table);
  };

  const updateFilteredUsers = (search, table) => {
    if (!table || !users) {
      setFilteredUsersForShare([]);
      return;
    }
    const editableUserIds = (table.editableUsers || []).map(u => typeof u === 'object' ? u._id : u);
    const filtered = users.filter(user => {
      const isAlreadyEditable = editableUserIds.includes(user._id);
      const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && !isAlreadyEditable && user.role !== 'no' && user.role !== 'admin';
    });
    setFilteredUsersForShare(filtered);
  };

  const handleGrantEditPermission = async (userId) => {
    const userToGrant = filteredUsersForShare.find(u => u._id === userId);
    if (!currentTableForShare || !userToGrant) return;
    
    if (!window.confirm(`Bạn có chắc chắn muốn cấp quyền edit cho ${userToGrant.username}?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tables/${currentTableForShare._id}/grant-edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setTables((prev) => prev.map((t) => (t._id === result.table._id ? result.table : t)));
      setCurrentTableForShare(result.table);
      updateFilteredUsers(searchUserInput, result.table);
    } catch (err) {
      window.alert('Lỗi khi cấp quyền: ' + err.message);
    }
  };

  const handleRevokeEditPermission = async (userId) => {
    const userToRevoke = (currentTableForShare.editableUsers || []).find(u => (typeof u === 'object' ? u._id : u) === userId);
    if (!currentTableForShare || !userToRevoke) return;
    
    const username = typeof userToRevoke === 'object' ? userToRevoke.username : userToRevoke;
    const isSelf = userId === currentUserId;
    
    const confirmMessage = isSelf 
      ? `⚠️ Cảnh báo: Bạn đang thu hồi quyền edit bảng "${currentTableForShare.name}" của chính mình. Bạn có chắc chắn muốn tiếp tục?`
      : `Bạn có chắc chắn muốn thu hồi quyền edit từ ${username}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tables/${currentTableForShare._id}/revoke-edit/${userId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setTables((prev) => prev.map((t) => (t._id === result.table._id ? result.table : t)));
      setCurrentTableForShare(result.table);
      updateFilteredUsers(searchUserInput, result.table);
    } catch (err) {
      window.alert('Lỗi khi thu hồi quyền: ' + err.message);
    }
  };

  const checkCanEditTable = (table) => {
    if (canEdit) return true;
    if (!table.editableUsers) return false;
    const editableUserIds = table.editableUsers.map(u => typeof u === 'object' ? u._id : u);
    return editableUserIds.includes(currentUserId);
  };

  const getLockColorClass = (state) => {
    if (state === 'lockedTight') return 'bg-red-500 hover:bg-red-600';
    if (state === 'lockedOpen') return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  const openLockModal = (table) => {
    if (showLockModal && currentTableForLock && currentTableForLock._id === table._id) {
      closeLockModal();
      return;
    }
    setCurrentTableForLock(table);
    setShowLockModal(true);
  };

  const closeLockModal = () => {
    setShowLockModal(false);
    setCurrentTableForLock(null);
  };

  const handleUpdateTableState = async (newState) => {
    if (!currentTableForLock) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tables/${currentTableForLock._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ state: newState })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setTables((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      closeLockModal();
    } catch (err) {
      window.alert('Lỗi khi cập nhật trạng thái bảng: ' + err.message);
    }
  };

  const openTimeFilterModal = (table) => {
    if (showTimeFilterModal && currentTableForTimeFilter && currentTableForTimeFilter._id === table._id) {
      closeTimeFilterModal();
      return;
    }
    setCurrentTableForTimeFilter(table);
    setShowTimeFilterModal(true);
  };

  const closeTimeFilterModal = () => {
    setShowTimeFilterModal(false);
    setCurrentTableForTimeFilter(null);
  };

  const handleSetTimeFilter = (tableId, filterType) => {
    setTimeFilterByTable((prev) => ({
      ...prev,
      [tableId]: filterType
    }));
    closeTimeFilterModal();
  };

  const getFilteredRows = (tableId) => {
    const rows = rowsByTable[tableId] || [];
    const filterType = timeFilterByTable[tableId] || '3days';
    
    if (filterType === 'all') return rows;
    
    const now = new Date();
    let cutoffDate;
    
    switch (filterType) {
      case '1year':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case '1month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '1week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '3days':
      default:
        cutoffDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
    }
    
    return rows.filter(row => {
      if (!row.createdAt) return true;
      const rowDate = new Date(row.createdAt);
      return rowDate >= cutoffDate;
    });
  };

  const getTimeFilterLabel = (filterType) => {
    switch (filterType) {
      case 'all': return 'Tất cả';
      case '1year': return '1 năm trước';
      case '1month': return '1 tháng trước';
      case '1week': return '1 tuần trước';
      case '3days':
      default:
        return '3 ngày trước';
    }
  };

  const getSumConfig = (tableId, label) => {
    const tableConfig = sumConfigsByTable[tableId] || {};
    return tableConfig[label] || { mode: 'all', groupBy: '' };
  };

  const updateSumConfig = (tableId, label, nextConfig) => {
    setSumConfigsByTable((prev) => ({
      ...prev,
      [tableId]: {
        ...(prev[tableId] || {}),
        [label]: nextConfig
      }
    }));
  };

  const parseNumberValue = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(String(value).replace(/,/g, ''));
    return Number.isNaN(num) ? 0 : num;
  };

  const getGroupLabel = (table, groupBy, rawValue) => {
    if (rawValue === null || rawValue === undefined || rawValue === '') return '(trống)';
    const col = (table.columns || []).find((c) => c.label === groupBy);
    if (!col) return String(rawValue);
    if (col.type === 'user') {
      const userId = typeof rawValue === 'object' ? rawValue.userId : rawValue;
      const user = userId ? getUserById(userId) : null;
      return user ? user.username : String(userId || '(trống)');
    }
    if (col.type === 'boolean') {
      const val = String(rawValue).toLowerCase();
      if (val === 'true') return 'Đúng';
      if (val === 'false') return 'Sai';
    }
    if (col.type === 'date') {
      const date = new Date(rawValue);
      return Number.isNaN(date.getTime()) ? String(rawValue) : date.toLocaleDateString();
    }
    return String(rawValue);
  };

  const renderTableSums = (table) => {
    const tableConfig = sumConfigsByTable[table._id] || {};
    const numberColumns = (table.columns || []).filter(
      (c) => c.type === 'number' && tableConfig[c.label] && c.label !== 'hiddenColumn'
    );
    if (numberColumns.length === 0) return null;

    const rows = getFilteredRows(table._id);

    return (
      <div className="mt-3 border-t pt-3 text-sm text-gray-700">
        <div className="font-medium mb-2">Tổng hợp</div>
        <div className="space-y-2">
          {numberColumns.map((col) => {
            const config = tableConfig[col.label];
            if (config.mode === 'group') {
              if (!config.groupBy) {
                return (
                  <div key={col.label} className="text-xs text-gray-500">
                    Chưa chọn cột nhóm cho {col.label}
                  </div>
                );
              }
              const grouped = rows.reduce((acc, row) => {
                const raw = (row.values || {})[config.groupBy];
                const key = getGroupLabel(table, config.groupBy, raw);
                const value = parseNumberValue((row.values || {})[col.label]);
                acc[key] = (acc[key] || 0) + value;
                return acc;
              }, {});

              return (
                <div key={col.label} className="space-y-1">
                  <div className="font-medium">Tổng {col.label} theo {config.groupBy}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {Object.keys(grouped).map((groupKey) => (
                      <div key={groupKey} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                        <span className="text-gray-600">{groupKey}</span>
                        <span className="font-medium">{grouped[groupKey].toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const sum = rows.reduce((acc, row) => (
              acc + parseNumberValue((row.values || {})[col.label])
            ), 0);

            return (
              <div key={col.label} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                <span className="text-gray-600">Tổng {col.label}</span>
                <span className="font-medium">{sum.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  if (!record) return <div>Không tìm thấy record</div>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{record.name}</h2>
          <p className="mt-2 text-gray-700">{record.description || 'Không có mô tả'}</p>
          <div className="mt-4">
            <small className="text-gray-500">Ngày tạo: {new Date(record.createdAt).toLocaleString()}</small>
          </div>
        </div>
        {record.image_url && (
          <div className="flex-shrink-0">
            <img 
              src={record.image_url} 
              alt={record.name}
              className="w-48 h-48 object-cover rounded-lg border shadow-sm"
            />
          </div>
        )}
      </div>

      <section className="mt-6">
        {canEdit ? (
          <button className="px-3 py-1 bg-gray-600 text-white rounded mb-3" onClick={() => setShowAddTable(true)}>
            Thêm bảng
          </button>
        ) : null}
        
        {tables.length === 0 ? (
          <div className="text-gray-500">Chưa có bảng nào</div>
        ) : (
          <div className="space-y-6">
            {tables.map((t) => (
              <div key={t._id} className="border rounded p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{t.name}</div>
                    <div className="relative">
                      <button 
                        onClick={() => openTimeFilterModal(t)}
                        className="px-2 py-1 bg-white text-black border border-black rounded text-xs hover:bg-gray-100"
                        title={`Lọc theo thời gian: ${getTimeFilterLabel(timeFilterByTable[t._id] || '3days')}`}
                      >
                        Xem
                      </button>
                      {showTimeFilterModal && currentTableForTimeFilter && currentTableForTimeFilter._id === t._id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={closeTimeFilterModal} />
                          <div className="absolute left-0 mt-2 w-48 rounded border bg-white shadow-lg z-50">
                            <button
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => handleSetTimeFilter(t._id, 'all')}
                            >
                              Hiển thị tất cả
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => handleSetTimeFilter(t._id, '1year')}
                            >
                              1 năm trước
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => handleSetTimeFilter(t._id, '1month')}
                            >
                              1 tháng trước
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => handleSetTimeFilter(t._id, '1week')}
                            >
                              1 tuần trước
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => handleSetTimeFilter(t._id, '3days')}
                            >
                              3 days ago
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    {canEdit ? (
                      <div className="relative">
                        <button
                          onClick={() => openLockModal(t)}
                          className={`px-2 py-1 text-white rounded text-sm ${getLockColorClass(t.state)}`}
                          title="Thay đổi trạng thái bảng"
                        >
                          🔒
                        </button>
                        {showLockModal && currentTableForLock && currentTableForLock._id === t._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={closeLockModal} />
                            <div className="absolute left-0 mt-2 w-56 rounded border bg-white shadow-lg z-50">
                              <button
                                className="w-full px-3 py-2 text-left text-sm hover:bg-green-50"
                                onClick={() => handleUpdateTableState('Openning')}
                              >
                                🟢Openning
                              </button>
                              <button
                                className="w-full px-3 py-2 text-left text-sm hover:bg-yellow-50"
                                onClick={() => handleUpdateTableState('lockedOpen')}
                              >
                                🟡Locked Open
                              </button>
                              <button
                                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50"
                                onClick={() => handleUpdateTableState('lockedTight')}
                              >
                                🔴Locked Tight
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                    {(canEdit || checkCanEditTable(t)) && (
                      <button 
                        onClick={() => openShareModal(t)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        title="Chia sẻ quyền edit"
                      >
                        📤
                      </button>
                    )}
                    
                  </div>
                  <div className="flex items-center gap-2">
                    {(role === 'edit' || role === 'admin' || checkCanEditTable(t)) && (
                      <>
                        <button className="px-2 py-1 bg-black text-white rounded text-sm" onClick={() => openAddRow(t)}>Thêm dòng</button>
                        <button className="px-2 py-1 bg-black text-white rounded text-sm" onClick={() => openEditTable(t)}>Chỉnh sửa bảng</button>
                      </>
                    )}
                    {canEdit ? (
                      <button className="text-sm text-gray-600" onClick={() => handleDeleteTable(t._id)}>Xóa</button>
                    ) : null}
                  </div>
                </div>

                <div className="overflow-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {(t.columns || []).map((c, idx) => (
                          <th key={idx} className="text-left p-2 border align-top relative">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="column-desc-trigger flex-1 text-left font-medium hover:text-gray-800"
                                onClick={() => toggleColumnDesc(t._id, c.label)}
                              >
                                <span>{c.label}</span>
                              </button>
                              
                            </div>
                            {openColumnDesc.tableId === t._id && openColumnDesc.label === c.label && (
                              <div className="column-desc-trigger absolute left-2 top-full mt-1 z-20 w-60 text-xs text-gray-700 bg-white border border-gray-200 rounded shadow-lg p-2">
                                {c.description || 'Không có mô tả'}
                              </div>
                            )}
                          </th>
                        ))}
                        <th className="p-2 border whitespace-nowrap w-px">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredRows(t._id).map((row) => (
                        <tr key={row._id} className="border-b">
                          {(t.columns || []).map((c, idx) => {
                            if (c.type !== 'user') {
                              return (
                                <td key={idx} className="p-2 border">{String((row.values || {})[c.label] ?? '')}</td>
                              );
                            }

                            const cell = (row.values || {})[c.label];
                            const cellUserId = typeof cell === 'object' ? cell.userId : cell;
                            const cellConfirmedAt = typeof cell === 'object' ? cell.confirmedAt : null;
                            const cellUser = cellUserId ? getUserById(cellUserId) : null;
                            const canConfirmCell = !!cellUserId && cellUserId === currentUserId && !cellConfirmedAt;
                            const isConfirmed = !!cellConfirmedAt;

                            return (
                              <td key={idx} className="p-2 border">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span>{cellUser ? cellUser.username : (cellUserId || '')}</span>
                                    <button
                                      className={`text-xs px-2 py-0.5 rounded ${isConfirmed ? 'bg-blue-600 text-white' : canConfirmCell ? 'text-blue-600 border border-blue-600' : 'text-gray-400 border border-gray-300 cursor-not-allowed'}`}
                                      onClick={() => (canConfirmCell ? handleConfirmCell(t, row, c.label) : null)}
                                      disabled={!canConfirmCell}
                                    >
                                      {isConfirmed ? 'Đã xác nhận' : 'Xác nhận'}
                                    </button>
                                  </div>
                                  {cellConfirmedAt ? (
                                    <div className="text-xs text-gray-500">{new Date(cellConfirmedAt).toLocaleString()}</div>
                                  ) : null}
                                </div>
                              </td>
                            );
                          })}
                          <td className="p-2 border whitespace-nowrap w-px">
                            <div className="flex gap-2">
                              {(canEdit || checkCanEditTable(t)) ? (
                                <>
                                  {(() => {
                                    const rowLocked = isRowFullyConfirmed(t, row);
                                    return (
                                      <>
                                        <button
                                          className={`text-sm ${rowLocked ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
                                          onClick={() => (rowLocked ? null : openEditRow(t, row))}
                                        >
                                          Sửa
                                        </button>
                                        <button
                                          className={`text-sm ${rowLocked ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'}`}
                                          onClick={() => (rowLocked ? null : handleDeleteRow(t._id, row._id))}
                                          disabled={rowLocked}
                                        >
                                          Xóa
                                        </button>
                                      </>
                                    );
                                  })()}
                                </>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderTableSums(t)}
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
              <input className="border p-2 rounded" placeholder="Tên bảng" value={tableName} onChange={(e) => setTableName(e.target.value)} />
              <textarea className="border p-2 rounded" placeholder="Mô tả (tùy chọn)" value={tableDesc} onChange={(e) => setTableDesc(e.target.value)} />

              <div className="border p-3 rounded">
                <div className="font-medium mb-2">Cột</div>
                <div className="flex gap-2 mb-2">
                  <input className="border p-2 rounded flex-1" placeholder="Nhãn" value={colLabel} onChange={(e) => setColLabel(e.target.value)} />
                  <select className="border p-2 rounded" value={colType} onChange={(e) => setColType(e.target.value)}>
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="boolean">boolean</option>
                    <option value="user">user</option>
                    <option value="selection">selection</option>
                  </select>
                  <input className="border p-2 rounded flex-1" placeholder="Mô tả" value={colDesc} onChange={(e) => setColDesc(e.target.value)} />
                  {colType === 'selection' && (
                    <button 
                      className="bg-black text-white px-3 rounded hover:bg-gray-800" 
                      onClick={() => { setShowOptionsModal(true); setIsEditTableContext(false); }}
                      title="Quản lý lựa chọn"
                    >
                      ⚙️
                    </button>
                  )}
                  <button className="bg-blue-600 text-white px-3 rounded" onClick={addColumn}>Thêm</button>
                </div>
                <div className="space-y-2">
                  {columns.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{c.label} <span className="text-sm text-gray-500">({c.type})</span></div>
                        <div className="text-sm text-gray-600">{c.description}</div>
                        {c.type === 'selection' && c.options && (
                          <div className="text-xs text-purple-600 mt-1">Lựa chọn: {c.options.join(', ')}</div>
                        )}
                        {c.type === 'selection' && c.autoFill && Object.keys(c.autoFill).length > 0 && (
                          <div className="text-xs text-green-600 mt-1">✓ Auto-fill được cấu hình</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {c.type === 'selection' && (
                          <button 
                            className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800" 
                            onClick={() => openAdvancedFeatures(idx, 'add')}
                            title="Chức năng mở rộng"
                          >
                            🔧
                          </button>
                        )}
                        <button className="text-red-500" onClick={() => removeColumn(idx)}>Xóa</button>
                      </div>
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

      {/* Edit Table Modal */}
      {showEditTable && currentTableForEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa bảng</h3>
            
            {/* Table Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên bảng</label>
              <input 
                className="border p-2 rounded w-full" 
                placeholder="Tên bảng" 
                value={editTableName} 
                onChange={e => setEditTableName(e.target.value)} 
              />
            </div>

            {/* Existing Columns */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Cột hiện tại</h4>
              <div className="space-y-2">
                {editTableColumns.map((col, idx) => (
                  <div key={idx} className="border rounded p-3 bg-gray-50">
                    <div className="flex gap-2 items-center">
                      <input 
                        className="flex-1 border p-2 rounded" 
                        placeholder="Label" 
                        value={col.label}
                        onChange={e => handleUpdateColumnInEdit(idx, 'label', e.target.value)}
                      />
                      <select 
                        className="w-32 border p-2 rounded" 
                        value={col.type}
                        onChange={e => handleUpdateColumnInEdit(idx, 'type', e.target.value)}
                      >
                        <option value="text">text</option>
                        <option value="number">number</option>
                        <option value="date">date</option>
                        <option value="boolean">boolean</option>
                        <option value="user">user</option>
                        <option value="selection">selection</option>
                      </select>
                      <input 
                        className="flex-1 border p-2 rounded" 
                        placeholder="Mô tả" 
                        value={col.description || ''}
                        onChange={e => handleUpdateColumnInEdit(idx, 'description', e.target.value)}
                      />
                      {col.type === 'selection' && (
                        <button 
                          className="px-3 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
                          onClick={() => {
                            setNewColOptions(col.options || []);
                            setShowOptionsModal(true);
                            setIsEditTableContext(true);
                            setEditingOptionIndex(idx);
                          }}
                          title="Quản lý lựa chọn"
                        >
                          ⚙️
                        </button>
                      )}
                      {col.type === 'selection' && (
                        <button 
                          className="px-3 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
                          onClick={() => openAdvancedFeatures(idx, 'edit')}
                          title="Chức năng mở rộng"
                        >
                          🔧
                        </button>
                      )}
                      {col.type === 'number' && currentTableForEdit && (
                        <button 
                          className="px-3 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
                          onClick={() => openAdvancedFeaturesForTableColumn(currentTableForEdit, col, 'table-edit')}
                          title="Chức năng mở rộng"
                        >
                          🔧
                        </button>
                      )}
                      <button 
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveColumnFromEdit(idx)}
                        title="Xóa cột"
                      >
                        ✕
                      </button>
                    </div>
                    {col.type === 'selection' && col.options && col.options.length > 0 && (
                      <div className="mt-2 text-xs text-purple-600">
                        Lựa chọn: {col.options.join(', ')}
                      </div>
                    )}
                    {col.type === 'selection' && col.autoFill && Object.keys(col.autoFill).length > 0 && (
                      <div className="mt-2 text-xs text-green-600">
                        ✓ Auto-fill được cấu hình
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Column */}
            <div className="mb-4 border-t pt-4">
              <h4 className="font-medium mb-2">Thêm cột mới</h4>
              <div className="flex gap-2 items-center">
                <input 
                  className="flex-1 border p-2 rounded" 
                  placeholder="Label" 
                  value={newColLabel} 
                  onChange={e => setNewColLabel(e.target.value)} 
                />
                <select 
                  className="w-32 border p-2 rounded" 
                  value={newColType} 
                  onChange={e => setNewColType(e.target.value)}
                >
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="date">date</option>
                  <option value="boolean">boolean</option>
                  <option value="user">user</option>
                  <option value="selection">selection</option>
                </select>
                <input 
                  className="flex-1 border p-2 rounded" 
                  placeholder="Mô tả" 
                  value={newColDesc} 
                  onChange={e => setNewColDesc(e.target.value)} 
                />
                {newColType === 'selection' && (
                  <button 
                    className="px-3 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
                    onClick={() => { setShowOptionsModal(true); setIsEditTableContext(true); setEditingOptionIndex(null); }}
                    title="Quản lý lựa chọn"
                  >
                    ⚙️
                  </button>
                )}
                <button 
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleAddColumnToEdit}
                  title="Thêm cột"
                >
                  +
                </button>
              </div>
              {newColType === 'selection' && newColOptions.length > 0 && (
                <div className="mt-2 text-xs text-purple-600">
                  Lựa chọn: {newColOptions.join(', ')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 rounded border hover:bg-gray-100" 
                onClick={() => { 
                  setShowEditTable(false); 
                  setCurrentTableForEdit(null); 
                }}
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" 
                onClick={handleSaveTableEdit}
              >
                Lưu thay đổi
              </button>
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
                      <option value="true">Đúng</option>
                      <option value="false">Sai</option>
                    </select>
                  ) : c.type === 'user' ? (
                    <select
                      className="border p-2 rounded w-full"
                      value={(rowValues[c.label] && rowValues[c.label].userId) || ''}
                      onChange={e => setRowValues(prev => ({
                        ...prev,
                        [c.label]: { userId: e.target.value, confirmedAt: (prev[c.label] || {}).confirmedAt || null }
                      }))}
                    >
                      <option value="">(trống)</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                      ))}
                    </select>
                  ) : c.type === 'selection' ? (
                    <select 
                      className="border p-2 rounded w-full" 
                      value={rowValues[c.label] || ''} 
                      onChange={e => handleSelectionChange(currentTableForRow, c.label, e.target.value)}
                    >
                      <option value="">(chọn)</option>
                      {(c.options || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
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

      {/* Share Edit Permission Modal */}
      {showShareModal && currentTableForShare && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl max-h-96 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Chia sẻ quyền edit - {currentTableForShare.name}</h3>
            
            {/* Danh sách user đã cấp quyền */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">User có quyền edit:</h4>
              {currentTableForShare.editableUsers && currentTableForShare.editableUsers.length > 0 ? (
                <div className="space-y-2">
                  {currentTableForShare.editableUsers.map(user => {
                    const userId = typeof user === 'object' ? user._id : user;
                    const userData = typeof user === 'object' ? user : getUserById(userId);
                    const displayName = userData ? userData.username : userId;
                    return (
                      <div key={userId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{displayName}</span>
                        <button 
                          onClick={() => handleRevokeEditPermission(userId)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Thu hồi
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa cấp quyền cho user nào</p>
              )}
            </div>

            {/* Tìm kiếm và cấp quyền */}
            <div>
              <h4 className="font-medium mb-2">Cấp quyền cho user:</h4>
              <input 
                type="text" 
                placeholder="Tìm kiếm user theo tên..."
                value={searchUserInput}
                onChange={(e) => {
                  setSearchUserInput(e.target.value);
                  updateFilteredUsers(e.target.value, currentTableForShare);
                }}
                className="border p-2 rounded w-full mb-3"
              />
              
              {filteredUsersForShare.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-auto">
                  {filteredUsersForShare.map(user => (
                    <div key={user._id} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <span>{user.username} <span className="text-xs text-gray-500">({user.role})</span></span>
                      <button 
                        onClick={() => handleGrantEditPermission(user._id)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Cấp quyền
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {searchUserInput ? 'Không tìm thấy người dùng phù hợp' : 'Nhập tên người dùng để tìm kiếm'}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => {
                  setShowShareModal(false);
                  setCurrentTableForShare(null);
                  setSearchUserInput('');
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Options Management Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Quản lý lựa chọn (Selection Options)</h3>
            
            {/* Add option input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  className="border p-2 rounded flex-1"
                  placeholder="Nhập lựa chọn mới..."
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleAddOption}
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Options list */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Danh sách lựa chọn:</h4>
              {newColOptions.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {newColOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{opt}</span>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleRemoveOption(idx)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có lựa chọn nào</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={handleCancelOptions}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSaveOptions}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Features Modal */}
      {showAdvancedFeatures && currentColumnForAdvanced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chức năng mở rộng</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cột: <span className="font-medium">{currentColumnForAdvanced.column.label}</span>
            </p>
            
            <div className="space-y-2">
              {currentColumnForAdvanced.column.type === 'selection' && (
                <button
                  className="w-full text-left px-4 py-3 border rounded hover:bg-gray-50 flex items-center justify-between"
                  onClick={openAutoFillConfig}
                >
                  <div>
                    <div className="font-medium">Tự động điền thông tin</div>
                    <div className="text-sm text-gray-500">Tự động điền các cột khác khi chọn giá trị</div>
                  </div>
                  <span className="text-xl">→</span>
                </button>
              )}
              {currentColumnForAdvanced.column.type === 'number' && ['view', 'table-edit'].includes(currentColumnForAdvanced.context) && (
                <button
                  className="w-full text-left px-4 py-3 border rounded hover:bg-gray-50 flex items-center justify-between"
                  onClick={openSumConfigModal}
                >
                  <div>
                    <div className="font-medium">Tính tổng các hàng</div>
                    <div className="text-sm text-gray-500">Chọn tổng toàn bộ hoặc tổng theo nhóm</div>
                  </div>
                  <span className="text-xl">→</span>
                </button>
              )}
              {currentColumnForAdvanced.column.type === 'number' && !['view', 'table-edit'].includes(currentColumnForAdvanced.context) && (
                <div className="text-sm text-gray-500">
                  Tính tổng chỉ khả dụng khi xem bảng.
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => {
                  setShowAdvancedFeatures(false);
                  setCurrentColumnForAdvanced(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Fill Configuration Modal */}
      {showAutoFillConfig && currentColumnForAdvanced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Cấu hình tự động điền</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cột: <span className="font-medium">{currentColumnForAdvanced.column.label}</span>
            </p>

            {currentColumnForAdvanced.column.options && currentColumnForAdvanced.column.options.length > 0 ? (
              <div className="space-y-4">
                {currentColumnForAdvanced.column.options.map((option, optIdx) => {
                  const allColumns = currentColumnForAdvanced.context === 'edit' 
                    ? editTableColumns 
                    : columns;
                  const otherColumns = allColumns.filter(
                    (col, idx) => idx !== currentColumnForAdvanced.index && col.type !== 'user'
                  );

                  return (
                    <div key={optIdx} className="border rounded p-4 bg-gray-50">
                      <h4 className="font-medium mb-3">
                        Khi chọn: <span className="text-blue-600">{option}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {otherColumns.map((col, colIdx) => (
                          <div key={colIdx} className="flex items-center gap-2">
                            <label className="text-sm font-medium w-32 truncate" title={col.label}>
                              {col.label}:
                            </label>
                            {col.type === 'selection' ? (
                              <select
                                className="flex-1 border p-2 rounded text-sm"
                                value={(autoFillRules[option] && autoFillRules[option][col.label]) || ''}
                                onChange={(e) => handleAutoFillRuleChange(option, col.label, e.target.value)}
                              >
                                <option value="">(không điền)</option>
                                {(col.options || []).map((opt, i) => (
                                  <option key={i} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : col.type === 'boolean' ? (
                              <select
                                className="flex-1 border p-2 rounded text-sm"
                                value={(autoFillRules[option] && autoFillRules[option][col.label]) || ''}
                                onChange={(e) => handleAutoFillRuleChange(option, col.label, e.target.value)}
                              >
                                <option value="">(không điền)</option>
                                <option value="true">Đúng</option>
                                <option value="false">Sai</option>
                              </select>
                            ) : col.type === 'date' ? (
                              <input
                                type="date"
                                className="flex-1 border p-2 rounded text-sm"
                                value={(autoFillRules[option] && autoFillRules[option][col.label]) || ''}
                                onChange={(e) => handleAutoFillRuleChange(option, col.label, e.target.value)}
                              />
                            ) : col.type === 'number' ? (
                              <input
                                type="number"
                                className="flex-1 border p-2 rounded text-sm"
                                placeholder="(không điền)"
                                value={(autoFillRules[option] && autoFillRules[option][col.label]) || ''}
                                onChange={(e) => handleAutoFillRuleChange(option, col.label, e.target.value)}
                              />
                            ) : (
                              <input
                                type="text"
                                className="flex-1 border p-2 rounded text-sm"
                                placeholder="(không điền)"
                                value={(autoFillRules[option] && autoFillRules[option][col.label]) || ''}
                                onChange={(e) => handleAutoFillRuleChange(option, col.label, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Cột này chưa có lựa chọn nào. Vui lòng thêm lựa chọn trước.</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => {
                  setShowAutoFillConfig(false);
                  setCurrentColumnForAdvanced(null);
                  setAutoFillRules({});
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSaveAutoFill}
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sum Configuration Modal */}
      {showSumConfigModal && currentColumnForAdvanced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tính tổng các hàng</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cột: <span className="font-medium">{currentColumnForAdvanced.column.label}</span>
            </p>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`sum-${currentColumnForAdvanced.tableId}-${currentColumnForAdvanced.column.label}`}
                  checked={(sumConfigDraft || {}).mode === 'all'}
                  onChange={() =>
                    setSumConfigDraft((prev) => ({
                      ...(prev || { mode: 'all', groupBy: '' }),
                      mode: 'all',
                      groupBy: ''
                    }))
                  }
                />
                Tổng toàn bộ hàng
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`sum-${currentColumnForAdvanced.tableId}-${currentColumnForAdvanced.column.label}`}
                  checked={(sumConfigDraft || {}).mode === 'group'}
                  onChange={() =>
                    setSumConfigDraft((prev) => ({
                      ...(prev || { mode: 'group', groupBy: '' }),
                      mode: 'group'
                    }))
                  }
                />
                Tổng theo nhóm
              </label>
              {(sumConfigDraft || {}).mode === 'group' && (
                <select
                  className="w-full border p-2 rounded text-sm"
                  value={(sumConfigDraft || {}).groupBy || ''}
                  onChange={(e) =>
                    setSumConfigDraft((prev) => ({
                      ...(prev || { mode: 'group', groupBy: '' }),
                      groupBy: e.target.value
                    }))
                  }
                >
                  <option value="">Chọn cột nhóm</option>
                  {(currentColumnForAdvanced.table?.columns || [])
                    .filter((col) => col.label !== currentColumnForAdvanced.column.label)
                    .map((col) => (
                      <option key={col.label} value={col.label}>
                        {col.label}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => {
                  setShowSumConfigModal(false);
                  setCurrentColumnForAdvanced(null);
                  setSumConfigDraft(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (!currentColumnForAdvanced || !sumConfigDraft) return;
                  updateSumConfig(
                    currentColumnForAdvanced.tableId,
                    currentColumnForAdvanced.column.label,
                    sumConfigDraft
                  );
                  setShowSumConfigModal(false);
                  setCurrentColumnForAdvanced(null);
                  setSumConfigDraft(null);
                }}
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDetails;
