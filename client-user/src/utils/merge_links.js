const fs = require('fs');
const path = require('path');

const exportPath = 'C:/Users/ADMIN/Downloads/DAK_PXI_TTHC_CATALOG_EXPORT_2026-08-11 (1).json';
const targetPath = path.join(__dirname, 'dakpxi_procedures_2026.js');

try {
  if (fs.existsSync(exportPath)) {
    const exported = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    const linkMap = {};
    exported.forEach(item => {
      const link = item.guideLink || item.link_dich_vu_cong;
      if (link && link.startsWith('http') && item.code) {
        linkMap[item.code] = link;
      }
    });

    console.log('Total custom links found in JSON:', Object.keys(linkMap).length);
    let content = fs.readFileSync(targetPath, 'utf8');

    let matchCount = 0;
    const lines = content.split('\n');
    const newLines = lines.map(line => {
      const match = line.match(/\{ stt: (\d+), code: "([^"]+)", title: "([^"]+)", type: "([^"]+)", group: "([^"]+)"/);
      if (match) {
        const [, stt, code, title, type, group] = match;
        if (linkMap[code]) {
          matchCount++;
          return `  { stt: ${stt}, code: "${code}", title: "${title}", type: "${type}", group: "${group}", guideLink: "${linkMap[code]}" },`;
        }
      }
      return line;
    });

    fs.writeFileSync(targetPath, newLines.join('\n'), 'utf8');
    console.log(`🎉 SUCCESS: Merged ${matchCount} custom links directly into dakpxi_procedures_2026.js!`);
  } else {
    console.error('Export file not found at:', exportPath);
  }
} catch (err) {
  console.error('Error merging links:', err);
}
