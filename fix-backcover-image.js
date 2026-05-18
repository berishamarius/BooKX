// fix-backcover-image.js
// Fix: Relative image path -> absolute so it works regardless of URL structure
const fs = require('fs');
const path = require('path');

const BIBLE_DIR = 'dist-diebibel';
const langs = fs.readdirSync(BIBLE_DIR).filter(x => {
  return fs.statSync(path.join(BIBLE_DIR, x)).isDirectory();
});

// Also fix root back-cover
const targets = [''].concat(langs);
let fixed = 0;

targets.forEach(function(lang) {
  const file = lang
    ? path.join(BIBLE_DIR, lang, 'back-cover.html')
    : path.join(BIBLE_DIR, 'back-cover.html');

  if (!fs.existsSync(file)) return;

  let html = fs.readFileSync(file, 'utf8');

  // Replace relative path with absolute path
  const before = html;
  html = html.replace(
    /src="\.\.\/Bibel-Rueckseite-Katholisch\.png"/g,
    'src="/Bibel-Rueckseite-Katholisch.png"'
  );
  html = html.replace(
    /src="Bibel-Rueckseite-Katholisch\.png"/g,
    'src="/Bibel-Rueckseite-Katholisch.png"'
  );

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    fixed++;
    console.log('  fixed:', lang || 'root');
  }
});

console.log('Done. Fixed:', fixed, 'back-cover files.');
