const { readFileSync, writeFileSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');

const outDir = join(__dirname, 'out');

function injectBase(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (existsSync(fullPath) && fullPath.endsWith('.html')) {
      let html = readFileSync(fullPath, 'utf8');
      html = html.replace('<head>', '<head><base href="/myWeb/" />');
      writeFileSync(fullPath, html);
    }
  }
}

injectBase(outDir);
