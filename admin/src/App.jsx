import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Users,
  Settings,
  PlusCircle,
  Trash2,
  Package,
  DollarSign,
  LayoutDashboard,
  Upload,
  Loader2,
  Edit2,
  X,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;
const UPLOAD_URL = `${BASE_URL}/api/upload`;
const USERS_URL = `${BASE_URL}/api/users`;

export default function AdminPage() {
  // --- TẤT CẢ STATE PHẢI NẰM TRONG NÀY ---
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]); // Đã chuyển vào trong
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // 1. Thêm biến vào phần khai báo URL đầu file
  const ORDERS_URL = `${BASE_URL}/api/orders`;

  // 2. Thêm State vào trong AdminPage()
  const [orders, setOrders] = useState([]);

  // 3. Hàm lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const res = await fetch(ORDERS_URL);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi fetch đơn hàng:", err);
    }
  };
  // 4. Hàm xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    try {
      await fetch(`${ORDERS_URL}/${id}`, { method: "DELETE" });
      fetchOrders(); // Load lại danh sách
      alert("Xóa đơn hàng thành công");
    } catch (err) {
      alert("Lỗi khi xóa đơn hàng");
    }
  };

 
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "",
    discountPrice: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
    brand: "",
    size: "",
    color: "",
    tags: "",
    isActive: true,
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Hàm lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm:", err);
    }
  };

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_URL);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi fetch users:", err);
    }
  };

