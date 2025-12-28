import { X, Package } from "lucide-react";

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">Thông tin đơn hàng</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Mã đơn:</span>
                <p className="font-mono font-semibold text-blue-600">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <span className="text-gray-500">Ngày đặt:</span>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <span className="text-gray-500">Khách hàng ID:</span>
                <p className="font-mono text-xs">{order.clerkId}</p>
              </div>
              <div>
                <span className="text-gray-500">Tổng tiền:</span>
                <p className="font-bold text-lg text-green-600">{order.totalAmount?.toLocaleString()}đ</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-2 flex items-center">
              <Package className="mr-2" size={18} /> Địa chỉ giao hàng
            </h3>
            <p className="text-gray-700">{order.address || 'Chưa có địa chỉ'}</p>
          </div>

          {/* Payment Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-2 text-sm">Thanh toán</h3>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                order.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                 order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                 'Thất bại'}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                {order.paymentMethod === 'vnpay' ? 'VNPay' :
                 order.paymentMethod === 'momo' ? 'MoMo' :
                 order.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'}
              </p>
            </div>
            <div className="bg-white border-2 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-2 text-sm">Trạng thái đơn</h3>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${
                order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Chờ xử lý' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Sản phẩm ({order.items?.length})</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 bg-gray-50 rounded-lg p-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500">Size: {item.size} | SL: {item.quantity}</p>
                    <p className="font-bold text-blue-600 mt-1">{item.price?.toLocaleString()}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
