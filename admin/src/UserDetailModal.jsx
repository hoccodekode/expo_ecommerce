import { X, Mail, Calendar, Trash2 } from "lucide-react";

export default function UserDetailModal({ user, onClose, onDelete }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết khách hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            <img
              src={user.imageUrl || "https://via.placeholder.com/80"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full border-4 border-gray-100"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">ID: {user._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-500">Ngày tham gia</p>
                <p className="font-semibold text-gray-800">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa khách hàng ${user.firstName} ${user.lastName}?`)) {
                  onDelete(user._id);
                  onClose();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              <Trash2 size={18} />
              Xóa khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
