import React, { useState, useEffect } from 'react';

const ActivityTable = ({ activities, handleDeleteActivity, handleAddActivity, handleUpdateActivity }) => {
  const [newActivity, setNewActivity] = useState({
    ngayThangNam: "",
    lyDoSuDung: "",
    thoiGianSuDung: "",
    nguoiSuDung: ""
  });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editActivity, setEditActivity] = useState(null);
  const [totalUsageTime, setTotalUsageTime] = useState(0);
  const role = localStorage.getItem("role");
  const checkRole = () => {
    if (role !== "edit") {
      window.alert("Bạn chưa được cấp quyền");
      return false;
    }
  };
  useEffect(() => {
    const total = activities.reduce((sum, activity) => sum + activity.thoiGianSuDung, 0);
    setTotalUsageTime(total);
  }, [activities]);

  const handleActivityChange = (e) => {
    if (checkRole() === false) return;
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (checkRole() === false) return;
    if (editActivity) {
      await handleUpdateActivity(editActivity._id, newActivity);
      setEditActivity(null);
    } else {
      await handleAddActivity(newActivity);
    }
    setNewActivity({
      ngayThangNam: "",
      lyDoSuDung: "",
      thoiGianSuDung: "",
      nguoiSuDung: ""
    });
    setShowActivityForm(false);
  };

  const handleDelete = async (id) => {
    if (checkRole() === false) return;
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa hoạt động này không?");
    if (confirmDelete) {
      await handleDeleteActivity(id);
    }
  };

  const handleEdit = (activity) => {
    if (checkRole() === false) return;
    setEditActivity(activity);
    setNewActivity(activity);
    setShowActivityForm(true);
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-5">
      <h2 className="text-lg font-bold mb-3">Theo dõi hoạt động máy cứu sinh</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Ngày tháng năm</th>
            <th className="border px-4 py-2">Lý do sử dụng</th>
            <th className="border px-4 py-2">Thời gian sử dụng (phút)</th>
            <th className="border px-4 py-2">Người sử dụng</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity._id} className="text-center">
              <td className="border px-4 py-2">{activity.ngayThangNam}</td>
              <td className="border px-4 py-2">{activity.lyDoSuDung}</td>
              <td className="border px-4 py-2">{activity.thoiGianSuDung}</td>
              <td className="border px-4 py-2">{activity.nguoiSuDung}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleDelete(activity._id)}>Xóa</button>
                <button className="bg-yellow-600 text-white px-2 py-1" onClick={() => handleEdit(activity)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold mb-4">
        Tổng thời gian sử dụng: {totalUsageTime} phút
      </div>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowActivityForm(true)}>
        Thêm hoạt động mới
      </button>

      {showActivityForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">{editActivity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}</h3>
            <input className="border p-2 m-1 w-full" type="date" name="ngayThangNam" placeholder="Ngày tháng năm" value={newActivity.ngayThangNam} onChange={handleActivityChange} />
            <input className="border p-2 m-1 w-full" type="text" name="lyDoSuDung" placeholder="Lý do sử dụng" value={newActivity.lyDoSuDung} onChange={handleActivityChange} />
            <input className="border p-2 m-1 w-full" type="number" name="thoiGianSuDung" placeholder="Thời gian sử dụng (phút)" value={newActivity.thoiGianSuDung} onChange={handleActivityChange} />
            <input className="border p-2 m-1 w-full" type="text" name="nguoiSuDung" placeholder="Người sử dụng" value={newActivity.nguoiSuDung} onChange={handleActivityChange} />
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={() => { setShowActivityForm(false); setEditActivity(null); }}>Hủy</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;