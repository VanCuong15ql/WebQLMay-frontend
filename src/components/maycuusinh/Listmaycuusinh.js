import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListMayCuuSinh = () => {
    const [machines, setMachines] = useState([]);
    const [editMachine, setEditMachine] = useState(null);
    const [message, setMessage] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const role = localStorage.getItem("role");
    const [form, setForm] = useState({
        phongTram: "",
        tieuDoi: "",
        soMay: "",
        noiSanXuat: "",
        namSanXuat: "",
        namSuDung: ""
    });

    // 🔹 Lấy danh sách máy cứu sinh
    const fetchMachines = async () => {
        try {
            const res = await axios.get(`${API_URL}/maycuusinh`);
            setMachines(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách máy cứu sinh:", error);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    // 🔹 Xử lý form nhập liệu
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Thêm máy cứu sinh mới
    const handleAddMachine = async () => {
        if (role !== "edit") {
            window.alert("Bạn chưa được cấp quyền");
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/maycuusinh`, form);
            setMachines([...machines, res.data]);
            setForm({ phongTram: "", tieuDoi: "", soMay: "", noiSanXuat: "", namSanXuat: "", namSuDung: "" });
        } catch (error) {
            console.error("Lỗi khi thêm máy cứu sinh:", error);
        }
    };

    // 🔹 Xóa máy cứu sinh
    const handleDeleteMachine = async (id) => {
        if (role !== "edit") {
            window.alert("Bạn chưa được cấp quyền");
            return;
        }
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa máy cứu sinh này không?");
        if (confirmDelete) {
            try {
                await axios.delete(`${API_URL}/maycuusinh/${id}`);
                setMachines(machines.filter(machine => machine._id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa máy cứu sinh:", error);
            }
        }
    };

    // 🔹 Mở form chỉnh sửa máy cứu sinh
    const handleEditMachine = (machine) => {
        if (role !== "edit") {
            window.alert("Bạn chưa được cấp quyền");
            return;
        }
        setEditMachine(machine);
        setForm(machine);
    };

    // 🔹 Cập nhật máy cứu sinh
    const handleUpdateMachine = async () => {
        if (role !== "edit") {
            window.alert("Bạn chưa được cấp quyền");
            return;
        }
        try {
            const res = await axios.put(`${API_URL}/maycuusinh/${editMachine._id}`, form);
            setMachines(machines.map(machine => machine._id === editMachine._id ? res.data : machine));
            setEditMachine(null);
            setForm({ phongTram: "", tieuDoi: "", soMay: "", noiSanXuat: "", namSanXuat: "", namSuDung: "" });
        } catch (error) {
            console.error("Lỗi khi cập nhật máy cứu sinh:", error);
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Danh sách máy cứu sinh</h1>

            {/* Form thêm máy cứu sinh */}
            <div className="mb-4">
                <input className="border p-2 m-1" type="text" name="phongTram" placeholder="Phòng/trạm" value={form.phongTram} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="tieuDoi" placeholder="Tiểu đội" value={form.tieuDoi} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="soMay" placeholder="Số máy" value={form.soMay} onChange={handleChange} />
                <input className="border p-2 m-1" type="text" name="noiSanXuat" placeholder="Nơi sản xuất" value={form.noiSanXuat} onChange={handleChange} />
                <input className="border p-2 m-1" type="number" name="namSanXuat" placeholder="Năm sản xuất" value={form.namSanXuat} onChange={handleChange} />
                <input className="border p-2 m-1" type="number" name="namSuDung" placeholder="Năm sử dụng" value={form.namSuDung} onChange={handleChange} />
                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleAddMachine}>Thêm</button>
            </div>
            {message && <p className="text-red-500 mt-2">{message}</p>}
            <hr className="my-4" />
            <h1 className="text-xl font-bold">Vui lòng kích chuột vào một hàng để xem chi tiết</h1>
            {/* Danh sách máy cứu sinh */}
            <table className="table-auto w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Phòng/trạm</th>
                        <th className="border px-4 py-2">Tiểu đội</th>
                        <th className="border px-4 py-2">Số máy</th>
                        <th className="border px-4 py-2">Nơi sản xuất</th>
                        <th className="border px-4 py-2">Năm sản xuất</th>
                        <th className="border px-4 py-2">Năm sử dụng</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {machines.map(machine => (
                        <tr key={machine._id} className="text-center">
                            <td className="border px-4 py-2">
                                <Link to={`/dashboard/may-cuu-sinh/${machine._id}`}>
                                    {machine.phongTram}
                                </Link>
                            </td>
                            <td className="border px-4 py-2">{machine.tieuDoi}</td>
                            <td className="border px-4 py-2">{machine.soMay}</td>
                            <td className="border px-4 py-2">{machine.noiSanXuat}</td>
                            <td className="border px-4 py-2">{machine.namSanXuat}</td>
                            <td className="border px-4 py-2">{machine.namSuDung}</td>
                            <td>
                                <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleDeleteMachine(machine._id)}>Xóa</button>
                                <button className="bg-yellow-600 text-white px-2 py-1" onClick={() => handleEditMachine(machine)}>Sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form chỉnh sửa máy cứu sinh */}
            {editMachine && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-3">Chỉnh sửa máy cứu sinh</h3>
                        <input className="border p-2 m-1 w-full" type="text" name="phongTram" placeholder="Phòng/trạm" value={form.phongTram} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="tieuDoi" placeholder="Tiểu đội" value={form.tieuDoi} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="soMay" placeholder="Số máy" value={form.soMay} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="text" name="noiSanXuat" placeholder="Nơi sản xuất" value={form.noiSanXuat} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="number" name="namSanXuat" placeholder="Năm sản xuất" value={form.namSanXuat} onChange={handleChange} />
                        <input className="border p-2 m-1 w-full" type="number" name="namSuDung" placeholder="Năm sử dụng" value={form.namSuDung} onChange={handleChange} />
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

export default ListMayCuuSinh;