import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // Lấy từ localStorage
    setUser(storedUser || "Người dùng"); // Nếu không có thì mặc định là "Người dùng"
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
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
        </nav>
        {/* Logout button at the bottom */}
        <button
          className="mt-auto bg-white-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">📋 Dashboard</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;