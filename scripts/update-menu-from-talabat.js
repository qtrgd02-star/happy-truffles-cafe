const fs = require("fs");
const path = require("path");

const MENU_DATA_PATH = path.join(__dirname, "..", "app", "menu-data.ts");
const TALABAT_JSON_PATH = path.join(__dirname, "talabat-menu.json");

const talabatItems = JSON.parse(fs.readFileSync(TALABAT_JSON_PATH, "utf8"));
let menuDataContent = fs.readFileSync(MENU_DATA_PATH, "utf8");

const talabatMap = new Map();
for (const item of talabatItems) {
  const norm = item.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  talabatMap.set(norm, item);
}

const itemRegex = /\{\s*id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?price:\s*(\d+(?:\.\d+)?),/g;

let match;
let appliedCount = 0;

while ((match = itemRegex.exec(menuDataContent)) !== null) {
  const id = match[1];
  const title = match[2];
  const currentDesc = match[3];
  const currentPrice = parseFloat(match[4]);

  const normTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  const talabat = talabatMap.get(normTitle);

  if (talabat) {
    let itemChanged = false;
    let newItemBlock = match[0];

    if (talabat.price !== currentPrice) {
      newItemBlock = newItemBlock.replace(
        new RegExp(`(price:\\s*)\\d+(\\.\\d+)?`),
        `$1${talabat.price}`
      );
      itemChanged = true;
      console.log(`Updated price for ${title} (ID: ${id}): ${currentPrice} → ${talabat.price}`);
    }

    if (talabat.description && talabat.description !== currentDesc) {
      const escapedNewDesc = talabat.description.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      newItemBlock = newItemBlock.replace(
        /(description:\s*")([^"]+)(")/,
        `$1${escapedNewDesc}$3`
      );
      itemChanged = true;
      console.log(`Updated description for ${title} (ID: ${id})`);
    }

    if (itemChanged) {
      menuDataContent = menuDataContent.replace(match[0], newItemBlock);
      appliedCount++;
    }
  }
}

if (appliedCount > 0) {
  const backupPath = MENU_DATA_PATH + ".backup3";
  fs.writeFileSync(backupPath, fs.readFileSync(MENU_DATA_PATH, "utf8"), "utf8");
  fs.writeFileSync(MENU_DATA_PATH, menuDataContent, "utf8");
  console.log(`\nApplied ${appliedCount} updates to menu-data.ts`);
  console.log(`Backup saved to: ${backupPath}`);
} else {
  console.log("\nNo updates were applied.");
}
