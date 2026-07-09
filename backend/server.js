const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const result = dotenv.config({ path: path.resolve(__dirname, ".env") });
if (result.error) {
  console.error("Failed to load .env file:", result.error);
  process.exit(1);
}

const connectDB = require("./config/db");
connectDB();

const app = express();

// ── Middleware (PHẢI đặt trước tất cả routes) ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
const citizenRoutes   = require("./routes/citizenRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const thongBaoRoutes  = require("./routes/thongBaoRoutes");
const canhBaoRoutes   = require("./routes/canhBaoRoutes");
const lichHopRoutes   = require("./routes/lichHopRoutes");
const tthcRoutes      = require("./routes/tthcRoutes");
const baiVietRoutes   = require("./routes/baiViet");
const { router: giaRouter } = require('./routes/gianongsanRoutes');
const { router: authRouter } = require("./middleware/auth");
const aiRoutes = require("./routes/aiRoutes");
const knowledgeRoutes = require('./routes/knowledgeRoutes');

app.use("/api/citizens",          citizenRoutes);
app.use("/api/insurances",        insuranceRoutes);
app.use("/api/thong-bao",         thongBaoRoutes);
app.use("/api/canh-bao",          canhBaoRoutes);
app.use("/api/lich-hop",          lichHopRoutes);
app.use("/api/v1",                tthcRoutes);
app.use("/api/v1/gia-nong-san",   giaRouter);
app.use("/api/v1/auth",           authRouter);
app.use("/api/v1/bai-viet",       baiVietRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);

app.get("/api/v1", (req, res) => {
  res.json({ message: "UBND Dak Pxi API is running" });
});

app.get("/", (req, res) => {
  res.send("BHYT DAK PXI API RUNNING");
});

// ── Start ──
const PORT = process.env.PORT || 5000;
// Middleware xử lý lỗi (đặt cuối cùng sau các routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Có lỗi xảy ra tại hệ thống!", 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});