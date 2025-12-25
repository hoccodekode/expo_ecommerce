
// import { useState, useEffect } from 'react';
// import { ShoppingBag, PlusCircle, Trash2, Package, DollarSign, LayoutDashboard } from 'lucide-react';

// const API_URL = 'http://localhost:3000/api/products';
// //const API_URL = 'https://expo-ecommerce-wrd1.onrender.com/api/products';
// export default function AdminPage() {
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '', price: '', description: '', image: '', category: '', stock: ''
//   });

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();
//       setProducts(data);
//     } catch (err) { console.error("Lỗi fetch:", err); }
//   };

//   useEffect(() => { fetchProducts(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await fetch(API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });
//     setFormData({ name: '', price: '', description: '', image: '', category: '', stock: '' });
//     fetchProducts();
//   };

//   return (
//     <div className="min-h-screen bg-[#f1f4f6] flex">
//       {/* SIDEBAR - Giống mẫu ArchitectUI */}
//       <div className="w-64 bg-[#343a40] text-gray-300 flex flex-col hidden md:flex">
//         <div className="p-6 text-white text-xl font-bold border-b border-gray-700">
//           PRO <span className="text-blue-400">ADMIN</span>
//         </div>
//         <nav className="p-4 space-y-2">
//           <div className="flex items-center p-3 bg-blue-600 text-white rounded-lg cursor-pointer">
//             <LayoutDashboard className="mr-3" size={20} /> Dashboard
//           </div>
//           <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition">
//             <ShoppingBag className="mr-3" size={20} /> Sản phẩm
//           </div>
//         </nav>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 p-8 overflow-y-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//             <Package className="mr-2 text-blue-600" /> Quản lý sản phẩm
//           </h1>
//           <div className="text-sm text-gray-500">Tổng cộng: {products.length} mặt hàng</div>
//         </div>

//         {/* 3 CARDS THỐNG KÊ NHANH */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <StatCard title="Tổng sản phẩm" value={products.length} icon={<Package className="text-blue-600" />} />
//           <StatCard title="Kho hàng" value="850" icon={<ShoppingBag className="text-green-600" />} />
//           <StatCard title="Doanh thu ước tính" value="1.2 tỷ" icon={<DollarSign className="text-orange-600" />} />
//         </div>

//         {/* FORM THÊM SẢN PHẨM - Thiết kế lại gọn hơn */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
//             <PlusCircle className="mr-2" size={18} /> Thêm sản phẩm mới
//           </h2>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <input placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//             <input placeholder="Giá (VNĐ)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//             <input placeholder="Link hình ảnh" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//             <input placeholder="Danh mục" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//             <input placeholder="Số lượng kho" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//             <button type="submit" className="bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md">Thêm mới</button>
//             <textarea placeholder="Mô tả ngắn gọn sản phẩm..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-3" required />
//           </form>
//         </div>

//         {/* DANH SÁCH SẢN PHẨM - DẠNG BẢNG (TABLE) */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 <th className="p-4 font-semibold text-gray-600 text-sm">Hình ảnh</th>
//                 <th className="p-4 font-semibold text-gray-600 text-sm">Tên sản phẩm</th>
//                 <th className="p-4 font-semibold text-gray-600 text-sm">Danh mục</th>
//                 <th className="p-4 font-semibold text-gray-600 text-sm">Giá bán</th>
//                 <th className="p-4 font-semibold text-gray-600 text-sm">Kho</th>
//                 <th className="p-4 font-semibold text-gray-600 text-sm text-center">Thao tác</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {products.map(p => (
//                 <tr key={p._id} className="hover:bg-gray-50 transition">
//                   <td className="p-4">
//                     <img src={p.image} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
//                   </td>
//                   <td className="p-4 font-medium text-gray-800">{p.name}</td>
//                   <td className="p-4 text-gray-500 text-sm">
//                     <span className="bg-gray-100 px-2 py-1 rounded-md">{p.category}</span>
//                   </td>
//                   <td className="p-4 font-bold text-blue-600">{Number(p.price).toLocaleString()}đ</td>
//                   <td className="p-4 text-gray-600">{p.stock}</td>
//                   <td className="p-4 text-center">
//                     <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Component con để làm các thẻ thống kê
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500 mb-1">{title}</p>
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//       </div>
//       <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
//         {icon}
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, Trash2, Package, DollarSign, LayoutDashboard, Upload, Loader2 } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/products`;
const UPLOAD_URL = `${BASE_URL}/api/upload`;

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null); // Lưu file đã chọn
  const [isUploading, setIsUploading] = useState(false); // Trạng thái đang tải lên
  
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image: '', category: '', stock: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Lỗi fetch:", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = '';

      // BƯỚC 1: Tải ảnh lên Cloudinary thông qua Backend
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: uploadData, // FormData tự động set Header Content-Type là multipart/form-data
        });

        const data = await res.json();
        finalImageUrl = data.imageUrl; // Link từ Cloudinary
      }

      // BƯỚC 2: Gửi toàn bộ dữ liệu sản phẩm kèm link ảnh mới về MongoDB
      const productToSave = { ...formData, image: finalImageUrl };

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      });

      // Reset form sau khi thành công
      setFormData({ name: '', price: '', description: '', image: '', category: '', stock: '' });
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
      <div className="w-64 bg-[#343a40] text-gray-300 flex flex-col hidden md:flex">
        <div className="p-6 text-white text-xl font-bold border-b border-gray-700">
          PRO <span className="text-blue-400">ADMIN</span>
        </div>
        <nav className="p-4 space-y-2">
          <div className="flex items-center p-3 bg-blue-600 text-white rounded-lg cursor-pointer">
            <LayoutDashboard className="mr-3" size={20} /> Dashboard
          </div>
          <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition text-gray-400">
            <ShoppingBag className="mr-3" size={20} /> Sản phẩm
          </div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="mr-2 text-blue-600" /> Quản lý sản phẩm
          </h1>
          <div className="text-sm text-gray-500">Tổng cộng: {products.length} mặt hàng</div>
        </div>

        {/* THỐNG KÊ NHANH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Tổng sản phẩm" value={products.length} icon={<Package className="text-blue-600" />} />
          <StatCard title="Kho hàng" value="850" icon={<ShoppingBag className="text-green-600" />} />
          <StatCard title="Doanh thu" value="1.2 tỷ" icon={<DollarSign className="text-orange-600" />} />
        </div>

        {/* FORM THÊM SẢN PHẨM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
            <PlusCircle className="mr-2" size={18} /> Thêm sản phẩm mới
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input placeholder="Giá (VNĐ)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            
            {/* THAY ĐỔI: Ô CHỌN FILE ẢNH */}
            <div className="relative border border-gray-200 p-2 rounded-lg bg-gray-50 flex items-center">
              <Upload className="mr-2 text-gray-400" size={18} />
              <input 
                type="file" 
                onChange={e => setImageFile(e.target.files[0])} 
                className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" 
                required 
              />
            </div>

            <input placeholder="Danh mục" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input placeholder="Số lượng kho" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            
            <button 
              type="submit" 
              disabled={isUploading}
              className="bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center disabled:bg-blue-300"
            >
              {isUploading ? <><Loader2 className="animate-spin mr-2" /> Đang tải...</> : "Thêm mới"}
            </button>
            
            <textarea placeholder="Mô tả..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-3" required />
          </form>
        </div>

        {/* TABLE DANH SÁCH */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="p-4 font-semibold text-gray-600 text-sm">Hình ảnh</th>
                 <th className="p-4 font-semibold text-gray-600 text-sm">Tên sản phẩm</th>
                 <th className="p-4 font-semibold text-gray-600 text-sm">Danh mục</th>
                 <th className="p-4 font-semibold text-gray-600 text-sm">Giá bán</th>
                 <th className="p-4 font-semibold text-gray-600 text-sm">Kho</th>
                 <th className="p-4 font-semibold text-gray-600 text-sm text-center">Thao tác</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img src={p.image} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{p.name}</td>
                  <td className="p-4 text-gray-500 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{p.category}</span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{Number(p.price).toLocaleString()}đ</td>
                  <td className="p-4 text-gray-600">{p.stock}</td>
                  <td className="p-4 text-center">
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}