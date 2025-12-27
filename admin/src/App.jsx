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

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
  });

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

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = "";
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

      const productToSave = { ...formData, image: finalImageUrl };
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      });

      setFormData({ name: "", price: "", description: "", image: "", category: "", stock: "" });
      setImageFile(null);
      fetchProducts();
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
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
          <button onClick={() => setActiveTab("dashboard")} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700"}`}>
            <LayoutDashboard className="mr-3" size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("products")} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === "products" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700"}`}>
            <ShoppingBag className="mr-3" size={20} /> Sản phẩm
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === "orders" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700"}`}>
            <Package className="mr-3" size={20} /> Đơn hàng
          </button>
          <button onClick={() => setActiveTab("users")} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === "users" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700"}`}>
            <Users className="mr-3" size={20} /> Khách hàng
          </button>
          <button onClick={() => setActiveTab("settings")} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === "settings" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700"}`}>
            <Settings className="mr-3" size={20} /> Cài đặt
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-500 italic">v1.0.0 - 2025</div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Tổng quan hệ thống</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Tổng sản phẩm" value={products.length} icon={<Package className="text-blue-600" />} />
              <StatCard title="Khách hàng" value={users.length} icon={<Users className="text-green-600" />} />
              <StatCard title="Doanh thu" value="1.2 tỷ" icon={<DollarSign className="text-orange-600" />} />
            </div>
            <div className="bg-white p-20 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">Biểu đồ doanh thu sẽ hiển thị ở đây</div>
          </div>
        )}

        {/* TAB: SẢN PHẨM */}
        {activeTab === "products" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8 text-gray-800">
              <h1 className="text-2xl font-bold flex items-center"><Package className="mr-2 text-blue-600" /> Quản lý sản phẩm</h1>
              <div className="text-sm opacity-60">Tổng cộng: {products.length} mặt hàng</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700"><PlusCircle className="mr-2 text-green-500" size={18} /> Thêm sản phẩm mới</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="Tên sản phẩm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                <input placeholder="Giá (VNĐ)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                <div className="relative border border-gray-200 p-2 rounded-lg bg-gray-50 flex items-center overflow-hidden">
                  <Upload className="mr-2 text-gray-400" size={18} />
                  <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer w-full" required />
                </div>
                <input placeholder="Danh mục" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                <input placeholder="Số lượng kho" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                <button type="submit" disabled={isUploading} className="bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center disabled:bg-blue-300">
                  {isUploading ? <><Loader2 className="animate-spin mr-2" /> Đang tải...</> : "Thêm mới"}
                </button>
                <textarea placeholder="Mô tả..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-3 min-h-[100px]" required />
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-4">Hình ảnh</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="p-4">Giá bán</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="p-4"><img src={p.image} className="w-14 h-14 object-cover rounded-lg shadow-sm border" alt="" /></td>
                      <td className="p-4 font-semibold text-gray-800">{p.name}</td>
                      <td className="p-4 font-bold text-blue-600">{Number(p.price).toLocaleString()}đ</td>
                      <td className="p-4 text-center"><button className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><Trash2 size={20} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: KHÁCH HÀNG */}
        {activeTab === "users" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 text-gray-800">
              <h1 className="text-2xl font-bold flex items-center"><Users className="mr-2 text-blue-600" /> Quản lý khách hàng</h1>
              <div className="text-sm opacity-60">Tổng cộng: {users.length} thành viên</div>
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
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 flex items-center">
                        <img src={u.imageUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full mr-3 border" />
                        <span className="font-semibold text-gray-800">{u.firstName} {u.lastName}</span>
                      </td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4 text-gray-500 text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "N/A"}</td>
                      <td className="p-4 text-center"><button className="text-blue-500 hover:underline text-sm font-medium">Chi tiết</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ĐƠN HÀNG */}
        {activeTab === "orders" && (
          <div className="text-center py-32 text-gray-400 bg-white rounded-2xl border shadow-inner">
            <Package size={64} className="mx-auto mb-4 opacity-10" />
            <h2 className="text-xl font-bold text-gray-600">Chưa có đơn hàng nào</h2>
          </div>
        )}

        {/* TAB: CÀI ĐẶT */}
        {activeTab === "settings" && (
          <div className="text-center py-32 text-gray-400 bg-white rounded-2xl border shadow-inner">
            <Settings size={64} className="mx-auto mb-4 opacity-10" />
            <h2 className="text-xl font-bold text-gray-600">Cài đặt hệ thống</h2>
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
        <p className="text-xs font-bold text-gray-400 uppercase mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">{icon}</div>
    </div>
  );
}