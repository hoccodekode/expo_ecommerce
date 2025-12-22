import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Thiết lập __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// 1. API Routes (Đặt lên trước)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// 2. Phục vụ file tĩnh từ Admin (Sửa đường dẫn cho đúng cấu trúc monorepo)
// Cấu trúc: project/backend/src/server.js -> lùi 2 cấp để ra ngoài, rồi vào admin/dist
const adminDistPath = path.join(__dirname, '../../admin/dist');
app.use(express.static(adminDistPath));

// 3. Xử lý Single Page Application (SPA) của React/Vite
app.get('*', (req, res) => {
    res.sendFile(path.join(adminDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});