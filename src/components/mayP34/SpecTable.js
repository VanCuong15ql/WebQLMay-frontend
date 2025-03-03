import React, { useState } from 'react';
import axios from 'axios';

const SpecTable = ({ specChecks, handleDeleteSpecCheck, handleAddSpecCheck, handleUpdateSpecCheck }) => {
  const [newSpecCheck, setNewSpecCheck] = useState({
    ngayThangNam: "",
    hinhThucKiemTra: "",
    dungCuKiemTra: "",
    doKinCaoAp: "",
    dinhLuongCapCO2: "",
    apLucVanXaKhiThuaLamViec: "",
    apLucVanTuDongLamViec: "",
    doKinHaAp: "",
    ngayThangNapVoi: "",
    khoiLuongVoBinh: "",
    khoiLuongVoiKhiKiemTra: "",
    apLucChaiOxi: "",
    phuTungThayThe: "",
    nguoiKiemTra: "",
    tieuDoiTruong: "",
    khoiLuongVoiKhiNap: ""
  });
  const [showSpecCheckForm, setShowSpecCheckForm] = useState(false);
  const [editSpecCheck, setEditSpecCheck] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const role = localStorage.getItem("role");
  const checkRole = () => {
    if (role !== "edit") {
      window.alert("Bạn chưa được cấp quyền");
      return false;
    }
  };
  const handleSpecCheckChange = (e) => {
    setNewSpecCheck({ ...newSpecCheck, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if(checkRole() === false) return;
    if (editSpecCheck) {
      await handleUpdateSpecCheck(editSpecCheck._id, newSpecCheck);
      setEditSpecCheck(null);
    } else {
      await handleAddSpecCheck(newSpecCheck);
    }
    setNewSpecCheck({
      ngayThangNam: "",
      hinhThucKiemTra: "",
      dungCuKiemTra: "",
      doKinCaoAp: "",
      dinhLuongCapCO2: "",
      apLucVanXaKhiThuaLamViec: "",
      apLucVanTuDongLamViec: "",
      doKinHaAp: "",
      ngayThangNapVoi: "",
      khoiLuongVoBinh: "",
      khoiLuongVoiKhiKiemTra: "",
      apLucChaiOxi: "",
      phuTungThayThe: "",
      nguoiKiemTra: "",
      tieuDoiTruong: "",
      khoiLuongVoiKhiNap: ""
    });
    setShowSpecCheckForm(false);
  };

  const handleDelete = async (id) => {
    if(checkRole() === false) return;
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa kiểm tra định kì này không?");
    if (confirmDelete) {
      await handleDeleteSpecCheck(id);
    }
  };

  const handleEdit = (specCheck) => {
    if(checkRole() === false) return;
    setEditSpecCheck(specCheck);
    setNewSpecCheck(specCheck);
    setShowSpecCheckForm(true);
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-5">
      <h2 className="text-lg font-bold mb-3">Theo dõi kiểm tra định kì thông số kỹ thuật máy P34</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Ngày tháng năm</th>
            <th className="border px-4 py-2">Hình thức kiểm tra</th>
            <th className="border px-4 py-2">Dụng cụ kiểm tra</th>
            <th className="border px-4 py-2">Độ kín cao áp</th>
            <th className="border px-4 py-2">Định lượng cấp CO2</th>
            <th className="border px-4 py-2">Áp lực van xả khí thừa làm việc</th>
            <th className="border px-4 py-2">Áp lực van tự động làm việc</th>
            <th className="border px-4 py-2">Độ kín hạ áp</th>
            <th className="border px-4 py-2">Ngày/tháng nạp vôi</th>
            <th className="border px-4 py-2">Khối lượng vỏ bình</th>
            <th className="border px-4 py-2">Khối lượng vôi khi kiểm tra (kg)</th>
            <th className="border px-4 py-2">Áp lực chai oxi (at)</th>
            <th className="border px-4 py-2">Phụ tùng thay thế</th>
            <th className="border px-4 py-2">Người kiểm tra</th>
            <th className="border px-4 py-2">Tiểu đội trưởng</th>
            <th className="border px-4 py-2">Khối lượng vôi khi nạp (kg)</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {specChecks.map(specCheck => (
            <tr key={specCheck._id} className="text-center">
              <td className="border px-4 py-2">{specCheck.ngayThangNam}</td>
              <td className="border px-4 py-2">{specCheck.hinhThucKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.dungCuKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.doKinCaoAp}</td>
              <td className="border px-4 py-2">{specCheck.dinhLuongCapCO2}</td>
              <td className="border px-4 py-2">{specCheck.apLucVanXaKhiThuaLamViec}</td>
              <td className="border px-4 py-2">{specCheck.apLucVanTuDongLamViec}</td>
              <td className="border px-4 py-2">{specCheck.doKinHaAp}</td>
              <td className="border px-4 py-2">{specCheck.ngayThangNapVoi}</td>
              <td className="border px-4 py-2">{specCheck.khoiLuongVoBinh}</td>
              <td className="border px-4 py-2">{specCheck.khoiLuongVoiKhiKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.apLucChaiOxi}</td>
              <td className="border px-4 py-2">{specCheck.phuTungThayThe}</td>
              <td className="border px-4 py-2">{specCheck.nguoiKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.tieuDoiTruong}</td>
              <td className="border px-4 py-2">{specCheck.khoiLuongVoiKhiNap}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleDelete(specCheck._id)}>Xóa</button>
                <button className="bg-yellow-600 text-white px-2 py-1" onClick={() => handleEdit(specCheck)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowSpecCheckForm(true)}>
        Thêm kiểm tra định kì mới
      </button>

      {showSpecCheckForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-200">
            <h3 className="text-lg font-bold mb-3">{editSpecCheck ? "Chỉnh sửa kiểm tra định kì" : "Thêm kiểm tra định kì mới"}</h3>
            <div className="grid grid-cols-3 gap-">
            <input className="border p-2 m-1 w-full" type="date" name="ngayThangNam" placeholder="Ngày tháng năm" value={newSpecCheck.ngayThangNam} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="hinhThucKiemTra" placeholder="Hình thức kiểm tra" value={newSpecCheck.hinhThucKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="dungCuKiemTra" placeholder="Dụng cụ kiểm tra" value={newSpecCheck.dungCuKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="doKinCaoAp" placeholder="Độ kín cao áp" value={newSpecCheck.doKinCaoAp} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="dinhLuongCapCO2" placeholder="Định lượng cấp CO2" value={newSpecCheck.dinhLuongCapCO2} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="apLucVanXaKhiThuaLamViec" placeholder="Áp lực van xả khí thừa làm việc" value={newSpecCheck.apLucVanXaKhiThuaLamViec} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="apLucVanTuDongLamViec" placeholder="Áp lực van tự động làm việc" value={newSpecCheck.apLucVanTuDongLamViec} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="doKinHaAp" placeholder="Độ kín hạ áp" value={newSpecCheck.doKinHaAp} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="date" name="ngayThangNapVoi" placeholder="Ngày/tháng nạp vôi" value={newSpecCheck.ngayThangNapVoi} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="khoiLuongVoBinh" placeholder="Khối lượng vỏ bình" value={newSpecCheck.khoiLuongVoBinh} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="khoiLuongVoiKhiKiemTra" placeholder="Khối lượng vôi khi kiểm tra (kg)" value={newSpecCheck.khoiLuongVoiKhiKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="apLucChaiOxi" placeholder="Áp lực chai oxi (at)" value={newSpecCheck.apLucChaiOxi} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="phuTungThayThe" placeholder="Phụ tùng thay thế" value={newSpecCheck.phuTungThayThe} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="nguoiKiemTra" placeholder="Người kiểm tra" value={newSpecCheck.nguoiKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="tieuDoiTruong" placeholder="Tiểu đội trưởng" value={newSpecCheck.tieuDoiTruong} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="khoiLuongVoiKhiNap" placeholder="Khối lượng vôi khi nạp (kg)" value={newSpecCheck.khoiLuongVoiKhiNap} onChange={handleSpecCheckChange} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => { setShowSpecCheckForm(false); setEditSpecCheck(null); }}>Hủy</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecTable;