import { useState, useEffect } from "react";

function UpdateNotificationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("latest");

  if (!isOpen) return null;

  const updates = [
    {
      id: "latest",
      title: "✨ Phiên bản 6.1.0 - Mới nhất",
      icon: "⭐",
      date: "25/02/2026",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-bold text-blue-900 mb-2">Cập nhật mới</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Thêm chức năng đăng ảnh cho record</li>
              <li>✓ Thêm loại cột mới selection, thêm chức năng mở rộng tự động điền</li>
              <li>✓ Thêm chức năng mở rộng (tính tổng) ở cột loại number</li>
              <li>✓ Thêm chức năng chia sẻ bảng giữa người dùng</li>
              <li>✓ Cập nhật thông tin bộ phận, người dùng chỉ có thể xem và chỉnh sửa thông tin trong bộ phận của mình</li>
              <li>✓ Thêm chức năng khóa bảng: looked open(khóa các cột, nhưng có thể chỉnh sửa hàng), looked tight(không thể chỉnh sửa hàng và cột)</li>

              <li>✓ Cải thiện giao diện người dùng</li>
            </ul>
          </div>
          <p className="text-gray-700">
            Phiên bản này bao gồm các cải thiện về giao diện người dùng và thêm các tính năng mới cho quản lý thông tin cá nhân.
          </p>
        </div>
      )
    },
    {
      id: "department",
      title: "🏢 Phiên bản 6.2.0",
      icon: "🏢",
      date: "Sắp cập nhật",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-bold text-green-900 mb-2">Chức năng mở rộng</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Thêm chức năng vẽ biểu đồ</li>
              <li>✓ Thêm bộ lọc tìm kiếm các hàng</li>
              <li>✓ Cải thiện giao diện người dùng</li>
              <li>✓ Thêm chức năng chỉnh sửa thông tin tài khoản</li>
            </ul>
          </div>
          <p className="text-gray-700">
            
          </p>
        </div>
      )
    },
    {
      id: "first",
      title: "🚀 Phiên bản 6.3.0",
      icon: "🚀",
      date: "Sắp cập nhật",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h3 className="font-bold text-purple-900 mb-2">Quản lý dữ liệu</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Sao chép và dán các thư mục</li>
              <li>✓ Tôi ưu giao diện khi hiển thị trên điện thoại</li>
              <li>✓ Thêm lịch sử sửa đổi vào thao tác</li>
              <li>✓ Cải thiện hiệu suất và độ ổn định</li>
            </ul>
          </div>
          <p className="text-gray-700">
            
          </p>
        </div>
      )
    }
  ];

  const activeUpdate = updates.find(u => u.id === activeTab);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl flex h-[80vh] w-[90vw] max-w-5xl overflow-hidden">
        {/* Taskbar bên trái */}
        <div className="w-48 bg-gray-900 text-white flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">📢 Cập nhật</h2>
            <p className="text-sm text-gray-400 mt-1">Phiên bản v6.1.0</p>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {updates.map((update) => (
              <button
                key={update.id}
                onClick={() => setActiveTab(update.id)}
                className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                  activeTab === update.id
                    ? "bg-gray-800 border-blue-500"
                    : "border-transparent hover:bg-gray-800"
                }`}
              >
                <div className="text-2xl mb-2">{update.icon}</div>
                <div className="text-sm font-medium">{update.title}</div>
                <div className="text-xs text-gray-400 mt-1">{update.date}</div>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Cảm ơn bạn đã sử dụng ứng dụng
            </p>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">{activeUpdate?.title}</h3>
              <p className="text-blue-100 mt-1">Ngày phát hành: {activeUpdate?.date}</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {activeUpdate?.content}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              💡 Vui lòng xóa cache trình duyệt nếu gặp vấn đề
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateNotificationModal;
