const mongoose = require("mongoose");

const VanBanSchema = new mongoose.Schema(
  {
    id_vanban: { type: String, trim: true },
    loai_so: { type: String, enum: ["di", "den"], default: "di" },
    so_hieu: { type: String, required: true, trim: true },
    trich_yeu: { type: String, required: true, trim: true },
    noi_nhan: { type: String, default: "" },
    co_quan_ban_hanh: { type: String, default: "" },
    nguoi_soan: { type: String, default: "" },
    nguoi_duyet: { type: String, default: "" },
    ngay_ban_hanh: { type: String, default: "" },
    ngay_den: { type: String, default: "" },
    loai_van_ban: { type: String, default: "Công văn" },
    do_khan: { type: String, default: "Thường" },
    nguoi_xu_ly: { type: String, default: "" },
    phong_phap: { type: String, default: "" },
    han_xu_ly: { type: String, default: "" },
    trang_thai: { type: String, default: "Dự thảo" },
    file_name: { type: String, default: "" },
    chi_dao: { type: String, default: "" },
    ket_qua: { type: String, default: "" },
    ghi_chu: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VanBan", VanBanSchema);
