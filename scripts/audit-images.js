const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '..', 'app', 'menu-data.ts');
const publicMenuDir = path.join(__dirname, '..', 'public', 'menu');

const content = fs.readFileSync(menuDataPath, 'utf8');

const idMatches = [...content.matchAll(/id:\s*(\d+)/g)].map(m => parseInt(m[1]));

const existingImages = new Set(
  fs.readdirSync(publicMenuDir)
    .filter(f => f.endsWith('.jpg'))
    .map(f => f.replace('.jpg', ''))
);

const missing = idMatches.filter(id => {
  const paddedId = String(id).padStart(3, '0');
  return !existingImages.has(`menu-${paddedId}`);
});

console.log(`Total menu items: ${idMatches.length}`);
console.log(`Missing images: ${missing.length}`);
console.log('Missing IDs:', missing.join(', '));
