'use strict';
/**
 * BUNDLER – erzeugt eine einzige "Micheles Bibel.html"
 * Alle Seiten + Bilder werden eingebettet. Keine Internetverbindung nötig.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'Übersetzungen');
const OUT  = path.join(__dirname, "Michele's Bibel.html");

// Nur diese Verzeichnisse einschließen (root + german)
const INCLUDE_DIRS = ['', 'german', 'german/bücher'];

// ── Nur deutsche + Root-HTML-Dateien sammeln ───────────
function collectFiles(dir, rootDir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel  = path.relative(rootDir, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      const dirRel = rel;
      if (INCLUDE_DIRS.some(d => d === dirRel)) {
        result.push(...collectFiles(full, rootDir));
      }
    } else if (entry.name.endsWith('.html')) {
      result.push({ abs: full, rel });
    }
  }
  return result;
}

// ── Bilder als Base64 einbetten ────────────────────────
const imgCache = {};
function base64Img(absPath) {
  if (imgCache[absPath] !== undefined) return imgCache[absPath];
  if (!fs.existsSync(absPath)) { imgCache[absPath] = null; return null; }
  const ext  = path.extname(absPath).slice(1).toLowerCase();
  const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : `image/${ext}`;
  const b64  = fs.readFileSync(absPath).toString('base64');
  imgCache[absPath] = `data:${mime};base64,${b64}`;
  return imgCache[absPath];
}

// ── Pfad-Resolver (für den injected Script in jeder Seite) ─
// resolve('german/bücher', '../index.html') → 'german/index.html'
function clientResolveCode() {
  return `
function _resolve(base, href) {
  if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('data:') || href.startsWith('javascript:')) return null;
  var parts = (base + '/' + href).split('/');
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    if (p === '..') { out.pop(); }
    else if (p !== '.' && p !== '') { out.push(p); }
  }
  return out.join('/');
}`;
}

// ── Nav-Script, das in jede Seite injiziert wird ──────
function navScript(base) {
  return `
<script>
${clientResolveCode()}
(function(){
  var BASE = ${JSON.stringify(base)};
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    if (href === '#') return;
    e.preventDefault();
    var resolved = _resolve(BASE, href);
    if (resolved) window.parent.postMessage({nav: resolved}, '*');
  });
  // Meta-Refresh (z.B. index.html → cover.html)
  var meta = document.querySelector('meta[http-equiv="refresh"]');
  if (meta) {
    var cnt = meta.getAttribute('content') || '';
    var m = cnt.match(/url=(.+)/i);
    if (m) {
      var resolved = _resolve(BASE, m[1].trim());
      if (resolved) window.parent.postMessage({nav: resolved}, '*');
    }
  }
})();
<\/script>`;
}

// ── Sicher für Einbettung in <script>…</script> ────────
function safeJSON(html) {
  return JSON.stringify(html)
    .replace(/<\/script>/gi, '<\\/script>')
    .replace(/<\/style>/gi,  '<\\/style>');
}

// ── Hauptprogramm ──────────────────────────────────────
console.log('\n📖  Michele\'s Bibel – Bundler\n');

const files = collectFiles(ROOT, ROOT);
console.log(`   ${files.length} Seiten gefunden\n`);

const pageMap = {};

for (const { abs, rel } of files) {
  process.stdout.write(`   • ${rel} ...`);
  let html = fs.readFileSync(abs, 'utf8');
  const fileDir = path.dirname(abs);

  // 1. Bilder einbetten
  html = html.replace(/\bsrc="([^"]+)"/gi, (match, src) => {
    if (src.startsWith('data:') || src.startsWith('http')) return match;
    const imgAbs = path.resolve(fileDir, src);
    const enc = base64Img(imgAbs);
    return enc ? `src="${enc}"` : match;
  });

  // 2. Nav-Script vor </body> einfügen
  const base = path.dirname(rel).replace(/\\/g, '/');
  html = html.replace(/<\/body>/i, navScript(base) + '\n</body>');

  pageMap[rel] = html;
  process.stdout.write(' ✓\n');
}

// ── Ausgabe ────────────────────────────────────────────
let pagesJS = 'var _P={\n';
for (const [rel, html] of Object.entries(pageMap)) {
  pagesJS += `${JSON.stringify(rel)}:${safeJSON(html)},\n`;
}
pagesJS += '};\n';

const out = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Michele's Bibel</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;width:100%;overflow:hidden;background:#1a0a04;}
#fr{width:100%;height:100vh;border:none;display:block;}
</style>
</head>
<body>
<iframe id="fr"></iframe>
<script>
${pagesJS}
var _fr=document.getElementById('fr');
var _cur='cover.html';
var _hist=[];
function nav(rel){
  var content=_P[rel];
  if(!content){console.warn('Seite nicht gefunden:',rel);return;}
  _hist.push(_cur);
  _cur=rel;
  _fr.srcdoc=content;
}
window.addEventListener('message',function(e){
  if(e.data&&e.data.nav)nav(e.data.nav);
});
nav('cover.html');
</script>
</body>
</html>`;

fs.writeFileSync(OUT, out, 'utf8');
const mb = Math.round(fs.statSync(OUT).size / 1024 / 1024 * 10) / 10;
console.log(`\n✅  Michele's Bibel.html erstellt! (${mb} MB)`);
console.log(`   Pfad: ${OUT}\n`);
