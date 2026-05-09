const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
//  CSS-only side pillar blocks (replaces PNG frame decoration)
// ═══════════════════════════════════════════════════════════════════════════

// Geschenke: beige/gold theme
const PILLAR_GESCHENKE = `
/* ── Dekorative Seiten-Säulen (CSS-only, kein PNG) ── */
body::before,body::after{content:'';position:fixed;top:0;bottom:0;width:160px;pointer-events:none;z-index:50;background-color:#e9e0c8;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.13) 4px,rgba(192,155,60,.13) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.13) 4px,rgba(192,155,60,.13) 5px);background-size:10px 10px;}
body::before{left:0;border-right:3px solid #c9a84c;box-shadow:inset -10px 0 28px rgba(192,155,60,.14),4px 0 16px rgba(192,155,60,.08);}
body::after{right:0;border-left:3px solid #c9a84c;box-shadow:inset 10px 0 28px rgba(192,155,60,.14),-4px 0 16px rgba(192,155,60,.08);}`;

// Original AL-QURAN: dark green/gold theme
const PILLAR_ORIGINAL = `
/* ── Dekorative Seiten-Säulen (CSS-only, kein PNG) ── */
body::before,body::after{content:'';position:fixed;top:0;bottom:0;width:160px;pointer-events:none;z-index:50;background-color:#0f2812;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.1) 4px,rgba(192,155,60,.1) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.1) 4px,rgba(192,155,60,.1) 5px);background-size:10px 10px;}
body::before{left:0;border-right:3px solid rgba(192,155,60,.65);box-shadow:inset -10px 0 28px rgba(192,155,60,.08);}
body::after{right:0;border-left:3px solid rgba(192,155,60,.65);box-shadow:inset 10px 0 28px rgba(192,155,60,.08);}`;

// Inject pillar CSS before closing </style>
function addPillars(html, pillars) {
  return html.replace('</style>', pillars + '\n</style>');
}

// ═══════════════════════════════════════════════════════════════════════════
//  GESCHENKE – Koran-Deutsch-1 & Koran-Deutsch-2
// ═══════════════════════════════════════════════════════════════════════════
const BASE_G = path.join(__dirname, 'Geschenke');
let totalG = 0;

for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const surenDir = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const orig = html;

    // Remove PNG from .page-wrap – replace any background:url(...)...no-repeat with nothing
    html = html.replace(
      /\.page-wrap\{flex:1;min-height:0;background:url\([^)]+\)[^;]+;(display:flex)/,
      '.page-wrap{flex:1;min-height:0;$1'
    );

    // Add pillar CSS
    if (!html.includes('body::before')) html = addPillars(html, PILLAR_GESCHENKE);

    if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); totalG++; }
  }
  console.log(`✓ Geschenke ${dir}: ${files.length} Suren`);
}

// Geschenke index.html
for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const fp = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'index.html');
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Remove PNG from .list
  html = html.replace(
    /\.list\{flex:1;min-height:0;background:url\([^)]+\)[^;]+;(overflow)/,
    '.list{flex:1;min-height:0;$1'
  );

  if (!html.includes('body::before')) html = addPillars(html, PILLAR_GESCHENKE);
  if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); totalG++; }
  console.log(`✓ Geschenke ${dir}/index.html`);
}

// Geschenke intro.html
for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const fp = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'intro.html');
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Remove PNG from main
  html = html.replace(
    /main\{flex:1;min-height:0;background:url\([^)]+\)[^;]+;(overflow)/,
    'main{flex:1;min-height:0;$1'
  );

  if (!html.includes('body::before')) html = addPillars(html, PILLAR_GESCHENKE);
  if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); totalG++; }
  console.log(`✓ Geschenke ${dir}/intro.html`);
}

console.log(`\n✅ Geschenke gesamt: ${totalG} Dateien\n`);

// ═══════════════════════════════════════════════════════════════════════════
//  ORIGINAL AL-QURAN – alle Sprachen
// ═══════════════════════════════════════════════════════════════════════════
const BASE_Q = path.join(__dirname, 'AL-QURAN', 'Übersetzungen');
const langDirs = fs.readdirSync(BASE_Q).filter(d =>
  fs.statSync(path.join(BASE_Q, d)).isDirectory()
);
let totalQ = 0;

for (const lang of langDirs) {
  const langPath = path.join(BASE_Q, lang);
  let count = 0;

  // suren/*.html
  const surenDir = path.join(langPath, 'suren');
  if (fs.existsSync(surenDir)) {
    const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
    for (const file of files) {
      const fp = path.join(surenDir, file);
      let html = fs.readFileSync(fp, 'utf8');
      const orig = html;

      // Remove PNG from .page-wrap (contains no-repeat)
      html = html.replace(
        /\.page-wrap\{\s*flex:1;\s*background:url\([^)]+\)[^;]+;\s*(display:flex)/,
        '.page-wrap{flex:1;$1'
      );
      // Also handle the multi-line version
      html = html.replace(
        /\.page-wrap\{\n\s*flex:1;\n\s*background:url\([^)]+\)[^;]+;\n\s*(display:flex)/,
        '.page-wrap{\n  flex:1;\n  $1'
      );

      if (!html.includes('body::before')) html = addPillars(html, PILLAR_ORIGINAL);
      if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); count++; }
    }
  }

  // index.html
  const indexFp = path.join(langPath, 'index.html');
  if (fs.existsSync(indexFp)) {
    let html = fs.readFileSync(indexFp, 'utf8');
    const orig = html;
    html = html.replace(
      /\.list\{flex:1;min-height:0;background:url\([^)]+\)[^;]+;(overflow)/,
      '.list{flex:1;min-height:0;$1'
    );
    if (!html.includes('body::before')) html = addPillars(html, PILLAR_ORIGINAL);
    if (html !== orig) { fs.writeFileSync(indexFp, html, 'utf8'); count++; }
  }

  // intro.html
  const introFp = path.join(langPath, 'intro.html');
  if (fs.existsSync(introFp)) {
    let html = fs.readFileSync(introFp, 'utf8');
    const orig = html;
    html = html.replace(
      /main\{flex:1;min-height:0;background:url\([^)]+\)[^;]+;(overflow)/,
      'main{flex:1;min-height:0;$1'
    );
    if (!html.includes('body::before')) html = addPillars(html, PILLAR_ORIGINAL);
    if (html !== orig) { fs.writeFileSync(introFp, html, 'utf8'); count++; }
  }

  if (count > 0) {
    console.log(`✓ AL-QURAN ${lang}: ${count} Dateien`);
    totalQ += count;
  }
}

console.log(`\n✅ AL-QURAN gesamt: ${totalQ} Dateien`);
console.log(`\n🎉 Total: ${totalG + totalQ} Dateien aktualisiert`);
