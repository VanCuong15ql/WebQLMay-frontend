import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import ListMayTho from "./components/maytho/ListMayTho";
import MachineDetails from "./components/maytho/MachineDetails";
import ListMayCuuSinh from "./components/maycuusinh/ListMayCuuSinh";
import MayCuuSinhDetails from "./components/maycuusinh/MayCuuSinhDetails";
import ListmayP34 from "./components/mayP34/ListmayP34";
import MayP34Details from "./components/mayP34/MayP34Details";
import Admin from "./pages/Admin";
import Register from "./pages/Register";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const role = localStorage.getItem("role");
      if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "view" || role === "edit") {
        window.location.href = "/dashboard";
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username); // Lưu username vào localStorage
      localStorage.setItem("role", res.data.role); // Lưu role vào localStorage
      if (res.data.role === "admin") {
        window.location.href = "/admin"; // Chuyển hướng đến trang admin nếu là admin
      } else if (res.data.role === "view" || res.data.role === "edit") {
        window.location.href = "/dashboard"; // Chuyển hướng đến trang dashboard nếu không phải admin
      } else {
        setMessage("Bạn chưa được cấp quyền đăng nhập");
      }
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
        <p className="mt-4">
          Chưa có tài khoản? <a href="/register" className="text-blue-500">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

// Kiểm tra nếu chưa đăng nhập, chuyển hướng về Login
const PrivateRoute = ({ element, roles }) => {
  const role = localStorage.getItem("role");
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
          <Route path="may-tho" element={<ListMayTho />} />
          <Route path="may-tho/:id" element={<MachineDetails />} />
          <Route path="may-cuu-sinh" element={<ListMayCuuSinh />} />
          <Route path="may-cuu-sinh/:id" element={<MayCuuSinhDetails />} />
          <Route path="may-p34" element={<ListmayP34 />} />
          <Route path="may-p34/:id" element={<MayP34Details />} />
        </Route>
        <Route path="/admin" element={<PrivateRoute element={<Admin />} roles={['admin']} />} />
      </Routes>
    </Router>
  );
};

export default App;