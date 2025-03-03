import React, { useState } from 'react';

const SpecCheckTable = ({ specChecks, handleDeleteSpecCheck, handleAddSpecCheck, handleUpdateSpecCheck }) => {
  const [newSpecCheck, setNewSpecCheck] = useState({
    ngayThangNam: "",
    hinhThucKiemTra: "",
    suDongBoThietBi: "",
    doNhayVanKhiTho: "",
    khangLucTho: "",
    luuLuongDongKhiThoTuDong: "",
    tanSoTho: "",
    tgTreChuyenTuTiepOxiSangHoHapNhanTao: "",
    tgTreDeEpTimKhiHoHapNhanTaoCuongBuc: "",
    matNa: "",
    doKinMatNaFPS7000: "",
    haApHutCuaBoHutDomRaiMay: "",
    nguoiKiemTra: "",
    chiHuy: ""
  });
  const [showSpecCheckForm, setShowSpecCheckForm] = useState(false);
  const [editSpecCheck, setEditSpecCheck] = useState(null);

  const handleSpecCheckChange = (e) => {
    setNewSpecCheck({ ...newSpecCheck, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editSpecCheck) {
      await handleUpdateSpecCheck(editSpecCheck._id, newSpecCheck);
      setEditSpecCheck(null);
    } else {
      await handleAddSpecCheck(newSpecCheck);
    }
    setNewSpecCheck({
      ngayThangNam: "",
      hinhThucKiemTra: "",
      suDongBoThietBi: "",
      doNhayVanKhiTho: "",
      khangLucTho: "",
      luuLuongDongKhiThoTuDong: "",
      tanSoTho: "",
      tgTreChuyenTuTiepOxiSangHoHapNhanTao: "",
      tgTreDeEpTimKhiHoHapNhanTaoCuongBuc: "",
      matNa: "",
      doKinMatNaFPS7000: "",
      haApHutCuaBoHutDomRaiMay: "",
      nguoiKiemTra: "",
      chiHuy: ""
    });
    setShowSpecCheckForm(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa kiểm tra định kì này không?");
    if (confirmDelete) {
      await handleDeleteSpecCheck(id);
    }
  };

  const handleEdit = (specCheck) => {
    setEditSpecCheck(specCheck);
    setNewSpecCheck(specCheck);
    setShowSpecCheckForm(true);
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-5">
      <h2 className="text-lg font-bold mb-3">Theo dõi kiểm tra định kì thông số kỹ thuật máy cứu sinh</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Ngày tháng năm</th>
            <th className="border px-4 py-2">Hình thức kiểm tra</th>
            <th className="border px-4 py-2">Sự đồng bộ thiết bị</th>
            <th className="border px-4 py-2">Độ nhạy của van khí thở</th>
            <th className="border px-4 py-2">Kháng lực thở</th>
            <th className="border px-4 py-2">Lưu lượng dòng khí thở tự động</th>
            <th className="border px-4 py-2">Tần số thở</th>
            <th className="border px-4 py-2">T/g trễ chuyển từ tiếp ô xi sang hô hấp nhân tạo</th>
            <th className="border px-4 py-2">T/g trễ để ép tim khi hô hấp nhân tạo cưỡng bức</th>
            <th className="border px-4 py-2">Mặt nạ</th>
            <th className="border px-4 py-2">Độ kín mặt nạ FPS-7000</th>
            <th className="border px-4 py-2">Hạ áp hút của bộ hút đờm rãi máy</th>
            <th className="border px-4 py-2">Người kiểm tra</th>
            <th className="border px-4 py-2">Chỉ huy</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {specChecks.map(specCheck => (
            <tr key={specCheck._id} className="text-center">
              <td className="border px-4 py-2">{specCheck.ngayThangNam}</td>
              <td className="border px-4 py-2">{specCheck.hinhThucKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.suDongBoThietBi}</td>
              <td className="border px-4 py-2">{specCheck.doNhayVanKhiTho}</td>
              <td className="border px-4 py-2">{specCheck.khangLucTho}</td>
              <td className="border px-4 py-2">{specCheck.luuLuongDongKhiThoTuDong}</td>
              <td className="border px-4 py-2">{specCheck.tanSoTho}</td>
              <td className="border px-4 py-2">{specCheck.tgTreChuyenTuTiepOxiSangHoHapNhanTao}</td>
              <td className="border px-4 py-2">{specCheck.tgTreDeEpTimKhiHoHapNhanTaoCuongBuc}</td>
              <td className="border px-4 py-2">{specCheck.matNa}</td>
              <td className="border px-4 py-2">{specCheck.doKinMatNaFPS7000}</td>
              <td className="border px-4 py-2">{specCheck.haApHutCuaBoHutDomRaiMay}</td>
              <td className="border px-4 py-2">{specCheck.nguoiKiemTra}</td>
              <td className="border px-4 py-2">{specCheck.chiHuy}</td>
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
            <div  className="grid grid-cols-3 gap-4">
            <input className="border p-2 m-1 w-full" type="date" name="ngayThangNam" placeholder="Ngày tháng năm" value={newSpecCheck.ngayThangNam} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="hinhThucKiemTra" placeholder="Hình thức kiểm tra" value={newSpecCheck.hinhThucKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="suDongBoThietBi" placeholder="Sự đồng bộ thiết bị" value={newSpecCheck.suDongBoThietBi} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="doNhayVanKhiTho" placeholder="Độ nhạy của van khí thở" value={newSpecCheck.doNhayVanKhiTho} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="khangLucTho" placeholder="Kháng lực thở" value={newSpecCheck.khangLucTho} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="luuLuongDongKhiThoTuDong" placeholder="Lưu lượng dòng khí thở tự động" value={newSpecCheck.luuLuongDongKhiThoTuDong} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="tanSoTho" placeholder="Tần số thở" value={newSpecCheck.tanSoTho} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="tgTreChuyenTuTiepOxiSangHoHapNhanTao" placeholder="T/g trễ chuyển từ tiếp ô xi sang hô hấp nhân tạo" value={newSpecCheck.tgTreChuyenTuTiepOxiSangHoHapNhanTao} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="tgTreDeEpTimKhiHoHapNhanTaoCuongBuc" placeholder="T/g trễ để ép tim khi hô hấp nhân tạo cưỡng bức" value={newSpecCheck.tgTreDeEpTimKhiHoHapNhanTaoCuongBuc} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="matNa" placeholder="Mặt nạ" value={newSpecCheck.matNa} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="doKinMatNaFPS7000" placeholder="Độ kín mặt nạ FPS-7000" value={newSpecCheck.doKinMatNaFPS7000} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="number" name="haApHutCuaBoHutDomRaiMay" placeholder="Hạ áp hút của bộ hút đờm rãi máy" value={newSpecCheck.haApHutCuaBoHutDomRaiMay} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="nguoiKiemTra" placeholder="Người kiểm tra" value={newSpecCheck.nguoiKiemTra} onChange={handleSpecCheckChange} />
            <input className="border p-2 m-1 w-full" type="text" name="chiHuy" placeholder="Chỉ huy" value={newSpecCheck.chiHuy} onChange={handleSpecCheckChange} />
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

export default SpecCheckTable;