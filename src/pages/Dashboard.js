import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // Lấy từ localStorage
    setUser(storedUser || "Người dùng"); // Nếu không có thì mặc định là "Người dùng"
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/categories`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const handleAddCategory = async () => {
    if (!catName.trim()) return window.alert('Tên category không được để trống');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: catName, description: catDesc })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Lỗi khi tạo category');
      }
      const created = await res.json();
      setCategories(prev => [created, ...prev]);
      setShowAdd(false);
      setCatName('');
      setCatDesc('');
    } catch (err) {
      window.alert('Lỗi khi thêm category: ' + err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Taskbar bên trái */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-5">👤 {user}</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard/may-tho" className="hover:bg-gray-700 p-2 rounded">
            📌 Danh sách máy thở
          </Link>
          <Link to="/dashboard/may-cuu-sinh" className="hover:bg-gray-700 p-2 rounded">
            🚑 Danh sách máy cứu sinh
          </Link>
          <Link to="/dashboard/may-p34" className="hover:bg-gray-700 p-2 rounded">
            🏥 Danh sách máy P34
          </Link>
          {/* Categories from API */}
          {categories.map(cat => (
            <Link key={cat._id} to={`/dashboard/categories/${cat._id}`} className="hover:bg-gray-700 p-2 rounded">
              🗂️ {cat.name}
            </Link>
          ))}
        </nav>

        {/* Admin-only Add category button and Logout button at the bottom */}
        <div className="mt-auto space-y-2">
          {localStorage.getItem('role') === 'edit' && (
            <button
              className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              onClick={() => setShowAdd(true)}
            >
              + Thêm category
            </button>
          )}

          <button
            className="w-full bg-white-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">📋 Dashboard</h1>
        <Outlet />
      </div>

      {/* Add Category Modal */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm Category</h3>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Tên category"
                value={catName}
                onChange={e => setCatName(e.target.value)}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Mô tả (tùy chọn)"
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowAdd(false)}>Hủy</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleAddCategory}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;