const LichHop = require("../models/LichHop");
const ThongBao = require("../models/ThongBao");

exports.getAllLichHop = async (req, res) => {
  try {
    const data = await LichHop.find().sort({ date: -1, time: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLichHopById = async (req, res) => {
  try {
    const item = await LichHop.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy cuộc họp" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLichHop = async (req, res) => {
  try {
    const meetingData = { ...req.body };
    if (!meetingData.meetingCode) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      meetingData.meetingCode = `VHXH-${randNum}`;
    }
    if (!meetingData.passcode) {
      meetingData.passcode = String(Math.floor(100000 + Math.random() * 900000));
    }

    const item = new LichHop(meetingData);
    await item.save();

    // Tự động tạo Thông báo & Thư mời gửi cho toàn bộ Cán bộ trong hệ thống
    try {
      const noticeContent = `Trưởng phòng gửi Giấy mời họp: "${item.title}". Thời gian: ${item.time} ngày ${item.date ? item.date.split('-').reverse().join('/') : ''}. Địa điểm: ${item.location || 'Phòng họp trực tuyến'}. Mã cuộc họp: ${item.meetingCode} (PIN: ${item.passcode}).`;
      const thongBaoItem = new ThongBao({
        title: `📩 GIẤY MỜI HỌP CƠ QUAN: ${item.title}`,
        content: noticeContent,
        category: "lich-hop",
        date: new Date().toLocaleDateString("vi-VN"),
        active: true
      });
      await thongBaoItem.save();
    } catch (notifErr) {
      console.warn("Lỗi tự động phát thông báo giấy mời họp:", notifErr.message);
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLichHop = async (req, res) => {
  try {
    const item = await LichHop.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.saveMeetingSummary = async (req, res) => {
  try {
    const { durationSeconds, attendanceLog, bienBan, ketLuan, auditLogs } = req.body;
    const item = await LichHop.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        summary: { durationSeconds, attendanceLog, bienBan, ketLuan, auditLogs }
      },
      { returnDocument: 'after' }
    );
    res.json({ message: "Đã lưu biên bản cuộc họp thành công", data: item });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLichHop = async (req, res) => {
  try {
    await LichHop.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa lịch họp" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};