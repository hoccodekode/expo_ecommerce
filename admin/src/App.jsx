import { useState, useEffect } from 'react';

const API_URL = 'https://expo-ecommerce-wrd1.onrender.com/api/products';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image: '', category: '', stock: ''
  });

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Xử lý thêm sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', price: '', description: '', image: '', category: '', stock: '' });
    fetchProducts();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quản trị Cửa hàng</h1>
      
      {/* Form Thêm Sản phẩm */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-2 gap-4">
        <input placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2" required />
        <input placeholder="Giá" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="border p-2" required />
        <input placeholder="Link ảnh" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="border p-2" required />
        <input placeholder="Danh mục" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border p-2" required />
        <input placeholder="Kho" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="border p-2" required />
        <textarea placeholder="Mô tả" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border p-2 col-span-2" required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700">Thêm Sản Phẩm</button>
      </form>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img src={p.image} className="h-40 w-full object-cover rounded" />
            <h2 className="font-bold mt-2">{p.name}</h2>
            <p className="text-red-600">{p.price.toLocaleString()}đ</p>
          </div>
        ))}
      </div>
    </div>
  );
}