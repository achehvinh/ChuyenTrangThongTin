const CanhBao = require("../models/CanhBao");

exports.getAllCanhBao = async (req, res) => {
  try {
    const data = await CanhBao.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCanhBao = async (req, res) => {
  try {
    const item = new CanhBao(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCanhBao = async (req, res) => {
  try {
    const item = await CanhBao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCanhBao = async (req, res) => {
  try {
    await CanhBao.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa cảnh báo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleCanhBao = async (req, res) => {
  try {
    const item = await CanhBao.findById(req.params.id);
    item.active = !item.active;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};