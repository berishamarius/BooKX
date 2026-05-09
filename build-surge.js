const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Favicons ─────────────────────────────────────────────────────────────────
const FAVICON_TAG = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='56' font-family='serif' fill='%238a5800'>&#x06DE;</text></svg>">`;
const BIBLE_FAVICON_TAG = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M32,4V60M12,18H52' stroke='%23C8A030' stroke-width='8' fill='none' stroke-linecap='square'/></svg>">`;

// CLI: node build-surge.js [meliha|karim|alquran|diebibel|micheles]  →  baut + deployt nur dieses Buch
const filter = (process.argv[2] || '').toLowerCase();

// ─── Bücher ───────────────────────────────────────────────────────────────────
const BOOKS = [
  {
    key        : 'meliha',
    bookRoot   : 'Geschenke/Koran-Deutsch-1',
    langDir    : '\u00dcbersetzungen/Deutsch',
    dist       : 'dist-meliha',
    domain     : 'melihas-koran.surge.sh',
    title      : "Meliha's Koran",
    images     : ['Cover geschenke.png', 'Back Geschenke.png', 'Suren Geschenke.png', 'Geschenke Hintergrund.png', 'Koran Geschenke Icon.png'],
    themeColor : '#F5EDD8',
    coverIcon  : 'Koran Geschenke Icon.png',
  },
  {
    key        : 'karim',
    bookRoot   : 'Geschenke/Koran-Deutsch-2',
    langDir    : '\u00dcbersetzungen/Deutsch',
    dist       : 'dist-karim',
    domain     : 'karims-koran.surge.sh',
    title      : "Karim's Koran",
    images     : ['Cover geschenke.png', 'Back Geschenke.png', 'Suren Geschenke.png', 'Geschenke Hintergrund.png', 'Koran Geschenke Icon.png'],
    themeColor : '#F5EDD8',
    coverIcon  : 'Koran Geschenke Icon.png',
  },
  {
    key        : 'alquran',
    bookRoot   : 'AL-QURAN',
    langDir    : '\u00dcbersetzungen/Deutsch',
    dist       : 'dist-alquran',
    domain     : 'alquran-de.surge.sh',
    title      : 'AL-QURAN \u00b7 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064a\u0645',
    images     : ['Cover.png', 'Back.png', 'Suren.png', 'Hintergrund.png', 'Koran Icon.png'],
    themeColor : '#1e3d22',
    coverIcon  : 'Koran Icon.png',
  },
  {
    key        : 'diebibel',
    bookRoot   : 'CATHOLIC-BIBLE/\u00dcbersetzungen',
    langDir    : 'german',
    dist       : 'dist-diebibel',
    domain     : 'diebibel-de.surge.sh',
    title      : 'Die Heilige Bibel',
    images     : ['Die Heilige Bibel - Rot.png', 'Bibel-Rueckseite-Katholisch.png', 'Die Heilige Bibel rot Icon.png'],
    themeColor : '#2a0810',
    rootDepth  : 1,
    favicon    : BIBLE_FAVICON_TAG,
    coverIcon  : 'Die Heilige Bibel rot Icon.png',
  },
  {
    key        : 'micheles',
    bookRoot   : 'Geschenke/Bibel-Deutsch/\u00dcbersetzungen',
    langDir    : 'german',
    dist       : 'dist-micheles',
    domain     : 'micheles-bibel-kx.surge.sh',
    title      : "Michele's Bibel",
    images     : ['Die Heilige Bibel - Weiss - Michele.png', 'Bibel-Rueckseite-Michele.png', 'Die Heilige Bibel Michele Icon.png'],
    themeColor : '#e8e0d0',
    rootDepth  : 1,
    favicon    : BIBLE_FAVICON_TAG,
    coverIcon  : 'Die Heilige Bibel Michele Icon.png',
  },
];

