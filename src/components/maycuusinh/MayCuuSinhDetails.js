import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ActivityTable from './ActivityTable';
import RepairTable from './RepairTable';
import SpecCheckTable from './SpecCheckTable';
import useRoleCheck from '../../hooks/useRoleCheck';
const MayCuuSinhDetails = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [specChecks, setSpecChecks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const checkRole = useRoleCheck();
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await axios.get(`${API_URL}/maycuusinh/${id}`);
        setMachine(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin máy cứu sinh:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${API_URL}/maycuusinh/${id}/activities`);
        setActivities(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin hoạt động:", error);
      }
    };

    const fetchRepairs = async () => {
      try {
        const res = await axios.get(`${API_URL}/maycuusinh/${id}/repairs`);
        setRepairs(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin sửa chữa:", error);
      }
    };

    const fetchSpecChecks = async () => {
      try {
        const res = await axios.get(`${API_URL}/maycuusinh/${id}/periodicChecks`);
        setSpecChecks(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin kiểm tra định kì:", error);
      }
    };

    fetchMachine();
    fetchActivities();
    fetchRepairs();
    fetchSpecChecks();
  }, [id, API_URL]);

  const handleAddActivity = async (newActivity) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.post(`${API_URL}/maycuusinh/${id}/activities`, newActivity);
      setActivities([...activities, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm hoạt động:", error);
    }
  };

  const handleAddRepair = async (newRepair) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.post(`${API_URL}/maycuusinh/${id}/repairs`, newRepair);
      setRepairs([...repairs, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm sửa chữa:", error);
    }
  };

  const handleAddSpecCheck = async (newSpecCheck) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.post(`${API_URL}/maycuusinh/${id}/periodicChecks`, newSpecCheck);
      setSpecChecks([...specChecks, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm kiểm tra định kì:", error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if(checkRole() === false) return;
    try {
      await axios.delete(`${API_URL}/maycuusinh/${id}/activities/${activityId}`);
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if(checkRole() === false) return;
    try {
      await axios.delete(`${API_URL}/maycuusinh/${id}/repairs/${repairId}`);
      setRepairs(repairs.filter(repair => repair._id !== repairId));
    } catch (error) {
      console.error("Lỗi khi xóa sửa chữa:", error);
    }
  };

  const handleDeleteSpecCheck = async (specCheckId) => {
    if(checkRole() === false) return;
    try {
      await axios.delete(`${API_URL}/maycuusinh/${id}/periodicChecks/${specCheckId}`);
      setSpecChecks(specChecks.filter(specCheck => specCheck._id !== specCheckId));
    } catch (error) {
      console.error("Lỗi khi xóa kiểm tra định kì:", error);
    }
  };

  const handleUpdateActivity = async (activityId, newActivity) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.put(`${API_URL}/maycuusinh/${id}/activities/${activityId}`, newActivity);
      setActivities(activities.map(activity => (activity._id === activityId ? res.data : activity)));
    } catch (error) {
      console.error("Lỗi khi cập nhật hoạt động:", error);
    }
  };

  const handleUpdateRepair = async (repairId, newRepair) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.put(`${API_URL}/maycuusinh/${id}/repairs/${repairId}`, newRepair);
      setRepairs(repairs.map(repair => (repair._id === repairId ? res.data : repair)));
    } catch (error) {
      console.error("Lỗi khi cập nhật sửa chữa:", error);
    }
  };

  const handleUpdateSpecCheck = async (specCheckId, newSpecCheck) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.put(`${API_URL}/maycuusinh/${id}/periodicChecks/${specCheckId}`, newSpecCheck);
      setSpecChecks(specChecks.map(specCheck => (specCheck._id === specCheckId ? res.data : specCheck)));
    } catch (error) {
      console.error("Lỗi khi cập nhật kiểm tra định kì:", error);
    }
  };

  if (!machine) {
    return <p>Đang tải thông tin máy cứu sinh...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5">Chi tiết máy cứu sinh</h1>
      <div className="bg-white shadow-md rounded p-5 mb-5">
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Phòng/trạm:</td>
              <td className="border px-4 py-2">{machine.phongTram}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Tiểu đội:</td>
              <td className="border px-4 py-2">{machine.tieuDoi}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Số máy:</td>
              <td className="border px-4 py-2">{machine.soMay}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Nơi sản xuất:</td>
              <td className="border px-4 py-2">{machine.noiSanXuat}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Năm sản xuất:</td>
              <td className="border px-4 py-2">{machine.namSanXuat}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Năm sử dụng:</td>
              <td className="border px-4 py-2">{machine.namSuDung}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ActivityTable
        activities={activities}
        handleDeleteActivity={handleDeleteActivity}
        handleAddActivity={handleAddActivity}
        handleUpdateActivity={handleUpdateActivity}
      />

      <RepairTable
        repairs={repairs}
        handleDeleteRepair={handleDeleteRepair}
        handleAddRepair={handleAddRepair}
        handleUpdateRepair={handleUpdateRepair}
      />

      <SpecCheckTable
        specChecks={specChecks}
        handleDeleteSpecCheck={handleDeleteSpecCheck}
        handleAddSpecCheck={handleAddSpecCheck}
        handleUpdateSpecCheck={handleUpdateSpecCheck}
      />
    </div>
  );
};

export default MayCuuSinhDetails;