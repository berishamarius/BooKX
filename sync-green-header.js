const fs = require('fs');
const path = require('path');

const surenDir = path.join(
  'c:/Users/beris_xrgc50t/KX KroniX/BooKX',
  'dist-alquran',
  'Übersetzungen',
  'Deutsch',
  'suren'
);

const templateFile = path.join(surenDir, '001-Al-Fatihah.html');
const styleRe = /<style id="karim-green-override">[\s\S]*?<\/style>/;
const forceStyleRe = /<style id="force-scheherazade">[\s\S]*?<\/style>/;

const templateHtml = fs.readFileSync(templateFile, 'utf8');
const templateMatch = templateHtml.match(styleRe);

if (!templateMatch) {
  throw new Error('Template style block id="karim-green-override" not found in 001-Al-Fatihah.html');
}

const templateStyle = templateMatch[0];
const files = fs.readdirSync(surenDir).filter((f) => f.endsWith('.html'));

let replaced = 0;
let inserted = 0;
let unchanged = 0;

for (const file of files) {
  const fullPath = path.join(surenDir, file);
  const html = fs.readFileSync(fullPath, 'utf8');
  let next = html;

  if (styleRe.test(html)) {
    next = html.replace(styleRe, templateStyle);
    if (next !== html) replaced += 1;
  } else if (forceStyleRe.test(html)) {
    next = html.replace(forceStyleRe, (m) => `${m}\n${templateStyle}`);
    inserted += 1;
  } else {
    unchanged += 1;
  }

  if (next !== html) {
    fs.writeFileSync(fullPath, next, 'utf8');
  }
}

console.log(`total=${files.length} replaced=${replaced} inserted=${inserted} unchanged=${unchanged}`);
