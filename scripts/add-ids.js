const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\JB\\happy-truffles-cafe\\app\\menu-data.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find all menu items and add id field
const itemPattern = /(\s+)\{(\n\s+title:)/g;
let match;
let id = 1;
const replacements = [];

while ((match = itemPattern.exec(content)) !== null) {
  const indent = match[1];
  replacements.push({
    index: match.index,
    length: match[0].length,
    replacement: `${indent}{\n${indent}  id: ${id},\n${indent}${match[2].trim()}`,
  });
  id++;
}

// Apply replacements in reverse order to maintain indices
for (let i = replacements.length - 1; i >= 0; i--) {
  const { index, length, replacement } = replacements[i];
  content = content.slice(0, index) + replacement + content.slice(index + length);
}

fs.writeFileSync(filePath, content);
console.log(`Added ${replacements.length} ids to menu items`);
