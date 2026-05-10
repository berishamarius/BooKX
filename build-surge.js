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
    password   : 'SmolMeli',
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
    password   : 'Karim_njm',
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
    password   : 'MiniMimi',
  },
];

const ACTIVE = filter ? BOOKS.filter(b => b.key === filter) : BOOKS;
if (!ACTIVE.length) {
  console.error('Unbekanntes Buch: "' + filter + '". Erlaubt: meliha, karim, alquran, diebibel, micheles');
  process.exit(1);
}

// ─── Bookmark palette per book ────────────────────────────────────────────────
function getBookmarkPalette(bookKey) {
  const palettes = {
    meliha:   { icon: '#d4a574', border: '#9b7d5c', hover: '#e8c8a0', bg: 'rgba(16,10,6,.88)', bgHover: 'rgba(20,12,8,.92)' },
    karim:    { icon: '#d4a574', border: '#9b7d5c', hover: '#e8c8a0', bg: 'rgba(16,10,6,.88)', bgHover: 'rgba(20,12,8,.92)' },
    alquran:  { icon: '#d4a574', border: '#9b7d5c', hover: '#e8c8a0', bg: 'rgba(16,10,6,.88)', bgHover: 'rgba(20,12,8,.92)' },
    diebibel: { icon: '#f1d7c8', border: '#9c4a44', hover: '#ffe7dc', bg: 'rgba(86,24,31,.95)', bgHover: 'rgba(121,33,43,.97)' },
    micheles: { icon: '#4b341f', border: '#cfb790', hover: '#2f2014', bg: 'rgba(244,229,204,.96)', bgHover: 'rgba(232,214,184,.98)' },
  };
  return palettes[bookKey] || palettes.alquran;
}

