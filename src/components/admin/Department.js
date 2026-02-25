import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentDetail from './department/DepartmentDetail';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptId, setEditDeptId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDepartments(res.data);
      if (res.data.length > 0 && !selectedDepartment) {
        setSelectedDepartment(res.data[0]);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bộ phận:', err);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) {
      alert('Tên bộ phận không được để trống');
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/departments`,
        { name: newDeptName, user_id: localStorage.getItem('userId') },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDepartments([...departments, res.data]);
      setSelectedDepartment(res.data);
      setNewDeptName('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Lỗi khi thêm bộ phận:', err);
      alert('Lỗi khi thêm bộ phận');
    }
  };

  const handleEditDepartment = async () => {
    if (!editDeptName.trim()) {
      alert('Tên bộ phận không được để trống');
      return;
    }
    try {
      const res = await axios.put(
        `${API_URL}/departments/${editDeptId}`,
        { name: editDeptName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDepartments(departments.map(dept => dept._id === editDeptId ? res.data : dept));
      if (selectedDepartment?._id === editDeptId) {
        setSelectedDepartment(res.data);
      }
      setShowEditModal(false);
      setEditDeptName('');
      setEditDeptId(null);
      setActiveMenu(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật bộ phận:', err);
      alert('Lỗi khi cập nhật bộ phận');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ phận này không?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/departments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const newDepts = departments.filter(dept => dept._id !== id);
      setDepartments(newDepts);
      if (selectedDepartment?._id === id) {
        setSelectedDepartment(newDepts.length > 0 ? newDepts[0] : null);
      }
      setActiveMenu(null);
    } catch (err) {
      console.error('Lỗi khi xóa bộ phận:', err);
      alert('Lỗi khi xóa bộ phận');
    }
  };

  const openEditModal = (dept) => {
    setEditDeptId(dept._id);
    setEditDeptName(dept.name);
    setShowEditModal(true);
    setActiveMenu(null);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar taskbar */}
      <div className="w-64 bg-gray-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-400 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Danh sách bộ phận</h2>
        </div>

        {/* Department list */}
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {departments.map((dept) => (
            <div key={dept._id} className="relative">
              <button
                onClick={() => setSelectedDepartment(dept)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedDepartment?._id === dept._id
                    ? 'bg-gray-600 text-white rounded-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {dept.name}
              </button>
              {/* Menu button */}
              <button
                onClick={() => setActiveMenu(activeMenu === dept._id ? null : dept._id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-gray-600 hover:text-gray-800"
                title="Chức năng"
              >
                ⋮
              </button>
              {/* Active menu */}
              {activeMenu === dept._id && (
                <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded shadow-lg z-20 w-40">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    Đổi tên
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept._id)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="p-4 border-t border-gray-400 flex-shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Thêm bộ phận
          </button>
        </div>
      </div>

      {/* Detail area */}
      <div className="flex-1">
        {selectedDepartment ? (
          <DepartmentDetail department={selectedDepartment} onRefresh={fetchDepartments} />
        ) : (
          <div className="p-5">
            <p className="text-gray-600">Chọn một bộ phận để xem chi tiết</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm bộ phận</h2>
            <input
              type="text"
              placeholder="Tên bộ phận"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đổi tên bộ phận</h2>
            <input
              type="text"
              placeholder="Tên bộ phận"
              value={editDeptName}
              onChange={(e) => setEditDeptName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleEditDepartment}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
