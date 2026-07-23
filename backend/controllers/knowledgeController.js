const Knowledge = require('../models/Knowledge');

// Lấy tất cả kiến thức
exports.getAllKnowledge = async (req, res) => {
  try {
    const knowledgeList = await Knowledge.find().sort({ createdAt: -1 });
    res.status(200).json(knowledgeList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu tri thức" });
  }
};

// Thêm kiến thức mới
exports.addKnowledge = async (req, res) => {
  try {
    const newKnowledge = new Knowledge(req.body);
    await newKnowledge.save();
    res.status(201).json(newKnowledge);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm dữ liệu tri thức" });
  }
};

// Cập nhật kiến thức
exports.updateKnowledge = async (req, res) => {
  try {
    const updated = await Knowledge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy tri thức" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật tri thức" });
  }
};

// Xóa kiến thức
exports.deleteKnowledge = async (req, res) => {
  try {
    await Knowledge.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tri thức" });
  }
};

// Tăng lượt sử dụng AI
exports.incrementUsage = async (req, res) => {
  try {
    const updated = await Knowledge.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật lượt sử dụng" });
  }
};