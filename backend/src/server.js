import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Webhook } from "svix";
import User from "./models/User";
import mongoose from 'mongoose';
const app = express();
const MONGO_URI = process.env.MONGO_URI;
// Thiết lập __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// 1. API Routes (Đặt lên trước)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// 2. Phục vụ file tĩnh từ Admin (Sửa đường dẫn cho đúng cấu trúc monorepo)
// Cấu trúc: project/backend/src/server.js -> lùi 2 cấp để ra ngoài, rồi vào admin/dist
const adminDistPath = path.join(__dirname, "../../admin/dist");
app.use(express.static(adminDistPath));

// 3. Xử lý Single Page Application (SPA) của React/Vite
// ... bên trên giữ nguyên ...

// Phục vụ file tĩnh
app.use(express.static(adminDistPath));

// Route cuối cùng để xử lý trang Admin (SPA)
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// ... bên dưới giữ nguyên ...
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      return res.status(400).json({ error: "Missing webhook secret" });
    }

    // Lấy headers từ Clerk
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    const payload = req.body.toString();
    const wh = new Webhook(SIGNING_SECRET);

    let evt;
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Xử lý dữ liệu sau khi xác thực thành công
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const eventType = evt.type;

    // ... trong đoạn app.post('/api/webhooks/clerk' ...
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      const email = email_addresses[0].email_address;

      try {
        const newUser = new User({
          clerkId: id,
          email: email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        });
        await newUser.save();
        console.log("✅ User saved to MongoDB successfully");
      } catch (error) {
        console.error("❌ Error saving user to Mongo:", error);
      }
    }

    res.status(200).json({ success: true });
  }
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
