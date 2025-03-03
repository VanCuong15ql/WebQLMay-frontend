import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SpecTable from './SpecTable';

const MayP34Details = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [specChecks, setSpecChecks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const role = localStorage.getItem("role");
  const checkRole = () => {
    if (role !== "edit") {
      window.alert("Bạn chưa được cấp quyền");
      return false;
    }
  };
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await axios.get(`${API_URL}/mayp34/${id}`);
        setMachine(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin máy P34:", error);
      }
    };

    const fetchSpecChecks = async () => {
      try {
        const res = await axios.get(`${API_URL}/mayp34/${id}/specChecks`);
        setSpecChecks(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin kiểm tra định kì:", error);
      }
    };

    fetchMachine();
    fetchSpecChecks();
  }, [id, API_URL]);

  const handleAddSpecCheck = async (newSpecCheck) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.post(`${API_URL}/mayp34/${id}/specChecks`, newSpecCheck);
      setSpecChecks([...specChecks, res.data]);
    } catch (error) {
      console.error("Lỗi khi thêm kiểm tra định kì:", error);
    }
  };

  const handleDeleteSpecCheck = async (specCheckId) => {
    if(checkRole() === false) return;
    try {
      await axios.delete(`${API_URL}/mayp34/${id}/specChecks/${specCheckId}`);
      setSpecChecks(specChecks.filter(specCheck => specCheck._id !== specCheckId));
    } catch (error) {
      console.error("Lỗi khi xóa kiểm tra định kì:", error);
    }
  };

  const handleUpdateSpecCheck = async (specCheckId, newSpecCheck) => {
    if(checkRole() === false) return;
    try {
      const res = await axios.put(`${API_URL}/mayp34/${id}/specChecks/${specCheckId}`, newSpecCheck);
      setSpecChecks(specChecks.map(specCheck => (specCheck._id === specCheckId ? res.data : specCheck)));
    } catch (error) {
      console.error("Lỗi khi cập nhật kiểm tra định kì:", error);
    }
  };

  if (!machine) {
    return <p>Đang tải thông tin máy P34...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5">Chi tiết máy P34</h1>
      <div className="bg-white shadow-md rounded p-5 mb-5">
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Phòng/Trạm:</td>
              <td className="border px-4 py-2">{machine.phongTram}</td>
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

      <SpecTable
        specChecks={specChecks}
        handleDeleteSpecCheck={handleDeleteSpecCheck}
        handleAddSpecCheck={handleAddSpecCheck}
        handleUpdateSpecCheck={handleUpdateSpecCheck}
      />
    </div>
  );
};

export default MayP34Details;