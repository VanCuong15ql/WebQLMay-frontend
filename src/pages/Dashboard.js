import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState("");
  const [rootCategories, setRootCategories] = useState([]);
  const [subcategoriesByParent, setSubcategoriesByParent] = useState({});
  const [recordsByCategory, setRecordsByCategory] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("addRoot");
  const [categoryModalTarget, setCategoryModalTarget] = useState(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordTargetCategory, setRecordTargetCategory] = useState(null);
  const [recordName, setRecordName] = useState("");
  const [recordDesc, setRecordDesc] = useState("");
  const [activeRecordMenu, setActiveRecordMenu] = useState(null);
  const [showRecordRenameModal, setShowRecordRenameModal] = useState(false);
  const [recordToRename, setRecordToRename] = useState(null);
  const [recordToRenameCategoryId, setRecordToRenameCategoryId] = useState(null);
  const [renameRecordName, setRenameRecordName] = useState("");
  const [renameRecordDesc, setRenameRecordDesc] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL || "";
  const role = localStorage.getItem("role");
  const canEdit = role === "edit" || role === "admin";

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUser(storedUser || "Người dùng");
    fetchRootCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.category-menu-container')) {
        setActiveMenu(null);
      }
      if (activeRecordMenu && !event.target.closest('.record-menu-container')) {
        setActiveRecordMenu(null);
      }
    };
    
    if (activeMenu || activeRecordMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu, activeRecordMenu]);

  const fetchRootCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories?parent=null`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRootCategories(data);
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}/subcategories`);
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      const data = await res.json();
      setSubcategoriesByParent((prev) => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error("Error loading subcategories", err);
      setSubcategoriesByParent((prev) => ({ ...prev, [categoryId]: [] }));
    }
  };

  const fetchRecords = async (categoryId) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}/records`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecordsByCategory((prev) => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error("Error loading records", err);
      setRecordsByCategory((prev) => ({ ...prev, [categoryId]: [] }));
    }
  };

  const toggleExpand = (category) => {
    const isExpanded = !!expanded[category._id];
    setExpanded((prev) => ({ ...prev, [category._id]: !isExpanded }));
    if (!isExpanded) {
      if (!subcategoriesByParent[category._id]) fetchSubcategories(category._id);
      if (!recordsByCategory[category._id]) fetchRecords(category._id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const openCategoryModal = (mode, target) => {
    setCategoryModalMode(mode);
    setCategoryModalTarget(target || null);
    if (mode === "rename" && target) {
      setCatName(target.name || "");
      setCatDesc(target.description || "");
    } else {
      setCatName("");
      setCatDesc("");
    }
    setActiveMenu(null);
    setShowCategoryModal(true);
  };

  const openRecordModal = (category) => {
    setRecordTargetCategory(category);
    setRecordName("");
    setRecordDesc("");
    setActiveMenu(null);
    setShowRecordModal(true);
  };

  const updateCategoryInList = (list, updated) => {
    return list.map((item) => (item._id === updated._id ? updated : item));
  };

  const handleSaveCategory = async () => {
    if (!catName.trim()) return window.alert("Tên category không được để trống");
    try {
      const token = localStorage.getItem("token");
      let res;
      if (categoryModalMode === "rename" && categoryModalTarget) {
        res = await fetch(`${API_BASE}/categories/${categoryModalTarget._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name: catName, description: catDesc })
        });
      } else {
        const payload = {
          name: catName,
          description: catDesc
        };
        if (categoryModalMode === "addSub" && categoryModalTarget) {
          payload.parent_id = categoryModalTarget._id;
        }
        res = await fetch(`${API_BASE}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      const parentId = updated.parent_id && (updated.parent_id._id || updated.parent_id);
      if (categoryModalMode === "rename") {
        if (parentId) {
          setSubcategoriesByParent((prev) => ({
            ...prev,
            [parentId]: updateCategoryInList(prev[parentId] || [], updated)
          }));
        } else {
          setRootCategories((prev) => updateCategoryInList(prev, updated));
        }
      } else if (parentId) {
        setSubcategoriesByParent((prev) => ({
          ...prev,
          [parentId]: [updated, ...(prev[parentId] || [])]
        }));
        setExpanded((prev) => ({ ...prev, [parentId]: true }));
      } else {
        setRootCategories((prev) => [updated, ...prev]);
      }
      setShowCategoryModal(false);
      setCatName("");
      setCatDesc("");
    } catch (err) {
      window.alert("Lỗi khi lưu category: " + err.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm("Bạn có chắc muốn xóa category này?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${category._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      const parentId = category.parent_id && (category.parent_id._id || category.parent_id);
      if (parentId) {
        setSubcategoriesByParent((prev) => ({
          ...prev,
          [parentId]: (prev[parentId] || []).filter((item) => item._id !== category._id)
        }));
      } else {
        setRootCategories((prev) => prev.filter((item) => item._id !== category._id));
      }
      setExpanded((prev) => {
        const next = { ...prev };
        delete next[category._id];
        return next;
      });
      setActiveMenu(null);
    } catch (err) {
      window.alert("Lỗi khi xóa category: " + err.message);
    }
  };

  const openRecordRenameModal = (record, categoryId) => {
    setRecordToRename(record);
    setRecordToRenameCategoryId(categoryId);
    setRenameRecordName(record.name || "");
    setRenameRecordDesc(record.description || "");
    setActiveRecordMenu(null);
    setShowRecordRenameModal(true);
  };

  const handleSaveRecordRename = async () => {
    if (!renameRecordName.trim()) return window.alert("Tên record không được để trống");
    if (!recordToRename) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/records/${recordToRename._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: renameRecordName, description: renameRecordDesc })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      
      console.log('Đổi tên record - CategoryID:', recordToRenameCategoryId, 'Updated:', updated);
      
      if (recordToRenameCategoryId) {
        setRecordsByCategory((prev) => ({
          ...prev,
          [recordToRenameCategoryId]: (prev[recordToRenameCategoryId] || []).map((r) => (r._id === updated._id ? updated : r))
        }));
        window.alert("Đã đổi tên record thành công!");
      } else {
        console.error('Không tìm thấy categoryId cho record:', recordToRename);
        window.alert("⚠️ Đã lưu nhưng UI có thể chưa cập nhật. Vui lòng tải lại trang.");
      }
      
      setShowRecordRenameModal(false);
      setRecordToRename(null);
      setRecordToRenameCategoryId(null);
      setRenameRecordName("");
      setRenameRecordDesc("");
    } catch (err) {
      window.alert("Lỗi khi đổi tên record: " + err.message);
    }
  };

  const handleDeleteRecord = async (record, categoryId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa record "${record.name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/records/${record._id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error(await res.text());
      
      console.log('Xóa record - CategoryID:', categoryId, 'RecordID:', record._id);
      
      if (categoryId) {
        setRecordsByCategory((prev) => ({
          ...prev,
          [categoryId]: (prev[categoryId] || []).filter((r) => r._id !== record._id)
        }));
        window.alert("Đã xóa record thành công!");
      } else {
        console.error('Không tìm thấy categoryId cho record:', record);
        window.alert("⚠️ Đã xóa nhưng UI có thể chưa cập nhật. Vui lòng tải lại trang.");
      }
      
      setActiveRecordMenu(null);
    } catch (err) {
      window.alert("Lỗi khi xóa record: " + err.message);
    }
  };

  const handleSaveRecord = async () => {
    if (!recordTargetCategory || !recordName.trim()) {
      return window.alert("Tên record không được để trống");
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          categories_id: recordTargetCategory._id,
          name: recordName,
          description: recordDesc
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setRecordsByCategory((prev) => ({
        ...prev,
        [recordTargetCategory._id]: [created, ...(prev[recordTargetCategory._id] || [])]
      }));
      setExpanded((prev) => ({ ...prev, [recordTargetCategory._id]: true }));
      setShowRecordModal(false);
      setRecordName("");
      setRecordDesc("");
    } catch (err) {
      window.alert("Lỗi khi thêm record: " + err.message);
    }
  };

  const renderCategory = (category, depth = 0) => {
    const isExpanded = !!expanded[category._id];
    const subcats = subcategoriesByParent[category._id] || [];
    const records = recordsByCategory[category._id] || [];
    return (
      <div key={category._id}>
        <div className="group flex items-center gap-1" style={{ paddingLeft: 8 + depth * 12 }}>
          <button
            className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white"
            onClick={() => toggleExpand(category)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            title={isExpanded ? "Đóng" : "Mở"}
          >
            {isExpanded ? "▾" : "▸"}
          </button>
          <button
            className="flex-1 truncate hover:bg-gray-700 px-2 py-1 rounded text-left"
            onClick={() => toggleExpand(category)}
          >
            🗂️ {category.name}
          </button>
          {canEdit && (
            <div className="relative category-menu-container">
              <button
                className="px-2 py-1 rounded hover:bg-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveMenu(activeMenu === category._id ? null : category._id);
                }}
                aria-label="Category actions"
              >
                ⋮
              </button>
              {activeMenu === category._id && (
                <div className="absolute right-0 mt-1 w-44 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 text-xs">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-700"
                    onClick={() => openCategoryModal("addSub", category)}
                  >
                    Thêm category con
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-700"
                    onClick={() => openRecordModal(category)}
                  >
                    Thêm record
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-700"
                    onClick={() => openCategoryModal("rename", category)}
                  >
                    Đổi tên
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 text-red-400"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="space-y-1">
            {records.map((record) => (
              <div
                key={record._id}
                className="flex items-center gap-2 text-sm text-gray-200 group"
                style={{ paddingLeft: 28 + depth * 12 }}
              >
                <Link
                  to={`/dashboard/records/${record._id}`}
                  className="flex-1 hover:bg-gray-700 px-2 py-1 rounded"
                >
                  📄 {record.name}
                </Link>
                {canEdit && (
                  <div className="relative record-menu-container opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="px-2 py-1 rounded hover:bg-gray-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveRecordMenu(activeRecordMenu === record._id ? null : record._id);
                      }}
                      aria-label="Record actions"
                    >
                      ⋮
                    </button>
                    {activeRecordMenu === record._id && (
                      <div className="absolute right-0 mt-1 w-36 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 text-xs">
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-700"
                          onClick={() => openRecordRenameModal(record, category._id)}
                        >
                          Đổi tên
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 text-red-400"
                          onClick={() => handleDeleteRecord(record, category._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {subcats.map((sub) => renderCategory(sub, depth + 1))}
            {records.length === 0 && subcats.length === 0 && (
              <div className="text-xs text-gray-400" style={{ paddingLeft: 28 + depth * 12 }}>
                Không có dữ liệu
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-gray-800 text-white flex flex-col h-screen transition-all duration-300 overflow-hidden`}>
        <div className="flex items-center justify-between gap-2 p-4">
          <h2 className="text-xl font-bold flex-1 truncate min-w-0">👤 {user}</h2>
          <button
            className="p-1 hover:bg-gray-700 rounded flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
            title="Đóng sidebar"
          >
            ◀
          </button>
        </div>
        <nav className="flex flex-col gap-2 overflow-auto flex-1 px-4">
          {rootCategories.map((cat) => renderCategory(cat))}
        </nav>

        <div className="mt-auto space-y-2 flex-shrink-0 px-4 pb-4">
          {canEdit && (
            <button
              className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              onClick={() => openCategoryModal("addRoot")}
            >
              + Thêm category
            </button>
          )}

          <button
            className="w-full bg-white-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="flex items-center gap-3 mb-5">
          {!sidebarOpen && (
            <button
              className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
              title="Mở sidebar"
            >
              ▶
            </button>
          )}
          <h1 className="text-2xl font-bold">📋 Dashboard</h1>
        </div>
        <Outlet />
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {categoryModalMode === "rename" ? "Đổi tên category" : "Thêm category"}
            </h3>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Tên category"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Mô tả (tùy chọn)"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowCategoryModal(false)}>
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSaveCategory}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecordModal && recordTargetCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm record</h3>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Tên record"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Mô tả (tùy chọn)"
                value={recordDesc}
                onChange={(e) => setRecordDesc(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowRecordModal(false)}>
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSaveRecord}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecordRenameModal && recordToRename && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Đổi tên record</h3>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Tên record"
                value={renameRecordName}
                onChange={(e) => setRenameRecordName(e.target.value)}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Mô tả (tùy chọn)"
                value={renameRecordDesc}
                onChange={(e) => setRenameRecordDesc(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 rounded border" 
                onClick={() => {
                  setShowRecordRenameModal(false);
                  setRecordToRename(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSaveRecordRename}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;