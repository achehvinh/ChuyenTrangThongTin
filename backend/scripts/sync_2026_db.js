const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const ThuTucHanhChinh = require("../models/ThuTucHanhChinh");

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is missing!");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas!");

    const filePath = path.join(__dirname, "../../client-user/src/utils/dakpxi_procedures_2026.js");
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/export const/g, "const");
    content += "\nmodule.exports = { DAK_PXI_PROCEDURES_2026, FIELD_GROUPS };";

    const tempPath = path.join(__dirname, "temp_dakpxi_data.js");
    fs.writeFileSync(tempPath, content, "utf8");

    // Clear require cache if exists
    delete require.cache[require.resolve(tempPath)];
    const { DAK_PXI_PROCEDURES_2026, FIELD_GROUPS } = require(tempPath);
    console.log(`Loaded ${DAK_PXI_PROCEDURES_2026.length} procedures from JS file.`);

    const groupMap = FIELD_GROUPS.reduce((acc, g) => {
      acc[g.id] = g.name;
      return acc;
    }, {});

    // Clear old procedures in database
    await ThuTucHanhChinh.deleteMany({});
    console.log("Cleared existing procedures in MongoDB.");

    const docs = DAK_PXI_PROCEDURES_2026.map(item => ({
      stt: item.stt,
      code: item.code,
      title: item.title,
      name: item.title,
      slug: (item.code || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      fieldGroup: item.group_name || groupMap[item.group_id] || "Lĩnh vực khác",
      group_id: item.group_id || "linh-vuc-khac",
      group_name: item.group_name || groupMap[item.group_id] || "Lĩnh vực khác",
      online_type: item.online_type || "toan-trinh",
      level: item.online_type === "toan-trinh" ? "Dịch vụ công Trực tuyến toàn trình (Mức 4)" : "Dịch vụ công Trực tuyến một phần",
      agency: item.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
      duration: item.processing_time || "Theo quy định hiện hành (01 - 05 ngày làm việc)",
      processing_time: item.processing_time || "Theo quy định hiện hành (01 - 05 ngày làm việc)",
      fee: item.fee || "Theo quy định hiện hành / Miễn phí 100%",
      summary: item.summary || `Thủ tục "${item.title}" theo quy định hành chính công năm 2026.`,
      detailText: item.summary || `Thủ tục "${item.title}" theo quy định hành chính công năm 2026.`,
      guideLink: item.guideLink,
      link_dich_vu_cong: item.guideLink,
      required_documents: item.required_documents || "Tờ khai điện tử theo mẫu; Giấy tờ tùy thân (CCCD/VNeID); Các tài liệu chuyên ngành liên quan.",
      conditions_text: item.conditions_text || "Công dân, tổ chức, hộ gia đình thụ hưởng dịch vụ trực tuyến.",
      steps: item.steps || [],
      is_deleted: false,
      view_count: item.view_count || 500
    }));

    await ThuTucHanhChinh.insertMany(docs);
    console.log(`🎉 SUCCESS: Inserted ${docs.length} fresh procedures into MongoDB Atlas database!`);

    // Clean temp file
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("Error syncing procedures to DB:", err);
    process.exit(1);
  }
}

run();