// Tìm và thay thế tất cả các useEffect cũ bằng khối duy nhất này:
useEffect(() => {
  const loadAllData = async () => {
    await fetchProducts();
    await fetchUsers();
    await fetchOrders();
  };
  loadAllData();
}, []); // Chỉ chạy một lần khi load trang

  const resetForm = () => {
    setFormData({
      name: "",
      originalPrice: "",
      discountPrice: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
      brand: "",
      size: "",
      color: "",
      tags: "",
      isActive: true,
    });
    setImageFile(null);
    setEditingProduct(null);
    setIsEditMode(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setFormData({
      name: product.name || "",
      originalPrice: product.originalPrice || product.price || "",
      discountPrice: product.discountPrice || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock || "",
      brand: product.brand || "",
      size: Array.isArray(product.size) ? product.size.join(", ") : product.size || "",
      color: Array.isArray(product.color) ? product.color.join(", ") : product.color || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
        alert("Xóa sản phẩm thành công!");
      } else {
        const data = await res.json();
        alert(data.message || "Lỗi khi xóa sản phẩm");
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert("Lỗi khi xóa sản phẩm!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = formData.image;
      
      // Chỉ upload ảnh mới nếu có file mới
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          body: uploadData,
        });
        const data = await res.json();
        finalImageUrl = data.imageUrl;
      }

      // Xử lý các trường array
      const productToSave = {
        ...formData,
        image: finalImageUrl,
        originalPrice: Number(formData.originalPrice),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        price: formData.discountPrice ? Number(formData.discountPrice) : Number(formData.originalPrice),
        stock: Number(formData.stock),
        size: formData.size ? formData.size.split(",").map(s => s.trim()).filter(s => s) : [],
        color: formData.color ? formData.color.split(",").map(c => c.trim()).filter(c => c) : [],
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(t => t) : [],
        isActive: formData.isActive,
      };

      if (isEditMode && editingProduct) {
        // Cập nhật sản phẩm
        const res = await fetch(`${API_URL}/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToSave),
        });
        
        if (res.ok) {
          alert("Cập nhật sản phẩm thành công!");
          resetForm();
          fetchProducts();
        } else {
          const data = await res.json();
          alert(data.message || "Lỗi khi cập nhật sản phẩm!");
        }
      } else {
        // Tạo sản phẩm mới
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToSave),
        });
        alert("Thêm sản phẩm thành công!");
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("Lỗi upload hoặc lưu dữ liệu!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f6] flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#343a40] text-gray-300 flex flex-col hidden md:flex sticky top-0 h-screen shadow-xl">
        <div className="p-6 text-white text-xl font-bold border-b border-gray-700">
          PRO <span className="text-blue-400">ADMIN</span>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full p-3 rounded-lg transition ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700"
            }`}
          >
            <LayoutDashboard className="mr-3" size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center w-full p-3 rounded-lg transition ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700"
            }`}
          >
            <ShoppingBag className="mr-3" size={20} /> Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center w-full p-3 rounded-lg transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700"
            }`}
          >
            <Package className="mr-3" size={20} /> Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full p-3 rounded-lg transition ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700"
            }`}
          >
            <Users className="mr-3" size={20} /> Khách hàng
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full p-3 rounded-lg transition ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700"
            }`}
          >
            <Settings className="mr-3" size={20} /> Cài đặt
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-500 italic">
          v1.0.0 - 2025
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              Tổng quan hệ thống
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Tổng sản phẩm"
                value={products.length}
                icon={<Package className="text-blue-600" />}
              />
              <StatCard title="Đơn hàng mới" value={orders.length} icon={<Package className="text-orange-600" />} />
              <StatCard
                title="Khách hàng"
                value={users.length}
                icon={<Users className="text-green-600" />}
              />
              <StatCard
                title="Doanh thu"
                value="1.2 tỷ"
                icon={<DollarSign className="text-orange-600" />}
              />
            </div>
            <div className="bg-white p-20 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
              Biểu đồ doanh thu sẽ hiển thị ở đây
            </div>
          </div>
        )}

        {/* TAB: SẢN PHẨM */}
        {activeTab === "products" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8 text-gray-800">
              <h1 className="text-2xl font-bold flex items-center">
                <Package className="mr-2 text-blue-600" /> Quản lý sản phẩm
              </h1>
              <div className="text-sm opacity-60">
                Tổng cộng: {products.length} mặt hàng
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center text-gray-700">
                  {isEditMode ? (
                    <>
                      <Edit2 className="mr-2 text-blue-500" size={18} /> Chỉnh sửa sản phẩm
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 text-green-500" size={18} /> Thêm sản phẩm mới
                    </>
                  )}
                </h2>
                {isEditMode && (
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                  >
                    <X size={16} className="mr-1" /> Hủy
                  </button>
                )}
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <input
                  placeholder="Tên sản phẩm *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  placeholder="Giá gốc (VNĐ) *"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  placeholder="Giá giảm giá (VNĐ) - để trống nếu không giảm"
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Chọn thể loại *</option>
                  <option value="Áo thun">Áo thun</option>
                  <option value="Áo khoác">Áo khoác</option>
                  <option value="Quần jean">Quần jean</option>
                  <option value="Váy">Váy</option>
                  <option value="Quần tây">Quần tây</option>
                  <option value="Áo sơ mi">Áo sơ mi</option>
                  <option value="Khác">Khác</option>
                </select>
                <input
                  placeholder="Thương hiệu"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  placeholder="Số lượng kho *"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  placeholder="Size (cách nhau bởi dấu phẩy, VD: S,M,L,XL)"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  placeholder="Màu sắc (cách nhau bởi dấu phẩy, VD: Đỏ,Xanh,Đen)"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  placeholder="Tags (cách nhau bởi dấu phẩy)"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="relative border border-gray-200 p-2 rounded-lg bg-gray-50 flex items-center overflow-hidden">
                  <Upload className="mr-2 text-gray-400" size={18} />
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer w-full"
                    required={!isEditMode}
                  />
                  {isEditMode && formData.image && (
                    <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded ml-2" />
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Sản phẩm đang bán
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`font-bold py-2.5 rounded-lg transition shadow-md flex justify-center items-center disabled:opacity-50 ${
                    isEditMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> Đang tải...
                    </>
                  ) : isEditMode ? (
                    "Cập nhật"
                  ) : (
                    "Thêm mới"
                  )}
                </button>
                <textarea
                  placeholder="Mô tả sản phẩm *"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-2 lg:col-span-3 min-h-[100px]"
                  required
                />
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-4">Hình ảnh</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="p-4">Thể loại</th>
                    <th className="p-4">Giá gốc</th>
                    <th className="p-4">Giá bán</th>
                    <th className="p-4">Kho</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img
                          src={p.image}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm border"
                          alt={p.name}
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{p.name}</div>
                        {p.brand && (
                          <div className="text-xs text-gray-500 mt-1">{p.brand}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {p.category || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600">
                          {p.originalPrice ? Number(p.originalPrice).toLocaleString() : Number(p.price).toLocaleString()}đ
                        </div>
                        {p.discountPrice && p.discountPrice < p.originalPrice && (
                          <div className="text-xs text-red-500 line-through">
                            {Number(p.originalPrice).toLocaleString()}đ
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-blue-600">
                          {Number(p.price).toLocaleString()}đ
                        </div>
                        {p.discountPrice && p.discountPrice < p.originalPrice && (
                          <div className="text-xs text-green-600 font-semibold">
                            -{Math.round((1 - p.discountPrice / p.originalPrice) * 100)}%
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          p.stock > 10 ? "bg-green-100 text-green-700" :
                          p.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {p.stock || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {p.isActive !== false ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic">
                  Danh sách sản phẩm trống
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: KHÁCH HÀNG */}
        {activeTab === "users" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 text-gray-800">
              <h1 className="text-2xl font-bold flex items-center">
                <Users className="mr-2 text-blue-600" /> Quản lý khách hàng
              </h1>
              <div className="text-sm opacity-60">
                Tổng cộng: {users.length} thành viên
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Ngày tham gia</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 flex items-center">
                        <img
                          src={u.imageUrl || "https://via.placeholder.com/40"}
                          className="w-10 h-10 rounded-full mr-3 border"
                        />
                        <span className="font-semibold text-gray-800">
                          {u.firstName} {u.lastName}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-blue-500 hover:underline text-sm font-medium">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ĐƠN HÀNG */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 text-gray-800">
              <h1 className="text-2xl font-bold flex items-center">
                <Package className="mr-2 text-blue-600" /> Quản lý đơn hàng
              </h1>
              <div className="text-sm opacity-60">
                Tổng cộng: {orders.length} đơn hàng
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-4">Mã đơn / Ngày</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-mono text-xs text-blue-600">
                          #{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700">
                        {order.clerkId.slice(0, 10)}...
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-gray-600">
                          {order.items?.length} mặt hàng
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        {order.totalAmount?.toLocaleString()}đ
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            order.status === "Đã giao"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic">
                  Danh sách đơn hàng trống
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CÀI ĐẶT */}
        {activeTab === "settings" && (
          <div className="text-center py-32 text-gray-400 bg-white rounded-2xl border shadow-inner">
            <Settings size={64} className="mx-auto mb-4 opacity-10" />
            <h2 className="text-xl font-bold text-gray-600">
              Cài đặt hệ thống
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-800">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}
