import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListMayTho from "../components/maytho/ListMayTho";

function Dashboard() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // Lấy từ localStorage
    setUser(storedUser || "Người dùng"); // Nếu không có thì mặc định là "Người dùng"
  }, []);

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
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">📋 Dashboard</h1>
        <ListMayTho />
      </div>
    </div>
  );
}

export default Dashboard;
