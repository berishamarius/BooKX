// Fixes non-German Bible chapters: replaces .base-p (local lang text) with Luther German from German chapters
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist-diebibel');
const deDir = path.join(DIST, 'german', 'bücher');
const deFiles = fs.readdirSync(deDir).filter(f => f.endsWith('.html'));

const langs = fs.readdirSync(DIST).filter(l => {
  try { return fs.statSync(path.join(DIST, l)).isDirectory() && l !== 'german'; }
  catch(_) { return false; }
});

// Extract .base-p content strings in order from an HTML file
function extractBasePTexts(html) {
  const results = [];
  const re = /<p class="base base-p">([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html)) !== null) results.push(m[1]);
  return results;
}

let totalFiles = 0;

for (const bookFile of deFiles) {
  const deHtml = fs.readFileSync(path.join(deDir, bookFile), 'utf8');
  const deTexts = extractBasePTexts(deHtml);
  if (!deTexts.length) continue;

  for (const lang of langs) {
    const bookPath = path.join(DIST, lang, 'bücher', bookFile);
    if (!fs.existsSync(bookPath)) continue;

    let html = fs.readFileSync(bookPath, 'utf8');
    let idx = 0;
    let changed = false;

    const newHtml = html.replace(/<p class="base base-p">([\s\S]*?)<\/p>/g, (match, content) => {
      const deText = deTexts[idx] !== undefined ? deTexts[idx] : content;
      idx++;
      if (deText === content) return match; // already correct
      changed = true;
      return `<p class="base base-p">${deText}</p>`;
    });

    if (changed) {
      fs.writeFileSync(bookPath, newHtml, 'utf8');
      console.log(`Fixed: ${lang}/${bookFile}`);
      totalFiles++;
    }
  }
}

console.log(`\nDone. ${totalFiles} files updated.`);
