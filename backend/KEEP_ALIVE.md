# Keep Render Awake - Cron Setup

## 🎯 Mục đích

Render free tier sẽ tự động sleep sau 15 phút không có request. Để giữ server luôn hoạt động, chúng ta cần ping health endpoint định kỳ.

## ✅ Đã setup trong Backend

### 1. Health Check Endpoint
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-12-28T11:30:00.000Z",
  "uptime": 12345.67
}
```

### 2. Internal Cron Job

Backend đã có cron job tự động ping mỗi 14 phút:
- Package: `node-cron`
- Schedule: `*/14 * * * *` (mỗi 14 phút)
- Tự động chạy khi server start

## 🔧 Cấu hình Render

Thêm environment variable trên Render:

```
RENDER_EXTERNAL_URL=https://expo-ecommerce-wrd1.onrender.com
```

Cron job sẽ tự động sử dụng URL này để ping.

## 📊 Monitoring

Kiểm tra logs trên Render để xem cron job hoạt động:

```
⏰ Cron job started: Health check every 14 minutes
🏓 Health check ping at 11:30:00 - Status: OK
🏓 Health check ping at 11:44:00 - Status: OK
🏓 Health check ping at 11:58:00 - Status: OK
```

## 🌐 Backup: External Cron Service (Optional)

Nếu muốn dùng external service thay vì internal cron:

### Cron-job.org (Free)

1. Đăng ký tại: https://cron-job.org
2. Tạo cron job mới:
   - **Title**: Keep Render Awake
   - **URL**: `https://expo-ecommerce-wrd1.onrender.com/api/health`
   - **Schedule**: Every 14 minutes
   - **Method**: GET
3. Enable job

### UptimeRobot (Free)

1. Đăng ký tại: https://uptimerobot.com
2. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Expo Ecommerce
   - **URL**: `https://expo-ecommerce-wrd1.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes (free tier)
3. Create Monitor

### EasyCron (Free)

1. Đăng ký tại: https://www.easycron.com
2. Create Cron Job:
   - **URL**: `https://expo-ecommerce-wrd1.onrender.com/api/health`
   - **Cron Expression**: `*/14 * * * *`
   - **Timezone**: Asia/Ho_Chi_Minh
3. Enable

## ⚠️ Lưu ý

- **Internal cron** (đã setup) chỉ hoạt động khi server đang chạy
- **External cron** hoạt động độc lập, đánh thức server khi sleep
- Khuyến nghị: Dùng cả 2 để đảm bảo uptime tốt nhất
- Free tier Render có giới hạn 750 giờ/tháng
- Với ping 14 phút: ~3000 requests/tháng (rất nhẹ)

## 🧪 Test

Test health endpoint:

```bash
curl https://expo-ecommerce-wrd1.onrender.com/api/health
```

Hoặc mở trực tiếp trong browser:
```
https://expo-ecommerce-wrd1.onrender.com/api/health
```

## 📈 Kết quả mong đợi

- ✅ Server không bị sleep
- ✅ Response time nhanh hơn (không cần cold start)
- ✅ User experience tốt hơn
- ✅ VNPay callback không bị timeout

---

**Setup completed! 🎉**
