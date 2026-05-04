const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace(/<span>[^<]{1,5}<\/span>\s*<span>\{car\.importation\}<\/span>\s*<span>[^<]{1,5}<\/span>/g, '<span>&middot;</span>\n                  <span>{car.importation}</span>\n                  <span>&middot;</span>');
fs.writeFileSync('src/pages/Home.tsx', content);
