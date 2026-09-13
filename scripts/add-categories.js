const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '..', 'app', 'menu-data.ts');

let content = fs.readFileSync(menuDataPath, 'utf8');

content = content.replace(
  'export interface MenuItem {',
  'export interface MenuItem {\n  category: string;'
);

const iconToCategory = {
  Heart: 'Truffles',
  Cookie: 'Truffles & Bites',
  Coffee: 'Coffee',
  GlassWater: 'Beverages',
  UtensilsCrossed: 'Food',
  Star: 'Custom',
};

const lines = content.split('\n');
const updatedLines = [];
let currentItem = null;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  if (trimmed.startsWith('{') || trimmed.startsWith('},')) {
    braceDepth += (trimmed.match(/\{/g) || []).length;
    braceDepth -= (trimmed.match(/\}/g) || []).length;
  }
  
  if (trimmed.startsWith('icon:')) {
    const iconMatch = trimmed.match(/icon:\s*(\w+)/);
    if (iconMatch) {
      currentItem = iconMatch[1];
    }
  }
  
  if (trimmed.startsWith('image:') && currentItem) {
    const category = iconToCategory[currentItem] || 'Other';
    updatedLines.push(`    category: "${category}",`);
    currentItem = null;
  }
  
  updatedLines.push(line);
}

fs.writeFileSync(menuDataPath, updatedLines.join('\n'));
console.log('Added category field to menu items');
