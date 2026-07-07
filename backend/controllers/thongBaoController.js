const ThongBao = require("../models/ThongBao");

exports.getAllThongBao = async (req, res) => {
  try {
    const data = await ThongBao.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createThongBao = async (req, res) => {
  try {
    const item = new ThongBao(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateThongBao = async (req, res) => {
  try {
    const item = await ThongBao.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteThongBao = async (req, res) => {
  try {
    await ThongBao.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa thông báo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleThongBao = async (req, res) => {
  try {
    const item = await ThongBao.findById(req.params.id);
    item.active = !item.active;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};