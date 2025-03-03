import React, { useState } from 'react';

const RepairTable = ({ repairs, handleDeleteRepair, handleAddRepair, handleUpdateRepair }) => {
  const [newRepair, setNewRepair] = useState({
    ngayThangNam: "",
    noiDungSuaChua: "",
    nguoiLam: ""
  });
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [editRepair, setEditRepair] = useState(null);

  const handleRepairChange = (e) => {
    setNewRepair({ ...newRepair, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editRepair) {
      await handleUpdateRepair(editRepair._id, newRepair);
      setEditRepair(null);
    } else {
      await handleAddRepair(newRepair);
    }
    setNewRepair({
      ngayThangNam: "",
      noiDungSuaChua: "",
      nguoiLam: ""
    });
    setShowRepairForm(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sửa chữa này không?");
    if (confirmDelete) {
      await handleDeleteRepair(id);
    }
  };

  const handleEdit = (repair) => {
    setEditRepair(repair);
    setNewRepair(repair);
    setShowRepairForm(true);
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-5">
      <h2 className="text-lg font-bold mb-3">Theo dõi sửa chữa máy cứu sinh</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Ngày tháng năm</th>
            <th className="border px-4 py-2">Nội dung sửa chữa-phụ tùng thay thế</th>
            <th className="border px-4 py-2">Người làm</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map(repair => (
            <tr key={repair._id} className="text-center">
              <td className="border px-4 py-2">{repair.ngayThangNam}</td>
              <td className="border px-4 py-2">{repair.noiDungSuaChua}</td>
              <td className="border px-4 py-2">{repair.nguoiLam}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleDelete(repair._id)}>Xóa</button>
                <button className="bg-yellow-600 text-white px-2 py-1" onClick={() => handleEdit(repair)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowRepairForm(true)}>
        Thêm sửa chữa mới
      </button>

      {showRepairForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">{editRepair ? "Chỉnh sửa sửa chữa" : "Thêm sửa chữa mới"}</h3>
            <input className="border p-2 m-1 w-full" type="date" name="ngayThangNam" placeholder="Ngày tháng năm" value={newRepair.ngayThangNam} onChange={handleRepairChange} />
            <input className="border p-2 m-1 w-full" type="text" name="noiDungSuaChua" placeholder="Nội dung sửa chữa-phụ tùng thay thế" value={newRepair.noiDungSuaChua} onChange={handleRepairChange} />
            <input className="border p-2 m-1 w-full" type="text" name="nguoiLam" placeholder="Người làm" value={newRepair.nguoiLam} onChange={handleRepairChange} />
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => { setShowRepairForm(false); setEditRepair(null); }}>Hủy</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairTable;