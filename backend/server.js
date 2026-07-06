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

app.use("/api/citizens",          citizenRoutes);
app.use("/api/insurances",        insuranceRoutes);
app.use("/api/thong-bao",         thongBaoRoutes);
app.use("/api/canh-bao",          canhBaoRoutes);
app.use("/api/lich-hop",          lichHopRoutes);
app.use("/api/v1",                tthcRoutes);
app.use("/api/v1/gia-nong-san",   giaRouter);
app.use("/api/v1/bai-viet",       baiVietRoutes);

app.get("/api/v1", (req, res) => {
  res.json({ message: "UBND Dak Pxi API is running" });
});

app.get("/", (req, res) => {
  res.send("BHYT DAK PXI API RUNNING");
});

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});