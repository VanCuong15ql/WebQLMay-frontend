import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ActivityTable from './ActivityTable';
import ReplacementTable from './ReplacementTable';
import MachineSpecsTable from './MachineSpecsTable';
import useRoleCheck from '../../hooks/useRoleCheck';

const MachineDetails = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [replacements, setReplacements] = useState([]);
  const [specs, setSpecs] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const checkRole = useRoleCheck();
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await axios.get(`${API_URL}/machines/${id}`);
        setMachine(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin máy thở:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${API_URL}/machines/${id}/activities`);
        setActivities(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin hoạt động:", error);
      }
    };

    const fetchReplacements = async () => {
      try {
        const res = await axios.get(`${API_URL}/machines/${id}/replacements`);
        setReplacements(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin linh kiện thay thế:", error);
      }
    };

    const fetchSpecs = async () => {
      try {
        const res = await axios.get(`${API_URL}/machines/${id}/specs`);
        setSpecs(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin thông số máy thở:", error);
      }
    };

    fetchMachine();
    fetchActivities();
    fetchReplacements();
    fetchSpecs();
  }, [id, API_URL]);

  const handleAddActivity = async (newActivity) => {
    if(!checkRole()) return;
    try {
      const res = await axios.post(`${API_URL}/machines/${id}/activities`, newActivity);
      setActivities([...activities, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm hoạt động:", error);
    }
  };

  const handleAddReplacement = async (newReplacement) => {
    if(!checkRole()) return;
    try {
      const res = await axios.post(`${API_URL}/machines/${id}/replacements`, newReplacement);
      setReplacements([...replacements, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm linh kiện thay thế:", error);
    }
  };

  const handleAddSpec = async (newSpec) => {
    if(!checkRole()) return;
    try {
      const res = await axios.post(`${API_URL}/machines/${id}/specs`, newSpec);
      setSpecs([...specs, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm thông số máy thở:", error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if(!checkRole()) return;
    try {
      await axios.delete(`${API_URL}/machines/${id}/activities/${activityId}`);
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  const handleDeleteReplacement = async (replacementId) => {
    if(!checkRole()) return;
    try {
      await axios.delete(`${API_URL}/machines/${id}/replacements/${replacementId}`);
      setReplacements(replacements.filter(replacement => replacement._id !== replacementId));
    } catch (error) {
      console.error("Lỗi khi xóa linh kiện thay thế:", error);
    }
  };

  const handleDeleteSpec = async (specId) => {
    if(!checkRole()) return;
    try {
      await axios.delete(`${API_URL}/machines/${id}/specs/${specId}`);
      setSpecs(specs.filter(spec => spec._id !== specId));
    } catch (error) {
      console.error("Lỗi khi xóa thông số máy thở:", error);
    }
  };

  const handleUpdateActivity = async (activityId, newActivity) => {
    if(!checkRole()) return;
    try {
      const res = await axios.put(`${API_URL}/machines/${id}/activities/${activityId}`, newActivity);
      setActivities(activities.map(activity => (activity._id === activityId ? res.data : activity)));
    } catch (error) {
      console.error("Lỗi khi cập nhật hoạt động:", error);
    }
  };
  
  const handleUpdateReplacement = async (replacementId, newReplacement) => {
    if(!checkRole()) return;
    try {
      const res = await axios.put(`${API_URL}/machines/${id}/replacements/${replacementId}`, newReplacement);
      setReplacements(replacements.map(replacement => (replacement._id === replacementId ? res.data : replacement)));
    } catch (error) {
      console.error("Lỗi khi cập nhật linh kiện thay thế:", error);
    }
  };

  if (!machine) {
    return <p>Đang tải thông tin máy thở...</p>;
  }
  const handleUpdateSpec = async (specId, newSpec) => {
    try {
      const res = await axios.put(`${API_URL}/machines/${id}/specs/${specId}`, newSpec);
      setSpecs(specs.map(spec => (spec._id === specId ? res.data : spec)));
    }
    catch (error) {
      console.error("Lỗi khi cập nhật thông số máy thở:", error);
    }
  };
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5">Chi tiết máy thở</h1>
      <div className="bg-white shadow-md rounded p-5 mb-5">
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Họ và tên:</td>
              <td className="border px-4 py-2">{machine.hoTen}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Số máy:</td>
              <td className="border px-4 py-2">{machine.soMay}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Biên chế:</td>
              <td className="border px-4 py-2">{machine.bienChe}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Phòng trạm:</td>
              <td className="border px-4 py-2">{machine.phongTram}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Số sê ri:</td>
              <td className="border px-4 py-2">{machine.soSeri}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Năm sản xuất:</td>
              <td className="border px-4 py-2">{machine.namSanXuat}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Nước sản xuất:</td>
              <td className="border px-4 py-2">{machine.nuocSanXuat}</td>
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

      <ReplacementTable
        replacements={replacements}
        handleDeleteReplacement={handleDeleteReplacement}
        handleAddReplacement={handleAddReplacement}
        handleUpdateReplacement={handleUpdateReplacement}
      />
      <MachineSpecsTable
        specs={specs}
        handleDeleteSpec={handleDeleteSpec}
        handleAddSpec={handleAddSpec}
        handleUpdateSpec={handleUpdateSpec}
      />
    </div>
  );
};

export default MachineDetails;