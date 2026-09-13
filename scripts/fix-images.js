const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '..', 'app', 'menu-data.ts');
const publicMenuDir = path.join(__dirname, '..', 'public', 'menu');

let content = fs.readFileSync(menuDataPath, 'utf8');

const existingImages = new Set(
  fs.readdirSync(publicMenuDir)
    .filter(f => f.endsWith('.jpg'))
    .map(f => f.replace('.jpg', ''))
);

function getLocalImagePath(id) {
  const paddedId = String(id).padStart(3, '0');
  if (existingImages.has(`menu-${paddedId}`)) {
    return `/menu/menu-${paddedId}.jpg`;
  }
  
  for (let offset = 1; offset <= 10; offset++) {
    const lower = id - offset;
    const upper = id + offset;
    if (lower >= 1) {
      const lowerPadded = String(lower).padStart(3, '0');
      if (existingImages.has(`menu-${lowerPadded}`)) {
        return `/menu/menu-${lowerPadded}.jpg`;
      }
    }
    if (upper <= 250) {
      const upperPadded = String(upper).padStart(3, '0');
      if (existingImages.has(`menu-${upperPadded}`)) {
        return `/menu/menu-${upperPadded}.jpg`;
      }
    }
  }
  
  return '/menu/menu-001.jpg';
}

const lines = content.split('\n');
const updatedLines = [];
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/id:\s*(\d+)/);
  if (idMatch) {
    currentId = parseInt(idMatch[1]);
  }
  
  const imageMatch = line.match(/image:\s*"(https?:\/\/[^"]+)"/);
  if (imageMatch) {
    const localPath = getLocalImagePath(currentId);
    updatedLines.push(`    image: "${localPath}",`);
  } else {
    updatedLines.push(line);
  }
}

fs.writeFileSync(menuDataPath, updatedLines.join('\n'));
console.log('Fixed menu images to use local paths');
