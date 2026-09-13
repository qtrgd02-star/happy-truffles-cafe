const fs = require("fs");
const path = require("path");

const TALABAT_HTML_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : String.raw`C:\Users\JB\OneDrive\Desktop\Happy Truffles Cafe menu for delivery in Abu Hamour _ Talabat.html`;
const TALABAT_JSON_PATH = path.join(__dirname, "talabat-menu.json");

const html = fs.readFileSync(TALABAT_HTML_PATH, "utf8");

const itemRegex = /<div[^>]*class="[^"]*\bf-15\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*\bf-12 description\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="text-right price-rating">[\s\S]*?<span class="currency ">([\s\S]*?)<\/span>/g;

const items = [];
let match;

while ((match = itemRegex.exec(html)) !== null) {
  let title = match[1].trim();
  let description = match[2].trim();
  const priceText = match[3].trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

  title = title.replace(/<[^>]*>/g, "").trim();
  description = description.replace(/<[^>]*>/g, "").trim();

  if (title && !isNaN(price) && !title.includes("<") && !title.includes("&")) {
    items.push({
      title,
      description,
      price,
    });
  }
}

console.log(`Extracted ${items.length} items from Talabat HTML.`);

fs.writeFileSync(TALABAT_JSON_PATH, JSON.stringify(items, null, 2), "utf8");
console.log(`Saved to: ${TALABAT_JSON_PATH}`);
