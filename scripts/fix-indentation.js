const fs = require('fs');
const filePath = 'C:\\Users\\JB\\happy-truffles-cafe\\app\\menu-data.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix opening brace indentation
content = content.replace(/\n    \{/g, '\n  {');

fs.writeFileSync(filePath, content);
console.log('Fixed indentation');
