const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String
}, { _id: false });

const ThuTucHanhChinhSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  stt: { type: Number, default: 0 },
  title: { type: String, required: true },
  name: { type: String, default: "" },
  slug: { type: String, default: "" },
  fieldGroup: { type: String, default: "" },
  group_id: { type: String, default: "linh-vuc-khac" },
  group_name: { type: String, default: "" },
  online_type: { type: String, default: "toan-trinh" },
  level: { type: String, default: "Dịch vụ công Trực tuyến toàn trình (Mức 4)" },
  agency: { type: String, default: "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)" },
  duration: { type: String, default: "Theo quy định hiện hành (01 - 05 ngày làm việc)" },
  processing_time: { type: String, default: "Theo quy định hiện hành (01 - 05 ngày làm việc)" },
  fee: { type: String, default: "Theo quy định hiện hành / Miễn phí 100%" },
  summary: { type: String, default: "" },
  detailText: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  guideLink: { type: String, default: "" },
  link_dich_vu_cong: { type: String, default: "" },
  view_count: { type: Number, default: 0 },
  required_documents: { type: String, default: "" },
  conditions_text: { type: String, default: "" },
  steps: [StepSchema],
  is_deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("ThuTucHanhChinh", ThuTucHanhChinhSchema);
