const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'assets', 'fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

async function download(url, dest) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buf));
  console.log('Saved:', path.basename(dest), buf.byteLength, 'bytes');
}

async function run() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap';
  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const css = await res.text();
  fs.writeFileSync(path.join(fontsDir, 'google-fonts.css'), css);

  // Match: /* latin */ followed by @font-face { ... }
  const regex = /\/\*\s*latin\s*\*\/[\s\S]*?@font-face\s*\{([\s\S]*?)\}/g;
  let match;
  let fontFaces = [];
  let count = 0;

  while ((match = regex.exec(css)) !== null) {
    const block = match[1];
    const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (urlMatch && familyMatch && weightMatch) {
      const url = urlMatch[1];
      const familyName = familyMatch[1].trim();
      const famClean = familyName.replace(/\s+/g, '-').toLowerCase();
      const weight = weightMatch[1].trim();
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const filename = `${famClean}-${weight.replace(/\s+/g, '')}-${style}-latin.woff2`.replace(/[^a-z0-9.-]/g, '_');
      const dest = path.join(fontsDir, filename);

      await download(url, dest);
      count++;

      fontFaces.push(`@font-face {
  font-family: '${familyName}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('../fonts/${filename}') format('woff2');
  unicode-range: ${unicodeMatch ? unicodeMatch[1].trim() : 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'};
}`);
    }
  }

  const fontsCssPath = path.join(fontsDir, 'fonts.css');
  fs.writeFileSync(fontsCssPath, fontFaces.join('\n\n'));
  console.log('Saved fonts.css with', count, 'exact latin fonts');
}

run().catch(console.error);
