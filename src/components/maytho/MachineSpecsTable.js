import React, { useState } from 'react';
import useRoleCheck from '../../hooks/useRoleCheck';
const MachineSpecsTable = ({ specs, handleDeleteSpec, handleAddSpec, handleUpdateSpec }) => {
  const [newSpec, setNewSpec] = useState({
    soMay: "",
    dangKiem: "",
    ngayThang: "",
    canhBaoApSuat: "",
    apLucVanThoVao: "",
    apLucVanThoRa: "",
    apLucVanXaNuoc: "",
    doKinMay: "",
    apLucVanXaKhiThua: "",
    kiemTraRoRiApSuatCao: "",
    dinhLuongCungCapOxi: "",
    haApVanTuDong: "",
    vanSuCoLamViec: "",
    canhBaoApSuatDu: "",
    dungLuongPin: "",
    ngayNapVoi: "",
    matNa: "",
    nguoiKiem: "",
    chiHuy: "",
    ghiChu: ""
  });
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [editSpec, setEditSpec] = useState(null);
  const checkRole = useRoleCheck();
  const handleSpecChange = (e) => {
    setNewSpec({ ...newSpec, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if(!checkRole()) return;
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thông số này không?");
    if (confirmDelete) {
      await handleDeleteSpec(id);
    }
  };

  const handleSubmit = async () => {
    if(!checkRole()) return;
    if(editSpec){
      await handleUpdateSpec(editSpec._id, newSpec);
      setEditSpec(null);
    } else {
      await handleAddSpec(newSpec);
    }
    setNewSpec({
      soMay: "",
      dangKiem: "",
      ngayThang: "",
      canhBaoApSuat: "",
      apLucVanThoVao: "",
      apLucVanThoRa: "",
      apLucVanXaNuoc: "",
      doKinMay: "",
      apLucVanXaKhiThua: "",
      kiemTraRoRiApSuatCao: "",
      dinhLuongCungCapOxi: "",
      haApVanTuDong: "",
      vanSuCoLamViec: "",
      canhBaoApSuatDu: "",
      dungLuongPin: "",
      ngayNapVoi: "",
      matNa: "",
      nguoiKiem: "",
      chiHuy: "",
      ghiChu: ""
    });
    setShowSpecForm(false);
  };

  const handleEdit = (spec) => {
    if(!checkRole()) return;
    setEditSpec(spec);
    setNewSpec(spec);
    setShowSpecForm(true);
  };
  return (
    <div className="bg-white shadow-md rounded p-5 mb-5 max-w-screen-lg overflow-x-auto">
      <h2 className="text-lg font-bold mb-3">Thông số máy thở</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Số máy</th>
            <th className="border px-4 py-2">Dạng kiểm</th>
            <th className="border px-4 py-2">Ngày tháng</th>
            <th className="border px-4 py-2">Cảnh báo áp suất</th>
            <th className="border px-4 py-2">Áp lực van thở vào</th>
            <th className="border px-4 py-2">Áp lực van thở ra</th>
            <th className="border px-4 py-2">Áp lực van xả nước</th>
            <th className="border px-4 py-2">Độ kín máy</th>
            <th className="border px-4 py-2">Áp lực van xả khí thừa</th>
            <th className="border px-4 py-2">Kiểm tra rò rỉ áp suất cao</th>
            <th className="border px-4 py-2">Định lượng cung cấp ô xi</th>
            <th className="border px-4 py-2">Hạ áp van tự động</th>
            <th className="border px-4 py-2">Van sự cố làm việc</th>
            <th className="border px-4 py-2">Cảnh báo áp suất dư</th>
            <th className="border px-4 py-2">Dung lượng pin</th>
            <th className="border px-4 py-2">Ngày nạp vôi</th>
            <th className="border px-4 py-2">Mặt nạ</th>
            <th className="border px-4 py-2">Người kiểm</th>
            <th className="border px-4 py-2">Chỉ huy</th>
            <th className="border px-4 py-2">Ghi chú</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {specs.map(spec => (
            <tr key={spec._id} className="text-center">
              <td className="border px-4 py-2">{spec.soMay}</td>
              <td className="border px-4 py-2">{spec.dangKiem}</td>
              <td className="border px-4 py-2">{spec.ngayThang}</td>
              <td className="border px-4 py-2">{spec.canhBaoApSuat}</td>
              <td className="border px-4 py-2">{spec.apLucVanThoVao}</td>
              <td className="border px-4 py-2">{spec.apLucVanThoRa}</td>
              <td className="border px-4 py-2">{spec.apLucVanXaNuoc}</td>
              <td className="border px-4 py-2">{spec.doKinMay}</td>
              <td className="border px-4 py-2">{spec.apLucVanXaKhiThua}</td>
              <td className="border px-4 py-2">{spec.kiemTraRoRiApSuatCao}</td>
              <td className="border px-4 py-2">{spec.dinhLuongCungCapOxi}</td>
              <td className="border px-4 py-2">{spec.haApVanTuDong}</td>
              <td className="border px-4 py-2">{spec.vanSuCoLamViec}</td>
              <td className="border px-4 py-2">{spec.canhBaoApSuatDu}</td>
              <td className="border px-4 py-2">{spec.dungLuongPin}</td>
              <td className="border px-4 py-2">{spec.ngayNapVoi}</td>
              <td className="border px-4 py-2">{spec.matNa}</td>
              <td className="border px-4 py-2">{spec.nguoiKiem}</td>
              <td className="border px-4 py-2">{spec.chiHuy}</td>
              <td className="border px-4 py-2">{spec.ghiChu}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(spec._id)}>Xóa</button>
                <button className='bg-yellow-600 text-white px-2 py-1' onClick={()=> handleEdit(spec)}>Sửa</button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowSpecForm(true)}>
        Thêm thông số mới
      </button>

      {showSpecForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">{editSpec?"Chỉnh sửa thông số":"Thêm thông số mới"}</h3>
            <div className="grid grid-cols-3 gap-">
              <input className="border p-2 m-1 w-full" type="text" name="soMay" placeholder="Số máy" value={newSpec.soMay} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="dangKiem" placeholder="Dạng kiểm" value={newSpec.dangKiem} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="date" name="ngayThang" placeholder="Ngày tháng" value={newSpec.ngayThang} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="canhBaoApSuat" placeholder="Cảnh báo áp suất" value={newSpec.canhBaoApSuat} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="apLucVanThoVao" placeholder="Áp lực van thở vào" value={newSpec.apLucVanThoVao} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="apLucVanThoRa" placeholder="Áp lực van thở ra" value={newSpec.apLucVanThoRa} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="apLucVanXaNuoc" placeholder="Áp lực van xả nước" value={newSpec.apLucVanXaNuoc} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="doKinMay" placeholder="Độ kín máy" value={newSpec.doKinMay} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="apLucVanXaKhiThua" placeholder="Áp lực van xả khí thừa" value={newSpec.apLucVanXaKhiThua} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="kiemTraRoRiApSuatCao" placeholder="Kiểm tra rò rỉ áp suất cao" value={newSpec.kiemTraRoRiApSuatCao} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="dinhLuongCungCapOxi" placeholder="Định lượng cung cấp ô xi" value={newSpec.dinhLuongCungCapOxi} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="number" step="0.01" name="haApVanTuDong" placeholder="Hạ áp van tự động" value={newSpec.haApVanTuDong} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="vanSuCoLamViec" placeholder="Van sự cố làm việc" value={newSpec.vanSuCoLamViec} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="canhBaoApSuatDu" placeholder="Cảnh báo áp suất dư" value={newSpec.canhBaoApSuatDu} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="dungLuongPin" placeholder="Dung lượng pin" value={newSpec.dungLuongPin} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="date" name="ngayNapVoi" placeholder="Ngày nạp vôi" value={newSpec.ngayNapVoi} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="matNa" placeholder="Mặt nạ" value={newSpec.matNa} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="nguoiKiem" placeholder="Người kiểm" value={newSpec.nguoiKiem} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="chiHuy" placeholder="Chỉ huy" value={newSpec.chiHuy} onChange={handleSpecChange} />
              <input className="border p-2 m-1 w-full" type="text" name="ghiChu" placeholder="Ghi chú" value={newSpec.ghiChu} onChange={handleSpecChange} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => {setShowSpecForm(false); setEditSpec(null)}}>Hủy</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineSpecsTable;