import React, { useState } from 'react';
import UserInDepartment from './UserInDepartment';
import CategoryInDepartment from './CategoryInDepartment';

const DepartmentDetail = ({ department, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex flex-col h-full">
      {/* Taskbar ngang */}
      <div className="bg-gray-300 p-1 flex gap-2 rounded-lg m-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 px-4 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-400'
          }`}
        >
          Thông tin người dùng thuộc bộ phận
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 px-4 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'categories'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-400'
          }`}
        >
          Dữ liệu trong bộ phận
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'users' ? (
          <UserInDepartment department={department} />
        ) : (
          <CategoryInDepartment department={department} />
        )}
      </div>
    </div>
  );
};

export default DepartmentDetail;
