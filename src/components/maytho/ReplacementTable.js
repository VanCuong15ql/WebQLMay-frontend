import React, { useState } from 'react';
import useRoleCheck from '../../hooks/useRoleCheck';
const ReplacementTable = ({ replacements, handleDeleteReplacement, handleAddReplacement, handleUpdateReplacement }) => {
  const [newReplacement, setNewReplacement] = useState({
    hoTen: "",
    soMay: "",
    linhKienThayThe: "",
    ngayThay: ""
  });
  const [showReplacementForm, setShowReplacementForm] = useState(false);
  const [editReplacement, setEditReplacement] = useState(null);
  const checkRole = useRoleCheck();
  const handleReplacementChange = (e) => {
    setNewReplacement({ ...newReplacement, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if(!checkRole()) return;
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa linh kiện thay thế này không?");
    if (confirmDelete) {
      await handleDeleteReplacement(id);
    }
  };
  const handleSubmit = async () => {
    if(!checkRole()) return;
    if(editReplacement) {
      await handleUpdateReplacement(editReplacement._id, newReplacement);
      setEditReplacement(null);
    } else {
      await handleAddReplacement(newReplacement);
    }
    setNewReplacement({
      hoTen: "",
      soMay: "",
      linhKienThayThe: "",
      ngayThay: ""
    });
    setShowReplacementForm(false);
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-5">
      <h2 className="text-lg font-bold mb-3">Linh kiện thay thế</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Họ và tên</th>
            <th className="border px-4 py-2">Số máy</th>
            <th className="border px-4 py-2">Linh kiện thay thế</th>
            <th className="border px-4 py-2">Ngày thay</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {replacements.map(replacement => (
            <tr key={replacement._id} className="text-center">
              <td className="border px-4 py-2">{replacement.hoTen}</td>
              <td className="border px-4 py-2">{replacement.soMay}</td>
              <td className="border px-4 py-2">{replacement.linhKienThayThe}</td>
              <td className="border px-4 py-2">{replacement.ngayThay}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(replacement._id)}>Xóa</button>
                <button className="bg-yellow-600 text-white px-2 py-1 ml-2" onClick={() => {setEditReplacement(replacement);setNewReplacement(replacement);setShowReplacementForm(true)}}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowReplacementForm(true)}>
        Thêm linh kiện thay thế
      </button>

      {showReplacementForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-200">
            <h3 className="text-lg font-bold mb-3">{editReplacement?"Chỉnh sửa linh kiện":"Thêm linh kiện thay thế"}</h3>
            <div className="grid grid-cols-3 gap-4">
            <input className="border p-2 m-1 w-full" type="text" name="hoTen" placeholder="Họ và tên" value={newReplacement.hoTen} onChange={handleReplacementChange} />
            <input className="border p-2 m-1 w-full" type="text" name="soMay" placeholder="Số máy" value={newReplacement.soMay} onChange={handleReplacementChange} />
            <input className="border p-2 m-1 w-full" type="text" name="linhKienThayThe" placeholder="Linh kiện thay thế" value={newReplacement.linhKienThayThe} onChange={handleReplacementChange} />
            <input className="border p-2 m-1 w-full" type="date" name="ngayThay" placeholder="Ngày thay" value={newReplacement.ngayThay} onChange={handleReplacementChange} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => {setShowReplacementForm(false);setEditReplacement(null)}}>Hủy</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplacementTable;