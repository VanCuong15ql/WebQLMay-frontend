import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListMayTho = () => {
    const [machines, setMachines] = useState([]);
    const [form, setForm] = useState({
        hoTen: "",
        soMay: "",
        bienChe: "",
        phongTram: "",
        soSeri: "",
        namSanXuat: "",
        nuocSanXuat: ""
    });

    // 🔹 Lấy danh sách máy thở
    const fetchMachines = async () => {
        try {
            const res = await axios.get("http://localhost:5000/machines");
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
        try {
            const res = await axios.post("http://localhost:5000/machines", form);
            setMachines([...machines, res.data]);
            setForm({ hoTen: "", soMay: "", bienChe: "", phongTram: "", soSeri: "", namSanXuat: "", nuocSanXuat: "" });
        } catch (error) {
            console.error("Lỗi khi thêm máy thở:", error);
        }
    };

    // 🔹 Xóa máy thở
    const handleDeleteMachine = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/machines/${id}`);
            setMachines(machines.filter(machine => machine._id !== id));
        } catch (error) {
            console.error("Lỗi khi xóa máy thở:", error);
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
                            <td className="border px-4 py-2">{machine.hoTen}</td>
                            <td className="border px-4 py-2">{machine.soMay}</td>
                            <td className="border px-4 py-2">{machine.bienChe}</td>
                            <td className="border px-4 py-2">{machine.phongTram}</td>
                            <td className="border px-4 py-2">{machine.soSeri}</td>
                            <td className="border px-4 py-2">{machine.namSanXuat}</td>
                            <td className="border px-4 py-2">{machine.nuocSanXuat}</td>
                            <td>
                                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDeleteMachine(machine._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListMayTho;
