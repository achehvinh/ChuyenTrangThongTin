const Citizen = require("../models/Citizen");

const createCitizen = async (req, res) => {
  try {
    const existing = await Citizen.findOne({ cccd: req.body.cccd });
    if (existing) {
      return res.status(400).json({ message: "Số CCCD này đã tồn tại trên hệ thống." });
    }
    const citizen = await Citizen.create(req.body);
    res.status(201).json(citizen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find().sort({ createdAt: -1 });
    res.status(200).json(citizens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCitizen = async (req, res) => {
  try {
    const updated = await Citizen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy công dân." });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCitizen = async (req, res) => {
  try {
    const deleted = await Citizen.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy công dân." });
    }
    const Insurance = require("../models/Insurance");
    await Insurance.deleteMany({ citizenId: req.params.id });
    res.status(200).json({ message: "Đã xóa công dân và thẻ bảo hiểm liên quan thành công." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCitizen,
  getCitizens,
  updateCitizen,
  deleteCitizen,
};