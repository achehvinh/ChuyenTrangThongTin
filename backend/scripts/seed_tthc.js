const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const ThuTucHanhChinh = require("../models/ThuTucHanhChinh");

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is missing in backend/.env!");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas!");

    const jsonPath = 'C:/Users/ADMIN/Downloads/DAK_PXI_TTHC_CATALOG_EXPORT_2026-08-11 (2).json';
    if (!fs.existsSync(jsonPath)) {
      console.error("Export JSON file not found at:", jsonPath);
      process.exit(1);
    }

    const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log(`Loaded ${rawData.length} procedures from export JSON file.`);

    let count = 0;
    for (const item of rawData) {
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
      count++;
    }

    console.log(`🎉 SUCCESS: Seeded / Synchronized ${count} procedures into MongoDB Database permanently!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
