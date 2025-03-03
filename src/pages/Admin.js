import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách người dùng:', err);
      }
    };

    fetchUsers();
  }, [API_URL]);

  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(`${API_URL}/admin/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(user => user._id === id ? { ...user, role } : user));
    } catch (err) {
      console.error('Lỗi khi cập nhật quyền người dùng:', err);
    }
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
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="p-5 relative">
      {/* Logout button at the top right */}
      <button
        className="absolute top-5 right-5 text-black px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
      <h1 className="text-xl font-bold mb-5">Quản lý người dùng</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Tên đăng nhập</th>
            <th className="border px-4 py-2">Quyền</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>user.role!=="admin" && (
            <tr key={user._id} className="text-center">
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="no">Không được phép đăng nhập</option>
                  <option value="view">Chỉ xem</option>
                  <option value="edit">Xem và sửa</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDeleteUser(user._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;