import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserInDepartment = ({ department }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (department?._id) {
      fetchUsers();
    }
  }, [department]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Filter users that belong to this department
      const filteredUsers = res.data.filter(user => 
        user.department_id === department._id || 
        (typeof user.department_id === 'object' && user.department_id?._id === department._id)
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err);
        alert('Lỗi khi xóa người dùng');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Người dùng thuộc bộ phận: {department?.name}
      </h3>
      
      {users.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Tên đăng nhập</th>
                <th className="border px-4 py-2">Họ và tên</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Chức vụ</th>
                <th className="border px-4 py-2">Quyền</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="text-center">
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.fullName || 'N/A'}</td>
                  <td className="border px-4 py-2">{user.email || 'N/A'}</td>
                  <td className="border px-4 py-2">{user.position || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {user.role === 'no' && 'Không được phép đăng nhập'}
                    {user.role === 'view' && 'Chỉ xem'}
                    {user.role === 'edit' && 'Xem và sửa'}
                    {user.role === 'admin' && 'Admin'}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-2 rounded transition-all hover:shadow-lg active:scale-95" 
                        onClick={() => handleViewUser(user)}
                        title="Xem thông tin"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-2 rounded transition-all hover:shadow-lg active:scale-95" 
                        onClick={() => handleDeleteUser(user._id)}
                        title="Xóa người dùng"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Chưa có người dùng nào thuộc bộ phận này</p>
        </div>
      )}

      {/* Modal hiển thị thông tin user */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin người dùng</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Tên đăng nhập:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.username}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Họ và tên:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.fullName || 'N/A'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Ngày sinh:</span>
                <span className="text-gray-600 w-2/3">{formatDate(selectedUser.dateOfBirth)}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Email:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.email || 'N/A'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Bộ phận:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.department || 'N/A'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Tiểu đội:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.squad || 'N/A'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Chức vụ:</span>
                <span className="text-gray-600 w-2/3">{selectedUser.position || 'N/A'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/3">Quyền:</span>
                <span className="text-gray-600 w-2/3">
                  {selectedUser.role === 'no' ? 'Không được phép đăng nhập' : 
                   selectedUser.role === 'view' ? 'Chỉ xem' : 
                   selectedUser.role === 'edit' ? 'Xem và sửa' : 
                   selectedUser.role}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInDepartment;
