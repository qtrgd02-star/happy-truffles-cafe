const fs = require('fs');
const filePath = 'C:\\Users\\JB\\happy-truffles-cafe\\app\\menu-data.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace each item block with properly formatted version
content = content.replace(
  /\{\s*\n\s*id: (\d+),\s*\n\s*title: "([^"]+)"/g,
  '  {\n    id: $1,\n    title: "$2"'
);

fs.writeFileSync(filePath, content);
console.log('Fixed formatting');
