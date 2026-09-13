const fs = require("fs");
const content = fs.readFileSync("app/menu-data.ts", "utf8");

for (let id = 249; id <= 256; id++) {
  const regex = new RegExp(`id:\\s*${id},[\\s\\S]*?title:\\s*"([^"]+)"`);
  const match = content.match(regex);
  if (match) {
    console.log(`ID ${id}: ${match[1]}`);
  } else {
    console.log(`ID ${id}: NOT FOUND`);
  }
}
