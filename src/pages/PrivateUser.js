import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PrivateUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUser(storedUser || "Người dùng");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Xin chào, {user}</h2>
          <p className="text-gray-600">Nội dung trang này sẽ được cập nhật ở phiên bản tiếp theo.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivateUser;
