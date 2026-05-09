'use strict';
/**
 * EPUB3 BUILDER – KX KroniX
 * Erzeugt vollständige EPUB3-Dateien aus den bereits gebauten HTML-Seiten.
 * Alle Links, Navigation und JavaScript (Konfessions-Switcher etc.) bleiben erhalten.
 *
 * Nutzung:
 *   node build-epub.js bibel      → CATHOLIC-BIBLE deutsch → die-heilige-bibel.epub
 *   node build-epub.js micheles   → Micheles Bibel        → micheles-bibel.epub
 *   node build-epub.js quran      → AL-QURAN Deutsch      → al-quran-deutsch.epub
 */

const fs       = require('fs');
const path     = require('path');
const JSZip = require('jszip');

const ROOT    = __dirname;
const OUT_DIR = path.join(ROOT, '..', 'KX-Bücher');  // C:\Users\...\KX KroniX\KX-Bücher\

// Ausgabeordner automatisch anlegen
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Konfigurationen ───────────────────────────────────────────────────────
const CONFIGS = {

  bibel: {
    htmlDir:  path.join(ROOT, 'CATHOLIC-BIBLE', 'Übersetzungen'),
    langCode: 'german',
    subDir:   'bücher',
    outFile:  path.join(OUT_DIR, 'Die Heilige Bibel.epub'),
    title:    'Die Heilige Bibel',
    subtitle: 'Catholica – Textbibel 1906',
    author:   'KX KroniX',
    lang:     'de',
    coverPng: path.join(ROOT, 'Die Heilige Bibel - Rot.png'),
  },

  micheles: {
    htmlDir:  path.join(ROOT, 'Geschenke', 'Bibel-Deutsch', 'Übersetzungen'),
    langCode: 'german',
    subDir:   'bücher',
    outFile:  path.join(OUT_DIR, 'Micheles Bibel.epub'),
    title:    'Die Heilige Bibel',
    subtitle: 'Für Michele',
    author:   'KX KroniX',
    lang:     'de',
    coverPng: path.join(ROOT, 'Die Heilige Bibel - Weiss - Michele.png'),
  },

  quran: {
    htmlDir:  path.join(ROOT, 'AL-QURAN', 'Übersetzungen'),
    langCode: 'Deutsch',
    subDir:   'suren',
    outFile:  path.join(OUT_DIR, 'Al-Quran Deutsch.epub'),
    title:    'Al-Quran',
    subtitle: 'Deutsch',
    author:   'KX KroniX',
    lang:     'de',
    coverPng: path.join(ROOT, 'Cover.png'),
  },

  meliha: {
    htmlDir:  path.join(ROOT, 'Geschenke', 'Koran-Deutsch-1', 'Übersetzungen'),
    langCode: 'Deutsch',
    subDir:   'suren',
    outFile:  path.join(OUT_DIR, 'Al-Quran – Meliha.epub'),
    title:    'Al-Quran',
    subtitle: 'Für Meliha',
    author:   'KX KroniX',
    lang:     'de',
    coverPng: path.join(ROOT, 'Cover geschenke.png'),
  },

  karim: {
    htmlDir:  path.join(ROOT, 'Geschenke', 'Koran-Deutsch-2', 'Übersetzungen'),
    langCode: 'Deutsch',
    subDir:   'suren',
    outFile:  path.join(OUT_DIR, 'Al-Quran – Karim.epub'),
    title:    'Al-Quran',
    subtitle: 'Für Karim',
    author:   'KX KroniX',
    lang:     'de',
    coverPng: path.join(ROOT, 'Cover geschenke.png'),
  },

};

// ─── Argumente ─────────────────────────────────────────────────────────────
const mode = process.argv[2];
if (!mode || !CONFIGS[mode]) {
  console.log('\nNutzung: node build-epub.js <bibel|micheles|quran|meliha|karim>\n');
  console.log('  bibel    →  Die Heilige Bibel (Deutsch)');
  console.log('  micheles →  Micheles persönliche Bibel');
  console.log('  quran    →  Al-Quran (Deutsch)');
  console.log('  meliha   →  Al-Quran – Für Meliha');
  console.log('  karim    →  Al-Quran – Für Karim\n');
  process.exit(0);
}

// ─── Hilfsfunktionen ───────────────────────────────────────────────────────

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Extrahiert <title> aus HTML, gibt ersten Teil (vor ·) zurück */
function getPageTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!m) return '';
  return m[1].split(/[·\|–\-]/)[0].trim()
    .replace(/&middot;/g, '').replace(/&amp;/g, '&').trim();
}

/**
 * Minimale HTML5 → XHTML5 Konvertierung für EPUB3.
 * CSS und Design werden NICHT verändert – 1:1 Übernahme der Suren-Designs.
 * Nur was für valides XML (EPUB-Parsing) nötig ist.
 */
function toXhtml(html) {
  // ── 0. <style> und <script> in CDATA einwickeln ───────────────────────
  const protected_ = [];
  const placeholder = (i) => `\x00XHTMLPROTECT${i}\x00`;

  html = html.replace(/<style(\b[^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs, content) => {
    const idx = protected_.length;
    const wrapped = content.includes('CDATA')
      ? `<style${attrs}>${content}</style>`
      : `<style${attrs}>/* <![CDATA[ */${content}/* ]]> */</style>`;
    protected_.push(wrapped);
    return placeholder(idx);
  });
  html = html.replace(/<script(\b[^>]*)>([\s\S]*?)<\/script>/gi, (_, attrs, content) => {
    const idx = protected_.length;
    const wrapped = (!content.trim() || content.includes('CDATA'))
      ? `<script${attrs}>${content}</script>`
      : `<script${attrs}>//<![CDATA[\n${content}\n//]]></script>`;
    protected_.push(wrapped);
    return placeholder(idx);
  });

  // ── 1. XML-Deklaration ────────────────────────────────────────────────
  if (!html.startsWith('<?xml')) {
    html = '<?xml version="1.0" encoding="UTF-8"?>\n' + html;
  }

  // ── 2. DOCTYPE ────────────────────────────────────────────────────────
  html = html.replace(/<!DOCTYPE\s+html[^>]*>/i, '<!DOCTYPE html>');

  // ── 3. xmlns auf <html> (nur wenn <html> kein xmlns hat) ─────────────
  if (!/<html\b[^>]*\bxmlns\s*=/i.test(html)) {
    html = html.replace(/<html(\b[^>]*)>/i,
      '<html xmlns="http://www.w3.org/1999/xhtml"$1>');
  }

  // ── 4. HTML Named Entities → Unicode ─────────────────────────────────
  const HTML_ENTITIES = {
    nbsp:'\u00a0',iexcl:'\u00a1',cent:'\u00a2',pound:'\u00a3',curren:'\u00a4',yen:'\u00a5',
    brvbar:'\u00a6',sect:'\u00a7',uml:'\u00a8',copy:'\u00a9',ordf:'\u00aa',laquo:'\u00ab',
    not:'\u00ac',shy:'\u00ad',reg:'\u00ae',macr:'\u00af',deg:'\u00b0',plusmn:'\u00b1',
    sup2:'\u00b2',sup3:'\u00b3',acute:'\u00b4',micro:'\u00b5',para:'\u00b6',middot:'\u00b7',
    cedil:'\u00b8',sup1:'\u00b9',ordm:'\u00ba',raquo:'\u00bb',frac14:'\u00bc',frac12:'\u00bd',
    frac34:'\u00be',iquest:'\u00bf',times:'\u00d7',divide:'\u00f7',Agrave:'\u00c0',Aacute:'\u00c1',
    Acirc:'\u00c2',Atilde:'\u00c3',Auml:'\u00c4',Aring:'\u00c5',AElig:'\u00c6',Ccedil:'\u00c7',
    Egrave:'\u00c8',Eacute:'\u00c9',Ecirc:'\u00ca',Euml:'\u00cb',Igrave:'\u00cc',Iacute:'\u00cd',
    Icirc:'\u00ce',Iuml:'\u00cf',ETH:'\u00d0',Ntilde:'\u00d1',Ograve:'\u00d2',Oacute:'\u00d3',
    Ocirc:'\u00d4',Otilde:'\u00d5',Ouml:'\u00d6',Oslash:'\u00d8',Ugrave:'\u00d9',Uacute:'\u00da',
    Ucirc:'\u00db',Uuml:'\u00dc',Yacute:'\u00dd',THORN:'\u00de',szlig:'\u00df',agrave:'\u00e0',
    aacute:'\u00e1',acirc:'\u00e2',atilde:'\u00e3',auml:'\u00e4',aring:'\u00e5',aelig:'\u00e6',
    ccedil:'\u00e7',egrave:'\u00e8',eacute:'\u00e9',ecirc:'\u00ea',euml:'\u00eb',igrave:'\u00ec',
    iacute:'\u00ed',icirc:'\u00ee',iuml:'\u00ef',eth:'\u00f0',ntilde:'\u00f1',ograve:'\u00f2',
    oacute:'\u00f3',ocirc:'\u00f4',otilde:'\u00f5',ouml:'\u00f6',oslash:'\u00f8',ugrave:'\u00f9',
    uacute:'\u00fa',ucirc:'\u00fb',uuml:'\u00fc',yacute:'\u00fd',thorn:'\u00fe',yuml:'\u00ff',
    fnof:'\u0192',Alpha:'\u0391',Beta:'\u0392',Gamma:'\u0393',Delta:'\u0394',Epsilon:'\u0395',
    Zeta:'\u0396',Eta:'\u0397',Theta:'\u0398',Iota:'\u0399',Kappa:'\u039a',Lambda:'\u039b',
    Mu:'\u039c',Nu:'\u039d',Xi:'\u039e',Omicron:'\u039f',Pi:'\u03a0',Rho:'\u03a1',Sigma:'\u03a3',
    Tau:'\u03a4',Upsilon:'\u03a5',Phi:'\u03a6',Chi:'\u03a7',Psi:'\u03a8',Omega:'\u03a9',
    alpha:'\u03b1',beta:'\u03b2',gamma:'\u03b3',delta:'\u03b4',epsilon:'\u03b5',zeta:'\u03b6',
    eta:'\u03b7',theta:'\u03b8',iota:'\u03b9',kappa:'\u03ba',lambda:'\u03bb',mu:'\u03bc',
    nu:'\u03bd',xi:'\u03be',omicron:'\u03bf',pi:'\u03c0',rho:'\u03c1',sigmaf:'\u03c2',
    sigma:'\u03c3',tau:'\u03c4',upsilon:'\u03c5',phi:'\u03c6',chi:'\u03c7',psi:'\u03c8',
    omega:'\u03c9',thetasym:'\u03d1',upsih:'\u03d2',piv:'\u03d6',bull:'\u2022',hellip:'\u2026',
    prime:'\u2032',Prime:'\u2033',oline:'\u203e',frasl:'\u2044',weierp:'\u2118',image:'\u2111',
    real:'\u211c',trade:'\u2122',alefsym:'\u2135',larr:'\u2190',uarr:'\u2191',rarr:'\u2192',
    darr:'\u2193',harr:'\u2194',crarr:'\u21b5',lArr:'\u21d0',uArr:'\u21d1',rArr:'\u21d2',
    dArr:'\u21d3',hArr:'\u21d4',forall:'\u2200',part:'\u2202',exist:'\u2203',empty:'\u2205',
    nabla:'\u2207',isin:'\u2208',notin:'\u2209',ni:'\u220b',prod:'\u220f',sum:'\u2211',
    minus:'\u2212',lowast:'\u2217',radic:'\u221a',prop:'\u221d',infin:'\u221e',ang:'\u2220',
    and:'\u2227',or:'\u2228',cap:'\u2229',cup:'\u222a',int:'\u222b',there4:'\u2234',sim:'\u223c',
    cong:'\u2245',asymp:'\u2248',ne:'\u2260',equiv:'\u2261',le:'\u2264',ge:'\u2265',sub:'\u2282',
    sup:'\u2283',nsub:'\u2284',sube:'\u2286',supe:'\u2287',oplus:'\u2295',otimes:'\u2297',
    perp:'\u22a5',sdot:'\u22c5',lceil:'\u2308',rceil:'\u2309',lfloor:'\u230a',rfloor:'\u230b',
    lang:'\u2329',rang:'\u232a',loz:'\u25ca',spades:'\u2660',clubs:'\u2663',hearts:'\u2665',
    diams:'\u2666',ensp:'\u2002',emsp:'\u2003',thinsp:'\u2009',zwnj:'\u200c',zwj:'\u200d',
    lrm:'\u200e',rlm:'\u200f',ndash:'\u2013',mdash:'\u2014',lsquo:'\u2018',rsquo:'\u2019',
    sbquo:'\u201a',ldquo:'\u201c',rdquo:'\u201d',bdquo:'\u201e',dagger:'\u2020',Dagger:'\u2021',
    permil:'\u2030',lsaquo:'\u2039',rsaquo:'\u203a',euro:'\u20ac',
  };
  html = html.replace(/&([a-zA-Z]\w{0,30});/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(HTML_ENTITIES, name) ? HTML_ENTITIES[name] : '&amp;' + name + ';'
  );
  html = html.replace(/&(?!(?:amp|lt|gt|apos|quot|#x[\da-fA-F]+|#\d+);)/g, '&amp;');

  // ── 5. Boolean-Attribute → XML-konforme Werte ─────────────────────────
  html = html.replace(/\bcrossorigin\b(?!=)/g, 'crossorigin="anonymous"');
  html = html.replace(/\bdefer\b(?!=)/g,       'defer="defer"');
  html = html.replace(/\basync\b(?!=)/g,        'async="async"');
  html = html.replace(/\bnomodule\b(?!=)/g,     'nomodule="nomodule"');

  // ── 6. Void-Elemente selbstschließend ─────────────────────────────────
  html = html.replace(
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*[^/])?>/gi,
    (_, tag, attrs) => `<${tag}${attrs || ''}/>`
  );

  // ── 7. Geschützte Blöcke wiederherstellen ─────────────────────────────
  html = html.replace(/\x00XHTMLPROTECT(\d+)\x00/g, (_, i) => protected_[+i]);

  // ── 8. Tote cover.html-Links entfernen (Seite nicht im EPUB) ────────
  html = html.replace(/<a\b[^>]*\bhref="(?:[^"]*\/)?cover\.html"[^>]*>[\s\S]*?<\/a>/gi, '');

  return html;
}

/** Gibt alphabetisch-numerisch sortierte .html-Dateien eines Ordners zurück */
function listHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// ─── Haupt-Builder ─────────────────────────────────────────────────────────
async function buildEpub(cfg) {
  const { htmlDir, langCode, subDir, outFile, title, subtitle, author, lang, coverPng } = cfg;
  const langDir  = path.join(htmlDir, langCode);
  const booksDir = path.join(langDir, subDir);

  if (!fs.existsSync(langDir)) {
    console.error(`\n❌  Quellordner nicht gefunden: ${langDir}`);
    console.error('   Bitte zuerst den Build ausführen!\n');
    process.exit(1);
  }

  const hasCoverPng = coverPng && fs.existsSync(coverPng);

  // ── 1. Seiten sammeln ──────────────────────────────────────────────────
  const items = [];

  function addItem(id, href, srcPath) {
    if (!fs.existsSync(srcPath)) return;
    const html  = fs.readFileSync(srcPath, 'utf8');
    const t     = getPageTitle(html);
    const hasJs = /<script[\s>]/i.test(html);
    items.push({ id, href, srcPath, pageTitle: t || id, hasJs });
  }

  for (const f of ['intro.html', 'vorwort.html', 'index.html']) {
    const id = `lang-${f.replace('.html', '')}`;
    addItem(id, `${langCode}/${f}`, path.join(langDir, f));
  }

  // Bücher / Suren
  for (const f of listHtml(booksDir)) {
    const id = `book-${f.replace('.html', '').replace(/[^a-z0-9]/gi, '-')}`;
    addItem(id, `${langCode}/${subDir}/${f}`, path.join(booksDir, f));
  }

  // Rückseiten
  for (const f of ['back-cover.html']) {
    addItem(`lang-back`, `${langCode}/${f}`, path.join(langDir, f));
    addItem(`root-back`, `root-back.html`, path.join(htmlDir, f));
  }

  // reader.js (Quran-Reader)
  const readerJsSrc = path.join(langDir, 'reader.js');
  const hasReaderJs = fs.existsSync(readerJsSrc);

  // ── 2. OPF generieren ──────────────────────────────────────────────────
  const uid   = `kronikx.${mode}.${Date.now()}`;
  const nowIso = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

  const manifestItems = items.map(item => {
    const props = item.hasJs ? ' properties="scripted"' : '';
    return `    <item id="${esc(item.id)}" href="${esc(item.href)}" media-type="application/xhtml+xml"${props}/>`;
  }).join('\n');

  const navEntry = `    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`;
  const ncxEntry = `    <item id="ncx" href="toc.ncx"  media-type="application/x-dtbncx+xml"/>`;
  const imgEntry = hasCoverPng
    ? `    <item id="cover-img" href="images/cover.png" media-type="image/png" properties="cover-image"/>`
    : '';
  const jsEntry = hasReaderJs
    ? `    <item id="reader-js" href="${langCode}/reader.js" media-type="application/javascript"/>`
    : '';

  const spineItems = items.map(item =>
    `    <itemref idref="${esc(item.id)}"/>`
  ).join('\n');

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         version="3.0"
         unique-identifier="bookid"
         xml:lang="${lang}">

  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${esc(uid)}</dc:identifier>
    <dc:title>${esc(title)}</dc:title>
    <dc:description>${esc(subtitle)}</dc:description>
    <dc:creator>${esc(author)}</dc:creator>
    <dc:language>${lang}</dc:language>
    <dc:date>${nowIso.split('T')[0]}</dc:date>
    <meta property="dcterms:modified">${nowIso}</meta>
    <meta property="rendition:layout">reflowable</meta>
    <meta property="rendition:flow">scrolled-continuous</meta>
    <meta property="rendition:orientation">auto</meta>
    <meta property="rendition:spread">none</meta>
    ${hasCoverPng ? '<meta name="cover" content="cover-img"/>' : ''}
  </metadata>

  <manifest>
${navEntry}
${ncxEntry}
${imgEntry}
${jsEntry}
${manifestItems}
  </manifest>

  <spine toc="ncx">
${spineItems}
  </spine>

</package>`;

  // ── 3. nav.xhtml generieren ────────────────────────────────────────────
  const navLi = items.map(item =>
    `      <li><a href="${esc(item.href)}">${esc(item.pageTitle)}</a></li>`
  ).join('\n');

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops"
      lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${esc(title)} – Inhaltsverzeichnis</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>${esc(title)}</h1>
    <ol>
${navLi}
    </ol>
  </nav>
</body>
</html>`;

  // ── 4. toc.ncx generieren (EPUB2-Fallback) ─────────────────────────────
  const ncxPoints = items.map((item, i) => `  <navPoint id="np${i + 1}" playOrder="${i + 1}">
    <navLabel><text>${esc(item.pageTitle)}</text></navLabel>
    <content src="${esc(item.href)}"/>
  </navPoint>`).join('\n');

  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid"            content="${esc(uid)}"/>
    <meta name="dtb:depth"          content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber"  content="0"/>
  </head>
  <docTitle><text>${esc(title)}</text></docTitle>
  <navMap>
${ncxPoints}
  </navMap>
</ncx>`;

  // ── 5. container.xml ──────────────────────────────────────────────────
  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0"
           xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf"
              media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  // ── 6. ZIP / EPUB erstellen ────────────────────────────────────────────
  console.log(`\n📖  EPUB wird gebaut: ${path.basename(outFile)}`);
  console.log(`    Seiten: ${items.length}`);

  const zip = new JSZip();

  // ── WICHTIG: mimetype ZUERST und UNKOMPRIMIERT (EPUB-Spezifikation) ──
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // META-INF
  zip.file('META-INF/container.xml', container, { compression: 'DEFLATE' });

  // OEBPS Metadaten
  zip.file('OEBPS/content.opf', opf,      { compression: 'DEFLATE' });
  zip.file('OEBPS/nav.xhtml',   navXhtml, { compression: 'DEFLATE' });
  zip.file('OEBPS/toc.ncx',     ncx,      { compression: 'DEFLATE' });

  // Cover-Bild
  if (hasCoverPng) {
    zip.file('OEBPS/images/cover.png', fs.readFileSync(coverPng), { compression: 'STORE' });
  }

  // reader.js
  if (hasReaderJs) {
    zip.file(`OEBPS/${langCode}/reader.js`, fs.readFileSync(readerJsSrc), { compression: 'DEFLATE' });
  }

  // Zusätzliche Bilder (für back-cover etc.) sammeln
  const extraImages = new Map(); // epubHref → srcPath

  // HTML-Seiten
  for (const item of items) {
    let html = fs.readFileSync(item.srcPath, 'utf8');

    // Cover: Bildpfad auf EPUB-interne images/cover.png korrigieren
    if (item.id === 'root-cover' && hasCoverPng) {
      html = html.replace(/src="[^"]*\.png"/g, 'src="images/cover.png"');
    }
    // Buchseiten: reader.js Pfad korrigieren (eine Ebene tiefer)
    if (item.href.includes(`/${subDir}/`)) {
      html = html.replace(/src="reader\.js"/g, 'src="../reader.js"');
    }

    // Back-cover: externe PNG-Pfade → EPUB-interne Bilder kopieren und Pfad korrigieren
    if (item.id === 'lang-back' || item.id === 'root-back') {
      html = html.replace(/src="([^"]+\.(?:png|jpg|jpeg|webp|gif))"/gi, (match, srcAttr) => {
        // Absoluten Pfad der Quelldatei auflösen
        const srcDir = path.dirname(item.srcPath);
        const absImg = path.resolve(srcDir, decodeURIComponent(srcAttr.replace(/%20/g, ' ')));
        if (!fs.existsSync(absImg)) return match; // Bild nicht gefunden → unverändert
        const imgName = 'back-' + path.basename(absImg).replace(/[^a-zA-Z0-9._-]/g, '-');
        const epubImgHref = `images/${imgName}`;
        extraImages.set(epubImgHref, absImg);
        // Relativer Pfad vom XHTML-Dokument zu images/
        const depth = item.href.split('/').length - 1; // Ordnertiefe in OEBPS
        const rel = '../'.repeat(depth) + epubImgHref;
        return `src="${rel}"`;
      });
    }

    // HTML5 → minimales XHTML5
    html = toXhtml(html);

    zip.file(`OEBPS/${item.href}`, html, { compression: 'DEFLATE' });
  }

  // Zusätzliche Bilder in EPUB einpacken
  for (const [href, srcPath] of extraImages) {
    zip.file(`OEBPS/${href}`, fs.readFileSync(srcPath), { compression: 'STORE' });
  }

  // Datei schreiben
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    // mimetype muss STORE bleiben – JSZip respektiert per-file compression
  });

  fs.writeFileSync(outFile, content);

  // ── Auch als .zip speichern (für Gmail-Versand) ──
  const zipOutFile = outFile.replace(/\.epub$/, '.zip');
  const zipWrapper = new JSZip();
  zipWrapper.file(path.basename(outFile), content);
  const zipContent = await zipWrapper.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  fs.writeFileSync(zipOutFile, zipContent);

  const mb    = (content.length    / 1024 / 1024).toFixed(1);
  const mbZip = (zipContent.length / 1024 / 1024).toFixed(1);
  console.log(`\n✅  Fertig!`);
  console.log(`    📚 EPUB:  ${path.basename(outFile)}  → ${mb} MB`);
  console.log(`    📦 ZIP:   ${path.basename(zipOutFile)} → ${mbZip} MB  (für Gmail)`);
  console.log(`    Ordner: ${OUT_DIR}\n`);
}

// ─── Start ─────────────────────────────────────────────────────────────────
buildEpub(CONFIGS[mode]).catch(err => {
  console.error('\n❌  Fehler:', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
