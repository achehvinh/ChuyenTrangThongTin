const ThuTucHanhChinh = require("../models/ThuTucHanhChinh");

// Helper to sanitize catalog items
function formatProcedure(p) {
  const code = p.code || p.id;
  const name = p.name || p.title || "";
  const link = p.guideLink || p.link_dich_vu_cong || "";
  return {
    id: p._id || p.id || `dakpxi-${p.stt || code}`,
    stt: p.stt || 0,
    code: code,
    title: name,
    name: name,
    slug: p.slug || (code ? code.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
    fieldGroup: p.fieldGroup || p.group_name || "Khác",
    group_id: p.group_id || p.group || "linh-vuc-khac",
    group_name: p.group_name || p.fieldGroup || "Lĩnh vực khác",
    online_type: p.online_type || p.type || "toan-trinh",
    level: p.level || "Dịch vụ công Trực tuyến toàn trình (Mức 4)",
    agency: p.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
    duration: p.duration || p.processing_time || "Theo quy định hiện hành (01 - 05 ngày làm việc)",
    processing_time: p.processing_time || p.duration || "Theo quy định hiện hành (01 - 05 ngày làm việc)",
    fee: p.fee || "Theo quy định hiện hành / Miễn phí 100%",
    summary: p.summary || p.detailText || `Thủ tục "${name}" theo quy định hành chính công năm 2026.`,
    detailText: p.detailText || p.summary || "",
    imageUrl: p.imageUrl || "",
    guideLink: link,
    link_dich_vu_cong: link,
    view_count: p.view_count || 500,
    required_documents: p.required_documents || "Tờ khai điện tử theo mẫu; Giấy tờ tùy thân (CCCD/VNeID); Các tài liệu chuyên ngành liên quan.",
    conditions_text: p.conditions_text || "Công dân, tổ chức, hộ gia đình thụ hưởng dịch vụ trực tuyến.",
    steps: p.steps || [],
    updatedAt: p.updatedAt || new Date()
  };
}

// 1. GET ALL PROCEDURES
exports.getCatalog = async (req, res) => {
  try {
    const docs = await ThuTucHanhChinh.find({ is_deleted: { $ne: true } }).sort({ stt: 1 });
    const formatted = docs.map(formatProcedure);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. CREATE PROCEDURE
exports.createProcedure = async (req, res) => {
  try {
    const data = req.body;
    if (!data.code || (!data.title && !data.name)) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ Mã thủ tục và Tên thủ tục" });
    }

    const existing = await ThuTucHanhChinh.findOne({ code: data.code });
    if (existing) {
      return res.status(400).json({ success: false, message: `Thủ tục có mã ${data.code} đã tồn tại!` });
    }

    const link = data.guideLink || data.link_dich_vu_cong || "";
    const name = data.name || data.title;

    const newDoc = new ThuTucHanhChinh({
      code: data.code,
      stt: data.stt || 999,
      title: name,
      name: name,
      slug: (data.code || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      fieldGroup: data.fieldGroup || "Khác",
      group_id: data.group_id || "linh-vuc-khac",
      group_name: data.group_name || data.fieldGroup || "Lĩnh vực khác",
      online_type: data.online_type || "toan-trinh",
      level: data.level || "Dịch vụ công Trực tuyến toàn trình (Mức 4)",
      agency: data.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
      duration: data.duration || "Theo quy định",
      processing_time: data.duration || "Theo quy định",
      fee: data.fee || "Theo quy định",
      summary: data.detailText || data.summary || "",
      detailText: data.detailText || "",
      guideLink: link,
      link_dich_vu_cong: link,
      steps: data.steps || []
    });

    await newDoc.save();
    res.status(201).json({ success: true, message: "Đã lưu thủ tục vĩnh viễn vào MongoDB!", data: formatProcedure(newDoc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. UPDATE PROCEDURE (Save permanently)
exports.updateProcedure = async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body;

    const link = updates.guideLink || updates.link_dich_vu_cong || "";
    const name = updates.name || updates.title;

    const payload = {
      ...updates,
      ...(name ? { title: name, name: name } : {}),
      ...(link ? { guideLink: link, link_dich_vu_cong: link } : {})
    };

    const doc = await ThuTucHanhChinh.findOneAndUpdate(
      { code: code },
      { $set: payload },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: `Đã lưu vĩnh viễn thủ tục ${code} vào Database!`, data: formatProcedure(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. DELETE PROCEDURE
exports.deleteProcedure = async (req, res) => {
  try {
    const { code } = req.params;
    await ThuTucHanhChinh.findOneAndUpdate({ code: code }, { $set: { is_deleted: true } });
    res.json({ success: true, message: `Đã xóa thủ tục mã ${code} khỏi Database vĩnh viễn!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. BULK SEED / SYNC API
exports.bulkSyncCatalog = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Mảng danh mục không hợp lệ" });
    }

    let updatedCount = 0;
    for (const item of items) {
      if (!item.code) continue;
      const link = item.guideLink || item.link_dich_vu_cong || "";
      const name = item.name || item.title || "";

      await ThuTucHanhChinh.findOneAndUpdate(
        { code: item.code },
        {
          $set: {
            stt: item.stt || 0,
            code: item.code,
            title: name,
            name: name,
            slug: (item.code || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            fieldGroup: item.fieldGroup || item.group_name || "Khác",
            group_id: item.group_id || "linh-vuc-khac",
            group_name: item.group_name || item.fieldGroup || "Lĩnh vực khác",
            online_type: item.online_type || "toan-trinh",
            level: item.level || "Dịch vụ công Trực tuyến toàn trình (Mức 4)",
            agency: item.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
            duration: item.duration || item.processing_time || "Theo quy định",
            processing_time: item.processing_time || item.duration || "Theo quy định",
            fee: item.fee || "Theo quy định",
            summary: item.summary || item.detailText || "",
            detailText: item.detailText || item.summary || "",
            guideLink: link,
            link_dich_vu_cong: link,
            is_deleted: false
          }
        },
        { upsert: true, new: true }
      );
      updatedCount++;
    }

    res.json({ success: true, message: `Đã đồng bộ ${updatedCount} thủ tục vào MongoDB vĩnh viễn!`, count: updatedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
