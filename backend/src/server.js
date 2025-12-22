import express from 'express';
const app = express()

app.get('/api/health', (req, res) => {
  res.send('Hello, World!')
})  

 

const express = require('express');
const path = require('path');


// 1. Các route cho API của bạn (Giữ nguyên)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 2. Cấu hình phục vụ file tĩnh từ thư mục build của Admin
// Giả sử thư mục admin nằm cùng cấp với backend
const adminBuildPath = path.join(__dirname, '../admin/dist');
app.use(express.static(adminBuildPath));

// 3. Với mọi request không phải API, trả về file index.html của Admin
app.get('*', (req, res) => {
    res.sendFile(path.join(adminBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));