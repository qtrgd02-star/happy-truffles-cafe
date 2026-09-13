const fs = require("fs");
const path = require("path");

const TALABAT_JSON_PATH = path.join(__dirname, "talabat-menu.json");
const MENU_DATA_PATH = path.join(__dirname, "..", "app", "menu-data.ts");

const talabatItems = JSON.parse(fs.readFileSync(TALABAT_JSON_PATH, "utf8"));
const menuDataContent = fs.readFileSync(MENU_DATA_PATH, "utf8");

const existingTitles = new Set();
const titleRegex = /title:\s*"([^"]+)"/g;
let match;
while ((match = titleRegex.exec(menuDataContent)) !== null) {
  existingTitles.add(match[1].trim());
}

const missingItems = talabatItems.filter(item => !existingTitles.has(item.title));

console.log(`Total Talabat items: ${talabatItems.length}`);
console.log(`Already in website: ${existingTitles.size}`);
console.log(`Missing items to add: ${missingItems.length}`);

if (missingItems.length === 0) {
  console.log("No missing items to add.");
  process.exit(0);
}

const lastIdMatch = menuDataContent.match(/id:\s*(\d+),[\s\S]*?price:\s*\d+,[\s\S]*?highlight:\s*false,/g);
let lastId = 248;
if (lastIdMatch) {
  const ids = lastIdMatch.map(m => parseInt(m.match(/id:\s*(\d+)/)[1]));
  lastId = Math.max(...ids);
}

console.log(`Current last ID: ${lastId}`);
console.log(`New items will start from ID: ${lastId + 1}`);

const newItems = [];
for (let i = 0; i < missingItems.length; i++) {
  const item = missingItems[i];
  const id = lastId + 1 + i;
  const escapedDesc = item.description.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  
  let category = "Truffles & Bites";
  if (item.title.includes("Coffee") || item.title.includes("Latte") || item.title.includes("Americano") || item.title.includes("Cappuccino") || item.title.includes("Flat White") || item.title.includes("Caramel") || item.title.includes("Hazelnut") || item.title.includes("Spanish") || item.title.includes("V60") || item.title.includes("Cortado") || item.title.includes("Matcha") || item.title.includes("Ube") || item.title.includes("Strawberry") || item.title.includes("Peach") || item.title.includes("Lemon") || item.title.includes("Lychee") || item.title.includes("Mojito") || item.title.includes("Sparkler") || item.title.includes("Matcha Cloud") || item.title.includes("Velvet Milk") || item.title.includes("Cheesecake Latte") || item.title.includes("Iced")) {
    category = "Signature Drinks";
  } else if (item.title.includes("Sandwich") || item.title.includes("Breakfast Combo")) {
    category = "Sandwich";
  } else if (item.title.includes("Greeting Card")) {
    category = "Single Box Gifts";
  } else if (item.title.includes("Box") || item.title.includes("Single Box")) {
    category = "Single Box Gifts";
  } else if (item.title.includes("Truffles") || item.title.includes("Bites") || item.title.includes("Mix")) {
    category = "Truffles & Bites";
  }

  const imageNum = String(id).padStart(3, "0");
  const imagePath = `/menu/menu-${imageNum}.jpg`;

  newItems.push(`
  {
    id: ${id},
    title: "${item.title.replace(/"/g, '\\"')}",
    description: "${escapedDesc}",
    price: ${item.price},
    highlight: false,
    icon: Cookie,
    category: "${category}",
    image: "${imagePath}",
  },`);
}

const newItemsText = "\n" + newItems.join("\n") + "\n";
const lastBracketIndex = menuDataContent.lastIndexOf("];");
const updatedContent = menuDataContent.slice(0, lastBracketIndex) + newItemsText + menuDataContent.slice(lastBracketIndex);

fs.writeFileSync(MENU_DATA_PATH, updatedContent, "utf8");
console.log(`\nAdded ${missingItems.length} new items to menu-data.ts`);
console.log("New items added:");
for (const item of missingItems) {
  console.log(`  - ${item.title} (QAR ${item.price})`);
}
