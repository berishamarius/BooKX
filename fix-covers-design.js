'use strict';
/**
 * fix-covers-design.js
 * - Remove L-corner decorations from all Bible front/back covers
 * - Add Quran-style thin top+bottom strip frame instead
 * - Fix Quran back-cover titles + nav links (localize from German)
 * - Move Quran dict button to left side on grid cover tiles
 * - Fix Bible grid cover: add frame strips, remove L corners
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');
const QURAN_DIST = path.join(ROOT, 'dist-alquran', 'Übersetzungen');

// ─── SVG ORNAMENT PATTERN (same as Quran) ─────────────────────────────────────
// Star polygon repeating pattern encoded as base64
const STAR_B64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PHBvbHlnb24gcG9pbnRzPSI3LjAwLDAuODQgNy45Niw0LjY3IDExLjM2LDIuNjQgOS4zMyw2LjA0IDEzLjE2LDcuMDAgOS4zMyw3Ljk2IDExLjM2LDExLjM2IDcuOTYsOS4zMyA3LjAwLDEzLjE2IDYuMDQsOS4zMyAyLjY0LDExLjM2IDQuNjcsNy45NiAwLjg0LDcuMDAgNC42Nyw2LjA0IDIuNjQsMi42NCA2LjA0LDQuNjciIGZpbGw9InJnYmEoMjAwLDE2MCw0OCwwLjM1KSIvPjwvc3ZnPg==';

// CSS for the new frame (top + bottom strips, no L corners)
const BIBLE_FRAME_CSS = `
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:10px;background:#1a0005 url("data:image/svg+xml;base64,${STAR_B64}") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(200,160,48,.32);}
.frame-bot{bottom:0;border-top:1px solid rgba(200,160,48,.32);}`;

const BIBLE_FRAME_CSS_DARK = `
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:10px;background:#2a0810 url("data:image/svg+xml;base64,${STAR_B64}") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(200,160,48,.32);}
.frame-bot{bottom:0;border-top:1px solid rgba(200,160,48,.32);}`;

const FRAME_HTML = `<div class="frame-top"></div>\n<div class="frame-bot"></div>`;

// Language metadata for Quran back-covers
const QURAN_META = {
  Albanisch:   { code:'sq', backTitle:'Kapaku i pasëm · القرآن الكريم', navBack:'← Hyrja',    navFwd:'Ballina →' },
  Bengalisch:  { code:'bn', backTitle:'পেছনের প্রচ্ছদ · القرآن الكريم', navBack:'← ভূমিকা',    navFwd:'প্রচ্ছদ →' },
  Bosnisch:    { code:'bs', backTitle:'Stražnja strana · القرآن الكريم', navBack:'← Predgovor', navFwd:'Naslovnica →' },
  Chinesisch:  { code:'zh', backTitle:'封底 · القرآن الكريم',           navBack:'← 序言',       navFwd:'封面 →' },
  Deutsch:     { code:'de', backTitle:'Rückseite · القرآن الكريم',      navBack:'← Vorwort',    navFwd:'Titelseite →' },
  Englisch:    { code:'en', backTitle:'Back Cover · القرآن الكريم',     navBack:'← Foreword',   navFwd:'Cover →' },
  Hausa:       { code:'ha', backTitle:'Bayan Murfin · القرآن الكريم',   navBack:'← Gabatarwa',  navFwd:'Murfin →' },
  Hindi:       { code:'hi', backTitle:'पिछला आवरण · القرآن الكريم',    navBack:'← प्रस्तावना', navFwd:'आवरण →' },
  Indonesisch: { code:'id', backTitle:'Sampul Belakang · القرآن الكريم',navBack:'← Pengantar',  navFwd:'Sampul →' },
  Persisch:    { code:'fa', backTitle:'پشت جلد · القرآن الكريم',        navBack:'← مقدمه',      navFwd:'جلد →' },
  Russisch:    { code:'ru', backTitle:'Задняя обложка · القرآن الكريم', navBack:'← Предисловие',navFwd:'Обложка →' },
  Türkisch:    { code:'tr', backTitle:'Arka Kapak · القرآن الكريم',     navBack:'← Önsöz',      navFwd:'Kapak →' },
  Urdu:        { code:'ur', backTitle:'پشت سرورق · القرآن الكريم',      navBack:'← دیباچہ',     navFwd:'سرورق →' },
  Uygurisch:   { code:'ug', backTitle:'ئارقا مۇقاۋا · القرآن الكريم',  navBack:'← كىرىش سۆز',  navFwd:'مۇقاۋا →' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function stripCorners(html) {
  // Remove .corner CSS rules
  html = html.replace(/\.corner\{[^}]+\}\s*/g, '');
  html = html.replace(/\.c-tl\{[^}]+\}\s*/g, '');
  html = html.replace(/\.c-tr\{[^}]+\}\s*/g, '');
  html = html.replace(/\.c-bl\{[^}]+\}\s*/g, '');
  html = html.replace(/\.c-br\{[^}]+\}\s*/g, '');
  // Remove corner div elements
  html = html.replace(/<div class="corner c-tl"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-tr"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-bl"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-br"><\/div>\s*/g, '');
  // Also handle combined corner lines
  html = html.replace(/<div class="corner c-tl"><\/div><div class="corner c-tr"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-bl"><\/div><div class="corner c-br"><\/div>\s*/g, '');
  return html;
}

function stripBodyBorders(html) {
  // Remove body::before and body::after border pseudo-elements from CSS
  html = html.replace(/body::before\{[^}]+\}\s*/g, '');
  html = html.replace(/body::after\{[^}]+\}\s*/g, '');
  return html;
}

