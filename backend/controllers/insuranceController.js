const Insurance = require("../models/Insurance");
const Citizen = require("../models/Citizen");
const mongoose = require("mongoose");

// 1. Tạo mới BHYT (Có Transaction)
const createInsurance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { citizenId, insuranceCode } = req.body;
    const citizenExists = await Citizen.findById(citizenId).session(session);
    if (!citizenExists) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Không tìm thấy thông tin công dân này." });
    }
    const insuranceExists = await Insurance.findOne({ insuranceCode }).session(session);
    if (insuranceExists) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Mã bảo hiểm này đã tồn tại." });
    }
    const [insurance] = await Insurance.create([req.body], { session });
    await session.commitTransaction();
    res.status(201).json({ message: "Đã tạo thành công.", data: insurance });
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    res.status(500).json({ message: "Lỗi tạo BHYT", error: error.message });
  } finally {
    session.endSession();
  }
};

// 2. Tra cứu BHYT (Cho người dân)
const searchInsurance = async (req, res) => {
  try {
    const { code } = req.query; // Gửi qua URL: /api/insurances/search?code=...
    const insurance = await Insurance.findOne({ insuranceCode: code }).populate("citizenId");
    if (!insurance) return res.status(404).json({ message: "Không tìm thấy thẻ." });
    res.status(200).json(insurance);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tra cứu", error: error.message });
  }
};

// 3. Cập nhật BHYT (Cho cán bộ)
const updateInsurance = async (req, res) => {
  try {
    const updatedInsurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updatedInsurance) return res.status(404).json({ message: "Không tìm thấy thẻ để cập nhật." });
    res.status(200).json({ message: "Cập nhật thành công.", data: updatedInsurance });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// 4. Xóa BHYT (Cho cán bộ)
const deleteInsurance = async (req, res) => {
  try {
    const deleted = await Insurance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy thẻ để xóa." });
    res.status(200).json({ message: "Đã xóa thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa", error: error.message });
  }
};

// 5. Lấy danh sách tất cả thẻ BHYT
const getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find().populate("citizenId").sort({ createdAt: -1 });
    res.status(200).json(insurances);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách bảo hiểm", error: error.message });
  }
};

// 6. Lấy thẻ BHYT theo ID công dân
const getInsuranceByCitizenId = async (req, res) => {
  try {
    const insurance = await Insurance.findOne({ citizenId: req.params.citizenId }).populate("citizenId");
    if (!insurance) return res.status(404).json({ message: "Chưa cấp thẻ BHYT." });
    res.status(200).json(insurance);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy bảo hiểm của công dân", error: error.message });
  }
};

module.exports = {
  createInsurance,
  searchInsurance,
  updateInsurance,
  deleteInsurance,
  getInsurances,
  getInsuranceByCitizenId
};