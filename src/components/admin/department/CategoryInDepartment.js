import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryInDepartment = ({ department }) => {
  const [categories, setCategories] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (department?._id) {
      fetchCategories();
    }
  }, [department]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Filter categories that belong to this department
      const filteredCategories = res.data.filter(cat => 
        cat.department_id === department._id || 
        (typeof cat.department_id === 'object' && cat.department_id?._id === department._id)
      );
      setCategories(filteredCategories);
    } catch (err) {
      console.error('Lỗi khi tải danh sách danh mục:', err);
    }
  };

  return (
    <div className="p-6">
      
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Chức năng sẽ được cập nhật ở phiên bản tiếp theo</p>
        </div>

    </div>
  );
};

export default CategoryInDepartment;