function ensureFrameCSS(html, css) {
  // If frame CSS not already there, insert before closing </style>
  if (!html.includes('frame-top')) {
    html = html.replace(/(<\/style>)/, css + '\n$1');
  }
  return html;
}

function ensureFrameHTML(html) {
  // If frame divs not already in body, insert after <body>
  if (!html.includes('class="frame-top"')) {
    html = html.replace(/(<body[^>]*>)/, '$1\n' + FRAME_HTML);
  }
  return html;
}

// ─── 1. FIX BIBLE FRONT COVERS (individual language cover.html) ───────────────
console.log('\n[1] Fixing Bible front covers (remove L-corners, add frame strips)...');
for (const dir of fs.readdirSync(BIBLE_DIST)) {
  const coverPath = path.join(BIBLE_DIST, dir, 'cover.html');
  if (!fs.existsSync(coverPath)) continue;
  let html = fs.readFileSync(coverPath, 'utf8');
  html = stripCorners(html);
  html = stripBodyBorders(html);
  html = ensureFrameCSS(html, BIBLE_FRAME_CSS_DARK);
  html = ensureFrameHTML(html);
  fs.writeFileSync(coverPath, html, 'utf8');
  console.log(`  ✓ ${dir}/cover.html`);
}

// ─── 2. FIX BIBLE BACK COVERS (individual language back-cover.html) ──────────
console.log('\n[2] Fixing Bible back covers (remove L-corners, add frame strips)...');
for (const dir of fs.readdirSync(BIBLE_DIST)) {
  const bcPath = path.join(BIBLE_DIST, dir, 'back-cover.html');
  if (!fs.existsSync(bcPath)) continue;
  let html = fs.readFileSync(bcPath, 'utf8');
  html = stripCorners(html);
  html = stripBodyBorders(html);
  html = ensureFrameCSS(html, BIBLE_FRAME_CSS);
  html = ensureFrameHTML(html);
  fs.writeFileSync(bcPath, html, 'utf8');
  console.log(`  ✓ ${dir}/back-cover.html`);
}

// ─── 3. FIX BIBLE GRID COVER (dist-diebibel/cover.html) ──────────────────────
console.log('\n[3] Fixing Bible grid cover...');
{
  const gridCoverPath = path.join(BIBLE_DIST, 'cover.html');
  if (fs.existsSync(gridCoverPath)) {
    let html = fs.readFileSync(gridCoverPath, 'utf8');
    html = stripCorners(html);
    // The grid cover uses corner divs with class="corner c-tl" etc.
    // Already handled by stripCorners above
    // Add frame strips if not present
    const gridFrameCSS = `
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:10px;background:#1a0508 url("data:image/svg+xml;base64,${STAR_B64}") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(200,160,48,.32);}
.frame-bot{bottom:0;border-top:1px solid rgba(200,160,48,.32);}`;
    html = ensureFrameCSS(html, gridFrameCSS);
    html = ensureFrameHTML(html);
    fs.writeFileSync(gridCoverPath, html, 'utf8');
    console.log('  ✓ cover.html (grid)');
  }
}

