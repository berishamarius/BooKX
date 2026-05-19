// Comprehensive fix script:
// 1. Remove cover overlay from all covers
// 2. Add bookmark glow to all Bible index.html files
// 3. Fix Italian index: title, htitle, topbar button
// 4. Fix Romanian htitle
// 5. Fix Italian chapters: Protestant title (Italian name, Cinzel), NEL→Nel in .tra
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist-diebibel');

// ── 1. Remove cover overlay script from all cover.html files ──────────────
let coverCount = 0;
function removeCoverOverlay(fp) {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;
  // Remove the bookmark overlay IIFE (starts with var bm; try { bm = JSON.parse)
  html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?var bm;[\s\S]*?\}\)\(\);\s*<\/script>/g, '');
  // Remove the pageshow reload script we added
  html = html.replace(/<script>window\.addEventListener\('pageshow'[\s\S]*?<\/script>/g, '');
  if (html !== fs.readFileSync(fp, 'utf8').toString()) { changed = true; }
  // Re-check by comparing
  const orig = fs.readFileSync(fp, 'utf8');
  if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); coverCount++; }
}

// Bible covers
for (const lang of fs.readdirSync(DIST)) {
  const fp = path.join(DIST, lang, 'cover.html');
  removeCoverOverlay(fp);
}
// Quran covers
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    removeCoverOverlay(path.join(quranBase, lang, 'cover.html'));
  }
}
console.log(`Removed overlay from ${coverCount} cover files.`);

// ── 2. Add bookmark glow to all Bible index.html files ───────────────────
const GLOW_SCRIPT = `<script>
(function(){
  var bm;
  try { bm = JSON.parse(localStorage.getItem('KX_bookmark') || 'null'); } catch(_){}
  if (!bm || !bm.url) return;
  // Extract book filename from bookmark URL (e.g. /italian/bücher/001-gen.html#v1-1)
  var m = bm.url.match(/b[uü]cher\\/([^#?]+)/i) || bm.url.match(/bücher\\/([^#?]+)/i);
  if (!m) return;
  var bookFile = m[1];
  // Find the toc-item linking to this book
  var items = document.querySelectorAll('a.toc-item');
  for (var i = 0; i < items.length; i++) {
    var href = items[i].getAttribute('href') || '';
    if (href.indexOf(bookFile) >= 0) {
      items[i].style.cssText += ';background:rgba(200,160,48,.13);box-shadow:0 0 18px rgba(200,160,48,.18),inset 0 0 0 1px rgba(200,160,48,.35);border-radius:3px;';
      // Add a small bookmark indicator
      var bki = document.createElement('span');
      bki.textContent = '✦';
      bki.style.cssText = 'color:#EDD882;font-size:.7rem;margin-left:8px;opacity:.9;flex-shrink:0;';
      items[i].insertBefore(bki, items[i].querySelector('.tarr'));
      break;
    }
  }
})();
</script>`;

let indexCount = 0;
for (const lang of fs.readdirSync(DIST)) {
  const fp = path.join(DIST, lang, 'index.html');
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('KX_bookmark') && html.includes('toc-item')) continue; // already done
  if (!html.includes('</body>')) continue;
  html = html.replace('</body>', GLOW_SCRIPT + '\n</body>');
  fs.writeFileSync(fp, html, 'utf8');
  indexCount++;
}
console.log(`Added bookmark glow to ${indexCount} index files.`);

// ── 3. Fix Italian index: htitle, title tag, topbar button ───────────────
const itIndex = path.join(DIST, 'italian', 'index.html');
if (fs.existsSync(itIndex)) {
  let html = fs.readFileSync(itIndex, 'utf8');
  html = html.replace(/<div class="htitle">La Biblia<\/div>/, '<div class="htitle">La Sacra Bibbia</div>');
  html = html.replace(/<title>La Biblia\s*·\s*Italiano<\/title>/, '<title>La Sacra Bibbia · Italiano</title>');
  html = html.replace('← La Biblia · Tutte le lingue', '← Tutte le lingue');
  html = html.replace('← La Biblia · Alle Sprachen', '← Alle Sprachen'); // in case
  fs.writeFileSync(itIndex, html, 'utf8');
  console.log('Fixed Italian index.html');
}

// ── 4. Fix Romanian htitle ────────────────────────────────────────────────
const roIndex = path.join(DIST, 'romanian', 'index.html');
if (fs.existsSync(roIndex)) {
  let html = fs.readFileSync(roIndex, 'utf8');
  html = html.replace(/<div class="htitle">Biblia<\/div>/, '<div class="htitle">Biblia Sfântă</div>');
  html = html.replace(/<title>Biblia\s*·/, '<title>Biblia Sfântă ·');
  fs.writeFileSync(roIndex, html, 'utf8');
  console.log('Fixed Romanian index.html');
}

// ── 5. Fix Italian chapters: Protestant title + NEL→Nel ──────────────────
// First build filename→Italian name map from index.html
const itIndexHtml = fs.readFileSync(itIndex, 'utf8');
const bookMap = {};
const mapRe = /href="b[uü]cher\/([^"]+)"[^>]*>[\s\S]*?<span class="tname">([^<]+)<\/span>/g;
let mapM;
while ((mapM = mapRe.exec(itIndexHtml)) !== null) {
  bookMap[mapM[1]] = mapM[2].trim().toUpperCase();
}
console.log(`Book map: ${Object.keys(bookMap).length} entries`);

// CSS override for Italian Protestant title (Cinzel, not Fraktur)
const PROT_TITLE_CSS = `\nbody[data-conf="protestant"] .blatin-p{font-family:'Cinzel',serif!important;font-size:clamp(1.4rem,5vw,2.4rem)!important;letter-spacing:.14em;}\n`;

const itBücherDir = path.join(DIST, 'italian', 'bücher');
let chapCount = 0;

for (const f of fs.readdirSync(itBücherDir)) {
  if (!f.endsWith('.html')) continue;
  const fp = path.join(itBücherDir, f);
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Fix .blatin-p content: replace "GENESIS" with Italian name
  const italianName = bookMap[f];
  if (italianName) {
    // Replace content of .blatin-p div (currently same as .blatin-c)
    const blatinRe = /(<div class="blatin blatin-p">)([^<]*)(<\/div>)/;
    const blatinMatch = html.match(blatinRe);
    if (blatinMatch && blatinMatch[2] !== italianName) {
      html = html.replace(blatinRe, `$1${italianName}$3`);
      changed = true;
    }
    // Add Cinzel CSS override if not already present
    if (!html.includes('blatin-p{font-family:\'Cinzel\'')) {
      html = html.replace('</style>', PROT_TITLE_CSS + '</style>');
      changed = true;
    }
  }

  // Fix .tra initial all-caps word → sentence case (e.g. NEL→Nel, E→E is fine)
  // Only fix words 2+ uppercase letters at the start of .tra content
  html = html.replace(/(<p class="tra">)([A-ZÀÈÉÌÒÙÄÖÜ]{2,})(\s)/g, (match, tag, word, space) => {
    const fixed = word.charAt(0) + word.slice(1).toLowerCase();
    return tag + fixed + space;
  });
  // Special case: multi-word all-caps start like "E LA TERRA" won't be here, fine

  if (html !== fs.readFileSync(fp, 'utf8')) { changed = true; }
  const orig = fs.readFileSync(fp, 'utf8');
  if (html !== orig) {
    fs.writeFileSync(fp, html, 'utf8');
    chapCount++;
  }
}
console.log(`Fixed ${chapCount} Italian chapter files.`);
console.log('\nAll done.');
