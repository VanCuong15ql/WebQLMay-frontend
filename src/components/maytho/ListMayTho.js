import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListMayTho = () => {
    const [machines, setMachines] = useState([]);
    const [editMachine, setEditMachine] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    const role = localStorage.getItem("role");
    const [form, setForm] = useState({
        hoTen: "",
        soMay: "",
        bienChe: "",
        phongTram: "",
        soSeri: "",
        namSanXuat: "",
        nuocSanXuat: ""
    });
    const checkRole = () => {
        if (role !== "edit") {  
            window.alert("Bạn chưa được cấp quyền");
            return false;
        }
    }
    // 🔹 Lấy danh sách máy thở
    const fetchMachines = async () => {
        try {
            const res = await axios.get(`${API_URL}/machines`);
            setMachines(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách máy thở:", error);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    // 🔹 Xử lý form nhập liệu
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Thêm máy thở mới
    const handleAddMachine = async () => {
        if(checkRole() === false) return;
        try {
            const res = await axios.post(`${API_URL}/machines`, form);
            setMachines([...machines, res.data]);
            setForm({ hoTen: "", soMay: "", bienChe: "", phongTram: "", soSeri: "", namSanXuat: "", nuocSanXuat: "" });
        } catch (error) {
            console.error("Lỗi khi thêm máy thở:", error);
        }
    };

    // 🔹 Xóa máy thở
    const handleDeleteMachine = async (id) => {
        if(checkRole() === false) return;
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa máy thở này không?");
        if (confirmDelete) {
            try {
                await axios.delete(`${API_URL}/machines/${id}`);
                setMachines(machines.filter(machine => machine._id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa máy thở:", error);
            }
        }
    };

    // 🔹 Mở form chỉnh sửa máy thở
    const handleEditMachine = (machine) => {
        setEditMachine(machine);
        setForm(machine);
    };

    // 🔹 Cập nhật máy thở
    const handleUpdateMachine = async () => {
        if(checkRole() === false) return;
        try {
            const res = await axios.put(`${API_URL}/machines/${editMachine._id}`, form);
            setMachines(machines.map(machine => machine._id === editMachine._id ? res.data : machine));
            setEditMachine(null);
            setForm({ hoTen: "", soMay: "", bienChe: "", phongTram: "", soSeri: "", namSanXuat: "", nuocSanXuat: "" });
        } catch (error) {
            console.error("Lỗi khi cập nhật máy thở:", error);
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Danh sách máy thở</h1>

            {/* Form thêm máy thở */}
            <div className="mb-4">
                <input className="border p-2 m-1" type="text" name="hoTen" placeholder="Họ và tên" value={form.hoTen} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="soMay" placeholder="Số máy" value={form.soMay} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="bienChe" placeholder="Biên chế" value={form.bienChe} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="phongTram" placeholder="Phòng trạm" value={form.phongTram} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="soSeri" placeholder="Số sê ri" value={form.soSeri} onChange={handleChange} />
                <input className="border p-2 m-1" type="number" name="namSanXuat" placeholder="Năm sản xuất" value={form.namSanXuat} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="nuocSanXuat" placeholder="Nước sản xuất" value={form.nuocSanXuat} onChange={handleChange} />
                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleAddMachine}>Thêm</button>
            </div>
            <hr className="my-4" />
            {/*them ghi chu de xem chi tiet hay nhan vao mot phan tu */}
            <h1 className="text-xl font-bold">Vui lòng kích chuột vào một hàng để xem chi tiết</h1>
            {/* Danh sách máy thở */}
            <table className="table-auto w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Họ và tên</th>
                        <th className="border px-4 py-2">Số máy</th>
                        <th className="border px-4 py-2">Biên chế</th>
                        <th className="border px-4 py-2">Phòng trạm</th>
                        <th className="border px-4 py-2">Số sê ri</th>
                        <th className="border px-4 py-2">Năm sản xuất</th>
                        <th className="border px-4 py-2">Nước sản xuất</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {machines.map(machine => (
                        <tr key={machine._id} className="text-center">
                            <td className="border px-4 py-2">
                                <Link to={`/dashboard/may-tho/${machine._id}`}>
                                    {machine.hoTen}
                                </Link>
                            </td>
                            <td className="border px-4 py-2">{machine.soMay}</td>
                            <td className="border px-4 py-2">{machine.bienChe}</td>
                            <td className="border px-4 py-2">{machine.phongTram}</td>
                            <td className="border px-4 py-2">{machine.soSeri}</td>
                            <td className="border px-4 py-2">{machine.namSanXuat}</td>
                            <td className="border px-4 py-2">{machine.nuocSanXuat}</td>
                            <td>
                                <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleDeleteMachine(machine._id)}>Xóa</button>
                                <button className="bg-yellow-600 text-white px-2 py-1" onClick={() => handleEditMachine(machine)}>Sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form chỉnh sửa máy thở */}
            {editMachine && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-3">Chỉnh sửa máy thở</h3>
                        <input className="border p-2 m-1 w-full" type="text" name="hoTen" placeholder="Họ và tên" value={form.hoTen} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="soMay" placeholder="Số máy" value={form.soMay} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="bienChe" placeholder="Biên chế" value={form.bienChe} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="phongTram" placeholder="Phòng trạm" value={form.phongTram} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="soSeri" placeholder="Số sê ri" value={form.soSeri} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="number" name="namSanXuat" placeholder="Năm sản xuất" value={form.namSanXuat} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="nuocSanXuat" placeholder="Nước sản xuất" value={form.nuocSanXuat} onChange={handleChange} />
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => setEditMachine(null)}>Hủy</button>
                            <button className="bg-green-500 text-white px-4 py-2" onClick={handleUpdateMachine}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListMayTho;