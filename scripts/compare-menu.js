const fs = require("fs");
const path = require("path");

const LOCAL_MENU_PATH = path.join(__dirname, "..", "app", "menu-data.ts");
const TALABAT_MENU_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "talabat-menu.json");
const REPORT_PATH = path.join(__dirname, "menu-comparison-report.md");

function extractMenuItemsFromTs(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const items = [];
  const itemRegex = /\{\s*id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?price:\s*(\d+(?:\.\d+)?),/g;

  let match;
  while ((match = itemRegex.exec(content)) !== null) {
    items.push({
      id: match[1],
      title: match[2].trim(),
      description: match[3].trim(),
      price: parseFloat(match[4]),
    });
  }
  return items;
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function loadTalabatMenu(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, "utf8");

  if (ext === ".json") {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        id: item.id || String(index + 1),
        title: (item.title || item.name || "").trim(),
        description: (item.description || "").trim(),
        price: parseFloat(item.price || item.priceQAR || 0),
      }));
    }
    throw new Error("JSON file must contain an array of menu items.");
  }

  const items = [];
  const lines = content.split(/\r?\n/);
  let current = { title: "", description: "", price: null };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const priceMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:QAR|QR|Qatari\s*Rial)?/i);
    if (priceMatch && !current.title) {
      current.price = parseFloat(priceMatch[1]);
    }

    if (trimmed.length > 3 && !current.title) {
      current.title = trimmed.replace(/^[-•*]\s*/, "");
    } else if (trimmed.length > 3 && current.title && !current.description) {
      current.description = trimmed.replace(/^[-•*]\s*/, "");
    }

    if (current.title && current.price !== null) {
      items.push({ ...current });
      current = { title: "", description: "", price: null };
    }
  }

  if (current.title && current.price !== null) {
    items.push(current);
  }

  return items;
}

function compareMenus(localItems, talabatItems) {
  const localMap = new Map();
  const talabatMap = new Map();

  for (const item of localItems) {
    localMap.set(normalizeTitle(item.title), item);
  }
  for (const item of talabatItems) {
    talabatMap.set(normalizeTitle(item.title), item);
  }

  const allTitles = new Set([...localMap.keys(), ...talabatMap.keys()]);

  const priceChanges = [];
  const titleChanges = [];
  const descChanges = [];
  const onlyInTalabat = [];
  const onlyInLocal = [];

  for (const normTitle of allTitles) {
    const local = localMap.get(normTitle);
    const talabat = talabatMap.get(normTitle);

    if (local && !talabat) {
      onlyInLocal.push(local);
    } else if (talabat && !local) {
      onlyInTalabat.push(talabat);
    } else if (local && talabat) {
      if (local.price !== talabat.price) {
        priceChanges.push({ title: local.title, localPrice: local.price, talabatPrice: talabat.price });
      }
      if (normalizeTitle(local.title) !== normalizeTitle(talabat.title)) {
        titleChanges.push({ localTitle: local.title, talabatTitle: talabat.title });
      }
      if (normalizeTitle(local.description || "") !== normalizeTitle(talabat.description || "")) {
        descChanges.push({ title: local.title, localDesc: local.description, talabatDesc: talabat.description });
      }
    }
  }

  return { priceChanges, titleChanges, descChanges, onlyInTalabat, onlyInLocal };
}

function generateReport(comparison) {
  const lines = [];
  lines.push("# Menu Comparison Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push("");

  lines.push("## Price Changes");
  lines.push("");
  if (comparison.priceChanges.length === 0) {
    lines.push("No price changes detected.");
  } else {
    lines.push("| Item | Your Price (QAR) | Talabat Price (QAR) |");
    lines.push("|------|------------------|---------------------|");
    for (const change of comparison.priceChanges) {
      lines.push(`| ${change.title} | ${change.localPrice} | ${change.talabatPrice} |`);
    }
  }
  lines.push("");

  lines.push("## Title Changes");
  lines.push("");
  if (comparison.titleChanges.length === 0) {
    lines.push("No title changes detected.");
  } else {
    lines.push("| Your Title | Talabat Title |");
    lines.push("|------------|---------------|");
    for (const change of comparison.titleChanges) {
      lines.push(`| ${change.localTitle} | ${change.talabatTitle} |`);
    }
  }
  lines.push("");

  lines.push("## Description Changes");
  lines.push("");
  if (comparison.descChanges.length === 0) {
    lines.push("No description changes detected.");
  } else {
    lines.push("| Item | Your Description | Talabat Description |");
    lines.push("|------|------------------|---------------------|");
    for (const change of comparison.descChanges) {
      const truncate = (text) => (text && text.length > 100 ? text.slice(0, 100) + "..." : text || "");
      lines.push(`| ${change.title} | ${truncate(change.localDesc)} | ${truncate(change.talabatDesc)} |`);
    }
  }
  lines.push("");

  lines.push("## Items Only on Talabat");
  lines.push("");
  if (comparison.onlyInTalabat.length === 0) {
    lines.push("No items found exclusively on Talabat.");
  } else {
    for (const item of comparison.onlyInTalabat) {
      lines.push(`- ${item.title} (QAR ${item.price})`);
    }
  }
  lines.push("");

  lines.push("## Items Only on Your Website");
  lines.push("");
  if (comparison.onlyInLocal.length === 0) {
    lines.push("No items found exclusively on your website.");
  } else {
    for (const item of comparison.onlyInLocal) {
      lines.push(`- ${item.title} (QAR ${item.price})`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

function main() {
  console.log("Reading local menu from:", LOCAL_MENU_PATH);
  const localItems = extractMenuItemsFromTs(LOCAL_MENU_PATH);
  console.log(`Found ${localItems.length} items in local menu.`);

  console.log("Reading Talabat menu from:", TALABAT_MENU_PATH);
  if (!fs.existsSync(TALABAT_MENU_PATH)) {
    console.error(`Talabat menu file not found: ${TALABAT_MENU_PATH}`);
    console.error("Please provide the path as the first argument.");
    process.exit(1);
  }
  const talabatItems = loadTalabatMenu(TALABAT_MENU_PATH);
  console.log(`Found ${talabatItems.length} items in Talabat menu.`);

  const comparison = compareMenus(localItems, talabatItems);
  const report = generateReport(comparison);

  fs.writeFileSync(REPORT_PATH, report, "utf8");
  console.log(`\nReport saved to: ${REPORT_PATH}`);
  console.log("\n--- Report Preview ---\n");
  console.log(report);
}

main();
