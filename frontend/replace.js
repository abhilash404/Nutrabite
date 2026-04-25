const fs = require('fs');
const path = require('path');

function replaceDollars(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceDollars(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('$')) {
        // Format visual dollars vs JS template injections
        content = content.replace(/\$\$\{/g, '₹${');
        content = content.replace(/>\$/g, '>₹');
        content = content.replace(/"\$/g, '"₹');
        content = content.replace(/ \$/g, ' ₹');
        content = content.replace(/ \$/g, ' ₹'); // double check
        
        // Remove .toFixed(2) since we now use integers
        content = content.replace(/\.toFixed\(2\)/g, '');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
replaceDollars('src');
console.log('Done converting $ to ₹');