function getBookmarkIconCss(bookKey) {
  const p = getBookmarkPalette(bookKey);
  return `<style>#bm-icon-btn{position:absolute;top:14px;right:14px;width:52px;height:52px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;color:${p.icon};background:linear-gradient(155deg,${p.bg},${p.bgHover});border:2px solid ${p.border};border-radius:16px;backdrop-filter:blur(8px);z-index:40;box-shadow:0 12px 24px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.16);transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,color .22s ease;}#bm-icon-btn::before{content:'';position:absolute;inset:5px;border:1px solid rgba(255,255,255,.22);border-radius:11px;pointer-events:none;}#bm-icon-btn::after{content:'Weiterlesen';position:absolute;top:50%;right:calc(100% + 10px);transform:translateY(-50%) translateX(6px);opacity:0;pointer-events:none;white-space:nowrap;font:600 .62rem/1.1 'Noto Serif',serif;letter-spacing:.05em;color:${p.icon};background:${p.bg};border:1px solid ${p.border};padding:6px 8px;border-radius:8px;box-shadow:0 8px 18px rgba(0,0,0,.32);transition:opacity .2s ease,transform .2s ease;}#bm-icon-btn:hover,#bm-icon-btn:focus-visible{transform:translateY(-1px) scale(1.04);border-color:${p.hover};color:${p.hover};box-shadow:0 16px 30px rgba(0,0,0,.34),0 0 0 4px rgba(255,255,255,.10),inset 0 1px 0 rgba(255,255,255,.16);}#bm-icon-btn:hover::after,#bm-icon-btn:focus-visible::after{opacity:1;transform:translateY(-50%) translateX(0);}#bm-icon-btn svg{width:24px;height:24px;display:block;fill:currentColor;filter:drop-shadow(0 0 8px ${p.icon}44);}#bm-icon-btn:focus-visible{outline:none;}@media (max-width:640px){#bm-icon-btn{top:10px;right:10px;width:46px;height:46px;border-radius:14px;}#bm-icon-btn svg{width:21px;height:21px;}#bm-icon-btn::after{display:none;}}</style>`;
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

// ─── Bookmark-JS-Snippets ──────────────────────────────────────────────────────
function getBookmarkSuraJs(bookKey) {
  const p = getBookmarkPalette(bookKey);
  return `
<script>
(function(){
  var BM_KEY = 'KX_bookmark';
  var toast, toastTimer;
  function showToast(txt) {
    if (!toast) {
      toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${p.bg};color:${p.icon};font-family:sans-serif;font-size:.78rem;letter-spacing:.08em;padding:9px 20px;border-radius:10px;border:1px solid ${p.border};pointer-events:none;z-index:999;transition:opacity .3s,transform .3s;box-shadow:0 12px 24px rgba(0,0,0,.24)';
      document.body.appendChild(toast);
    }
    toast.textContent = txt;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(6px)'; }, 1800);
  }
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.matches && el.matches('.verse, .vb')) break;
      el = el.parentElement;
    }
    if (!el || el === document.body) return;
    if (e.target.tagName === 'A') return;
    var id = el.id;
    if (!id) return;
    var data = { url: location.pathname + '#' + id, title: document.title, id: id, ts: Date.now() };
    try { localStorage.setItem(BM_KEY, JSON.stringify(data)); } catch(_){}
    showToast('✦ Lesezeichen gesetzt');
  });
})();
</script>
`;
}

const BOOKMARK_COVER_JS = `
<script>
(function(){
  var BM_KEY = 'KX_bookmark';
  try {
    var raw = localStorage.getItem(BM_KEY);
    if (!raw) return;
    var bm = JSON.parse(raw);
    if (!bm.url) return;
    var icon = document.createElement('a');
    icon.href = bm.url;
    icon.id = 'bm-icon-btn';
    var title = (bm.title || '').replace(/\\s*·.*$/, '').trim();
    icon.setAttribute('aria-label', 'Zum Lesezeichen springen');
    icon.title = title ? ('Weiterlesen: ' + title) : 'Weiterlesen';
    icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17a.5.5 0 0 1-.8.4L12 17l-6.2 4.4A.5.5 0 0 1 5 21V4a1 1 0 0 1 1-1z"></path></svg>';
    var coverHost = document.querySelector('a.cv, a.book, .book');
    if (coverHost) {
      try {
        if (getComputedStyle(coverHost).position === 'static') {
          coverHost.style.position = 'relative';
        }
      } catch(_){ }
      coverHost.appendChild(icon);
    } else {
      document.body.appendChild(icon);
    }
    icon.addEventListener('click', function(e){ setTimeout(function(){ window.location.href = bm.url; }, 10); });
  } catch(_){}
})();
</script>
`;

function processHtml(content, distDepth, book) {
  content = fixImagePaths(content, distDepth, book.images);
  if (!content.includes('width=device-width')) {
    content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width,initial-scale=1">');
  }
  
  // Inject Scheherazade New and force it onto verse, intro, and index Arabic text.
  if (!content.includes('force-scheherazade')) {
    const arabicFontCss = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet"><style id="force-scheherazade">.ar,.verse .ar,.vb .ar,div.ar,span.ar,p.ar,.ra,.bismi-txt,.sh-rub,.sh-name,.sh-meta,.ttl-ar,.orn{font-family:'Scheherazade New','Arabic Typesetting','Traditional Arabic',serif !important;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}div.ar,span.ar,p.ar{font-weight:700 !important;font-size:1.72em !important;letter-spacing:.03em;line-height:2.28 !important;word-spacing:.1em;}.bismi-txt{font-size:2.15rem !important;line-height:1.9 !important;}.ra{font-size:2.45rem !important;line-height:1.45 !important;}.sh-rub{font-size:2rem !important;}.sh-name{font-size:5rem !important;line-height:1.18 !important;}.sh-meta{font-size:1rem !important;}.ttl-ar{font-size:1.5rem !important;}.tr{font-size:.93rem !important;line-height:1.82 !important;}</style>`;
    content = content.replace('</head>', arabicFontCss + '\n</head>');
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
  // Inject bookmark JS into sura/chapter pages
  if ((content.includes('class="verse"') || content.includes('class="vb"')) && !content.includes('KX_bookmark')) {
    content = content.replace('</body>', getBookmarkSuraJs(book.key) + '</body>');
  }
  // Inject bookmark display into cover pages
  if (content.includes('class="cv"') || (content.includes('<a class="book"') && !content.includes('back-cover'))) {
    if (!content.includes('KX_bookmark')) {
      // inject CSS for a cleaner, ornamental bookmark icon on cover (dynamically colored per book)
      const bmCss = getBookmarkIconCss(book.key) + '\n';
      content = content.replace('</head>', bmCss + '</head>');
      content = content.replace('</body>', BOOKMARK_COVER_JS + '</body>');
    }
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

  // 5. vercel.json (immer)
  fs.writeFileSync(path.join(book.dist, 'vercel.json'), '{ "version": 2 }\n', 'utf8');

  // 6. middleware.js (nur für passwortgeschützte Bücher)
  if (book.password) {
    const pw = book.password;
    const middleware = `export const config = { matcher: ['/((?!_vercel|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|css|js|json|txt)$).*)'] };
export default function middleware(req) {
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const colon = decoded.indexOf(':');
      if (colon !== -1 && decoded.slice(colon + 1) === '${pw}') {
        return; // pass through to static file
      }
    } catch (_) {}
  }
  return new Response('Zugang verweigert', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Privat"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
`;
    fs.writeFileSync(path.join(book.dist, 'middleware.js'), middleware, 'utf8');
    console.log('   \u2713 middleware.js (Passwortschutz: ${pw})');
  }
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
