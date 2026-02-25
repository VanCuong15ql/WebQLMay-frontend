import React, { useState } from 'react';
import Department from '../components/admin/Department';
import UserManagement from '../components/admin/UserManagement';
import AuditLog from '../components/admin/AuditLog';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('userManagement');
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(true);
  const adminName = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'department':
        return <Department />;
      case 'userManagement':
        return <UserManagement />;
      case 'auditLog':
        return <AuditLog />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Taskbar - Left Sidebar */}
      <div className={`bg-black text-white flex flex-col transition-all duration-300 ${
        isTaskbarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}>
        {/* Admin Name Header */}
        <div className="pt-6 pb-4 px-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white whitespace-nowrap">👤 {adminName}</h2>
          <button
            onClick={() => setIsTaskbarOpen(false)}
            className="text-white hover:text-gray-300 transition-colors"
            title="Đóng menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 pt-4 px-4 overflow-y-auto">
          <button
            onClick={() => setActiveTab('department')}
            className={`w-full px-4 py-3 text-left text-base font-semibold transition-all rounded-lg mb-2 ${
              activeTab === 'department'
                ? 'bg-gray-700 rounded-lg'
                : 'hover:bg-gray-800'
            }`}
          >
            Quản lý bộ phận
          </button>
          <button
            onClick={() => setActiveTab('userManagement')}
            className={`w-full px-4 py-3 text-left text-base font-semibold transition-all rounded-lg mb-2 ${
              activeTab === 'userManagement'
                ? 'bg-gray-700 rounded-lg'
                : 'hover:bg-gray-800'
            }`}
          >
            Quản lý người dùng
          </button>
          <button
            onClick={() => setActiveTab('auditLog')}
            className={`w-full px-4 py-3 text-left text-base font-semibold transition-all rounded-lg mb-2 ${
              activeTab === 'auditLog'
                ? 'bg-gray-700 rounded-lg'
                : 'hover:bg-gray-800'
            }`}
          >
            Lịch sử thay đổi
          </button>
        </div>

        {/* Logout Button at the Bottom */}
        <div className="pb-6 px-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Toggle Button - Shows when taskbar is closed */}
      {!isTaskbarOpen && (
        <button
          onClick={() => setIsTaskbarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          title="Mở menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;