// ─── 4. FIX BIBLE BACK COVER ALSO IN MAIN DIST ROOT ──────────────────────────
{
  const bcMain = path.join(BIBLE_DIST, 'back-cover.html');
  if (fs.existsSync(bcMain)) {
    let html = fs.readFileSync(bcMain, 'utf8');
    html = stripCorners(html);
    html = stripBodyBorders(html);
    const gridFrameCSS = `
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:10px;background:#1a0508 url("data:image/svg+xml;base64,${STAR_B64}") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(200,160,48,.32);}
.frame-bot{bottom:0;border-top:1px solid rgba(200,160,48,.32);}`;
    html = ensureFrameCSS(html, gridFrameCSS);
    html = ensureFrameHTML(html);
    fs.writeFileSync(bcMain, html, 'utf8');
    console.log('  ✓ back-cover.html (grid root)');
  }
}

// ─── 5. FIX QURAN BACK COVERS (localize title + nav) ─────────────────────────
console.log('\n[5] Fixing Quran back covers (localize titles + nav)...');
for (const [langDir, meta] of Object.entries(QURAN_META)) {
  const bcPath = path.join(QURAN_DIST, langDir, 'back-cover.html');
  if (!fs.existsSync(bcPath)) continue;
  let html = fs.readFileSync(bcPath, 'utf8');

  // Fix <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.backTitle}</title>`);

  // Fix nav link text "← Vorwort" → language-specific
  html = html.replace(/← Vorwort/, meta.navBack);

  // Fix any "Rückseite" alt text
  html = html.replace(/alt="Rückseite"/, `alt="${meta.backTitle.split(' · ')[0]}"`);

  fs.writeFileSync(bcPath, html, 'utf8');
  console.log(`  ✓ ${langDir}/back-cover.html`);
}

// ─── 6. FIX QURAN GRID COVER: dict button to LEFT ────────────────────────────
console.log('\n[6] Fixing Quran grid cover: dict button position to left...');
{
  const quranCoverPath = path.join(ROOT, 'dist-alquran', 'cover.html');
  if (fs.existsSync(quranCoverPath)) {
    let html = fs.readFileSync(quranCoverPath, 'utf8');
    // The tile-dict is positioned with top:6px;left:6px already
    // But if it says right:6px, fix it
    html = html.replace(/\.tile-dict\{([^}]*)right:6px([^}]*)\}/,
      (m, before, after) => `.tile-dict{${before}left:6px${after}}`);
    // Also ensure it's on left in inline style
    html = html.replace(/tile-dict[^"]*"[^>]*style="[^"]*right:/g,
      m => m.replace('right:', 'left:'));
    fs.writeFileSync(quranCoverPath, html, 'utf8');
    console.log('  ✓ dist-alquran/cover.html (dict button left)');
  }
}

// ─── 7. ALSO FIX QURAN LANGUAGE COVERS + INTRO (remove German labels) ─────────
console.log('\n[7] Fixing Quran per-language covers + intros...');
const QURAN_INTRO_TITLE = {
  Albanisch:'Parathënia', Bengalisch:'ভূমিকা', Bosnisch:'Predgovor',
  Chinesisch:'前言', Deutsch:'Vorwort', Englisch:'Foreword',
  Hausa:'Gabatarwa', Hindi:'प्रस्तावना', Indonesisch:'Pengantar',
  Persisch:'مقدمه', Russisch:'Предисловие', Türkisch:'Önsöz',
  Urdu:'دیباچہ', Uygurisch:'كىرىش سۆز',
};
for (const [langDir, meta] of Object.entries(QURAN_META)) {
  // Fix cover.html title
  const coverPath = path.join(QURAN_DIST, langDir, 'cover.html');
  if (fs.existsSync(coverPath)) {
    let html = fs.readFileSync(coverPath, 'utf8');
    // Remove German "Rückseite" or localize title
    html = html.replace(/<title>[^<]*Rückseite[^<]*<\/title>/,
      `<title>${meta.backTitle}</title>`);
    fs.writeFileSync(coverPath, html, 'utf8');
  }
  // Fix intro.html nav links if still German
  const introPath = path.join(QURAN_DIST, langDir, 'intro.html');
  if (fs.existsSync(introPath)) {
    let html = fs.readFileSync(introPath, 'utf8');
    const introTitle = QURAN_INTRO_TITLE[langDir] || 'Foreword';
    html = html.replace(/<title>Vorwort · القرآن الكريم<\/title>/,
      `<title>${introTitle} · القرآن الكريم</title>`);
    html = html.replace(/<title>القرآن الكريم · [^<]+<\/title>/,
      `<title>${introTitle} · القرآن الكريم</title>`);
    fs.writeFileSync(introPath, html, 'utf8');
  }
  console.log(`  ✓ ${langDir}`);
}

console.log('\n✅ All cover/back-cover design fixes applied.\n');