const ACTIVE = filter ? BOOKS.filter(b => b.key === filter) : BOOKS;
if (!ACTIVE.length) {
  console.error('Unbekanntes Buch: "' + filter + '". Erlaubt: meliha, karim, alquran, diebibel, micheles');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function fixImagePaths(content, distDepth, images) {
  const prefix = '../'.repeat(distDepth);
  for (const img of images) {
    const encoded = img.replace(/ /g, '%20');
    // match encoded src (with %20 for spaces)
    const encPat = encoded.replace(/\./g, '\\.').replace(/\+/g, '\\+');
    content = content.replace(new RegExp('(?:\\.\\./)+' + encPat, 'g'), prefix + encoded);
    // match unencoded src (raw spaces)
    if (img !== encoded) {
      const rawPat = img.replace(/\./g, '\\.').replace(/\+/g, '\\+').replace(/ /g, ' ');
      content = content.replace(new RegExp('(?:\\.\\./)+' + rawPat, 'g'), prefix + encoded);
    }
  }
  return content;
}

function processHtml(content, distDepth, book) {
  content = fixImagePaths(content, distDepth, book.images);
  if (!content.includes('width=device-width')) {
    content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width,initial-scale=1">');
  }
  if (!content.includes('rel="icon"')) {
    const iconTag  = book.favicon || FAVICON_TAG;
    const prefix   = '../'.repeat(distDepth);
    const touchTag = book.coverIcon
      ? `<link rel="apple-touch-icon" sizes="180x180" href="${prefix}${book.coverIcon.replace(/ /g, '%20')}">`
      : '';
    content = content.replace(
      '</head>',
      iconTag + '\n' + (touchTag ? touchTag + '\n' : '') +
      '<meta name="theme-color" content="' + book.themeColor + '">\n</head>'
    );
  }
  return content;
}

// ─── Build ────────────────────────────────────────────────────────────────────
for (const book of ACTIVE) {
  console.log('\n\uD83D\uDD28 Build: ' + book.title);

  if (fs.existsSync(book.dist)) fs.rmSync(book.dist, { recursive: true });
  fs.mkdirSync(book.dist, { recursive: true });

  // 1. Bilder ins Dist-Root kopieren
  for (const img of book.images) {
    if (fs.existsSync(img)) {
      fs.copyFileSync(img, path.join(book.dist, img));
      console.log('   \u2713 ' + img);
    }
  }

  // 2. cover.html + back-cover.html aus bookRoot → dist root
  for (const f of ['cover.html', 'back-cover.html']) {
    const src = path.join(book.bookRoot, f);
    if (fs.existsSync(src)) {
      let html = fs.readFileSync(src, 'utf8');
      html = processHtml(html, 0, book);
      fs.writeFileSync(path.join(book.dist, f), html, 'utf8');
      console.log('   \u2713 ' + f);
    }
  }

  // 3. langDir → dist/langDir (depth=2)
  const langSrc = path.join(book.bookRoot, book.langDir);
  const langDst = path.join(book.dist, book.langDir);
  copyDir(langSrc, langDst);

  function fixHtmlDir(dir, depth) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) { fixHtmlDir(fp, depth + 1); continue; }
      if (!e.name.endsWith('.html')) continue;
      let html = fs.readFileSync(fp, 'utf8');
      html = processHtml(html, depth, book);
      fs.writeFileSync(fp, html, 'utf8');
    }
  }
  fixHtmlDir(langDst, book.rootDepth != null ? book.rootDepth : 2);
  const surenDir  = path.join(langDst, 'suren');
  const buecherDir = path.join(langDst, 'b\u00fccher');
  const subCount  = fs.existsSync(surenDir)   ? fs.readdirSync(surenDir).length
                  : fs.existsSync(buecherDir) ? fs.readdirSync(buecherDir).length : 0;
  const dirLabel  = book.langDir || 'root';
  console.log('   \u2713 ' + dirLabel + '/ (' + (fs.readdirSync(langDst).length + subCount) + ' Dateien)');

  // 4. index.html → Redirect zu cover.html
  const redirectTarget = book.coverPath || 'cover.html';
  const touchIconTag = book.coverIcon
    ? `<link rel="apple-touch-icon" sizes="180x180" href="${book.coverIcon.replace(/ /g, '%20')}">` : '';
  const indexHtml = '<!DOCTYPE html><html lang="de"><head>\n'
    + '<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    + '<meta http-equiv="refresh" content="0;url=' + redirectTarget + '">\n'
    + '<title>' + book.title + '</title>\n'
    + (book.favicon || FAVICON_TAG) + '\n'
    + (touchIconTag ? touchIconTag + '\n' : '')
    + '<link rel="manifest" href="manifest.json">\n'
    + '<meta name="theme-color" content="' + book.themeColor + '">\n'
    + '</head><body></body></html>';
  fs.writeFileSync(path.join(book.dist, 'index.html'), indexHtml, 'utf8');
  fs.writeFileSync(path.join(book.dist, '200.html'), indexHtml, 'utf8');
  // manifest.json for Android home screen icon
  const iconFile = book.coverIcon ? book.coverIcon.replace(/ /g, '%20') : '';
  const manifest = JSON.stringify({
    name: book.title,
    short_name: book.title,
    start_url: '/',
    display: 'standalone',
    background_color: book.themeColor,
    theme_color: book.themeColor,
    icons: iconFile ? [
      { src: iconFile, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ] : []
  }, null, 2);
  fs.writeFileSync(path.join(book.dist, 'manifest.json'), manifest, 'utf8');
  console.log('   \u2713 index.html + 200.html + manifest.json \u2192 ' + redirectTarget);
}

// ─── Surge Deploy ─────────────────────────────────────────────────────────────
console.log('\n\uD83D\uDE80 Surge Deploy...\n');

for (const book of ACTIVE) {
  console.log('\n\uD83D\uDCE4 ' + book.title + ' \u2192 https://' + book.domain);
  execSync('npx surge "' + book.dist + '" "' + book.domain + '"', { stdio: 'inherit', cwd: process.cwd() });
}

console.log('\n\u2705 Fertig!');
for (const book of ACTIVE) {
  console.log('   ' + book.key + ' \u2192 https://' + book.domain);
}
