import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import ListMayTho from "./components/maytho/ListMayTho";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard"; // Nếu đã đăng nhập, chuyển luôn sang Dashboard
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username); // Lưu username vào localStorage
      window.location.href = "/dashboard"; // Chuyển hướng
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi hệ thống");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Đăng nhập
          </button>
        </form>
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
};

// Kiểm tra nếu chưa đăng nhập, chuyển hướng về Login
const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
          <Route path="may-tho" element={<ListMayTho />} />
          <Route path="may-cuu-sinh" element={<h1>Danh sách máy cứu sinh</h1>} />
          <Route path="may-p34" element={<h1>Danh sách máy P34</h1>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
