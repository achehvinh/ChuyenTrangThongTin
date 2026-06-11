const LichHop = require("../models/LichHop");

exports.getAllLichHop = async (req, res) => {
  try {
    const data = await LichHop.find().sort({ date: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLichHop = async (req, res) => {
  try {
    const item = new LichHop(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLichHop = async (req, res) => {
  try {
    const item = await LichHop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
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