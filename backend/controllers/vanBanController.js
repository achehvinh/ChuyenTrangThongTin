const VanBan = require("../models/VanBan");

const defaultInitialDocs = [
  // Outgoing docs (Văn bản đi)
  {
    id_vanban: "VBI-2026-001",
    loai_so: "di",
    so_hieu: "34/BC-VHXH",
    trich_yeu: "Báo cáo kết quả công tác rà soát BHYT người dân 10 thôn xã Đăk Pxi 6 tháng đầu năm 2026",
    noi_nhan: "UBND Huyện, Phòng LĐTBXH, UBND Xã Đăk Pxi",
    nguoi_soan: "Nguyễn Thái Huy (Trưởng phòng)",
    nguoi_duyet: "Nguyễn Thái Huy",
    ngay_ban_hanh: "2026-07-19",
    loai_van_ban: "Báo cáo",
    trang_thai: "Đã phát hành",
    file_name: "34_BC_VHXH_KetQuaBHYT2026.pdf",
    ghi_chu: "Đã phát hành qua Hệ thống Quản lý văn bản điều hành iOffice."
  },
  {
    id_vanban: "VBI-2026-002",
    loai_so: "di",
    so_hieu: "12/KH-VHXH",
    trich_yeu: "Kế hoạch tổ chức tuyên truyền phòng chống lừa đảo mạng và an toàn giao thông quý III/2026",
    noi_nhan: "Ban nhân dân 10 Thôn, Công an Xã, Các Trường học",
    nguoi_soan: "Ngô Đỗ Quỳnh (Phó phòng)",
    nguoi_duyet: "Nguyễn Thái Huy",
    ngay_ban_hanh: "2026-07-12",
    loai_van_ban: "Kế hoạch",
    trang_thai: "Đã phát hành",
    file_name: "12_KH_VHXH_TuyenTruyenQuy3.pdf",
    ghi_chu: "Đã gửi tới 10 Ban nhân dân thôn."
  },
  {
    id_vanban: "VBI-2026-003",
    loai_so: "di",
    so_hieu: "Duthao-05",
    trich_yeu: "Thông báo về việc tổ chức tập huấn công nghệ số cộng đồng cho người dân 10 thôn",
    noi_nhan: "UBND Xã, 10 Tổ công nghệ số cộng đồng",
    nguoi_soan: "Lê Ngọc Sơn (Cán bộ chuyên Viên)",
    nguoi_duyet: "Nguyễn Thái Huy",
    ngay_ban_hanh: "2026-07-22",
    loai_van_ban: "Thông báo",
    trang_thai: "Dự thảo",
    file_name: "DuThao_TB_TapHuanCNS.docx",
    ghi_chu: "Đang trình Trưởng phòng duyệt."
  },
  // Incoming docs (Văn bản đến)
  {
    id_vanban: "VBD-2026-001",
    loai_so: "den",
    so_hieu: "128/UBND-VX",
    co_quan_ban_hanh: "UBND huyện Tu Mơ Rông",
    ngay_den: "2026-07-20",
    trich_yeu: "Về việc tăng cường công tác rà soát, cấp thẻ BHYT và phòng chống đuối nước cho trẻ em mùa hè 2026",
    do_khan: "Khẩn",
    nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
    phong_phap: "Phòng Văn hóa - Xã hội",
    han_xu_ly: "2026-07-28",
    trang_thai: "Đang xử lý",
    file_name: "128_UBND_CongVan_BHYT_DuoiNuoc.pdf",
    chi_dao: "Giao cán bộ chuyên trách lập danh sách rà soát tại 10 thôn và gửi báo cáo trước 25/7.",
    ket_qua: "Đã chỉ đạo các thôn Pa Cheng, Đăk Xế Kơ Ne, Đăk Wek rà soát xong đợt 1."
  },
  {
    id_vanban: "VBD-2026-002",
    loai_so: "den",
    so_hieu: "45/PA05-CAT",
    co_quan_ban_hanh: "Phòng An ninh mạng PA05 - Công an Tỉnh",
    ngay_den: "2026-07-18",
    trich_yeu: "Thông báo phương thức thủ đoạn lừa đảo chiếm đoạt tài sản qua không gian mạng đợt 3/2026",
    do_khan: "Mật",
    nguoi_xu_ly: "Ngô Đỗ Quỳnh (Phó phòng)",
    phong_phap: "Phòng Văn hóa - Xã hội",
    han_xu_ly: "2026-07-25",
    trang_thai: "Đã hoàn thành",
    file_name: "45_PA05_CanhBaoLuaDaoMang.pdf",
    chi_dao: "Đăng tải ngay bài viết tuyên truyền lên cổng thông tin xã và hệ thống đài phát thanh.",
    ket_qua: "Đã đăng bài viết tuyên truyền phòng chống lừa đảo mạng ngày 19/7/2026."
  },
  {
    id_vanban: "VBD-2026-003",
    loai_so: "den",
    so_hieu: "89/SVHTT-TDTT",
    co_quan_ban_hanh: "Sở Văn hóa, Thể thao và Du lịch",
    ngay_den: "2026-07-15",
    trich_yeu: "Hướng dẫn tổ chức Giải hội thao công chức viên chức xã Đăk Pxi năm 2026",
    do_khan: "Thường",
    nguoi_xu_ly: "Hoàng Trung Dũng (Cán Bộ Chuyên Viên)",
    phong_phap: "Phòng Văn hóa - Xã hội",
    han_xu_ly: "2026-08-05",
    trang_thai: "Chưa xử lý",
    file_name: "89_SVHTT_KeHoachHoiThao.docx",
    chi_dao: "Cán bộ Dũng dự thảo kế hoạch kinh phí và thành phần vận động viên.",
    ket_qua: ""
  }
];

exports.getAllVanBan = async (req, res) => {
  try {
    let count = await VanBan.countDocuments();
    if (count === 0) {
      await VanBan.insertMany(defaultInitialDocs);
    }
    const { loai_so } = req.query;
    const filter = loai_so ? { loai_so } : {};
    const docs = await VanBan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVanBan = async (req, res) => {
  try {
    const itemData = req.body;
    if (!itemData.id_vanban) {
      const prefix = itemData.loai_so === "den" ? "VBD-2026-" : "VBI-2026-";
      itemData.id_vanban = `${prefix}${Date.now().toString().slice(-4)}`;
    }
    const item = new VanBan(itemData);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateVanBan = async (req, res) => {
  try {
    const { id } = req.params;
    let item;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await VanBan.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    } else {
      item = await VanBan.findOneAndUpdate({ id_vanban: id }, req.body, { returnDocument: 'after' });
    }
    if (!item) {
      // If not found, create new
      const newItem = new VanBan({ ...req.body, id_vanban: id });
      await newItem.save();
      return res.json({ success: true, data: newItem });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteVanBan = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await VanBan.findByIdAndDelete(id);
    } else {
      await VanBan.findOneAndDelete({ id_vanban: id });
    }
    res.json({ success: true, message: "Đã xóa văn bản vĩnh viễn" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
