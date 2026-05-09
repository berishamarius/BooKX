'use strict';
const fs = require('fs');

fixGeschenke('Geschenke/Koran-Deutsch-1/redesign7.js', 'Meliha');
fixGeschenke('Geschenke/Koran-Deutsch-2/redesign7.js', 'Karim');
fixALQURAN('AL-QURAN/redesign8.js');

// =============================================================================
function fixGeschenke(file, name) {
  let src = fs.readFileSync(file, 'utf8');

  // ── 1) mainCoverHTML: nur PNG-Bild, kein eigener Content ──────────────────
  src = src.replace(
    /(\*\{margin:0;padding:0;box-sizing:border-box\}\r?\n)html\{background:[^\}]+\}\r?\nbody\{min-height:100vh;background:transparent[^\}]+\}\r?\n\.ta\{[^\}]+\}\r?\n\.bismi\{[^\}]+\}\r?\n\.ttl\{[^\}]+\}\r?\n\.bw\{[^\}]+\}\r?\n\.btn\{[^\}]+\}\r?\n\.btn:hover\{[^\}]+\}\r?\n<\/style><\/head><body>\r?\n<div class="ta">[\s\S]*?<\/div>\r?\n<\/body><\/html>`;\r?\n\}/,
    `*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;}
body{background:#000;}
a.cv{display:block;width:100%;height:100vh;}
a.cv img{width:100%;height:100%;object-fit:contain;display:block;}
</style></head><body>
<a class="cv" href="Übersetzungen/Deutsch/intro.html">
  <img src="../../Cover%20geschenke.png" alt="Cover">
</a>
</body></html>\`;
}`
  );

  // ── 2) backCoverHTML Funktion einfügen (direkt nach mainCoverHTML) ──────────
  if (!src.includes('function backCoverHTML')) {
    src = src.replace(
      /\/\/ \u2550{52}\r?\n\/\/  VORWORT\r?\n\/\/ \u2550{52}\r?\nfunction introHTML/,
      `// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  RÜCKSEITE
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function backCoverHTML(t){
  return \`<!DOCTYPE html>
<html lang="\${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rückseite · القرآن الكريم</title>
\${COPYRIGHT_META}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;}
body{background:#000;}
a.bc{display:block;width:100%;height:100vh;}
a.bc img{width:100%;height:100%;object-fit:contain;display:block;}
.nav-b{position:fixed;top:14px;left:18px;font:.6rem sans-serif;color:rgba(192,155,60,.55);text-decoration:none;letter-spacing:.06em;z-index:10;}
.nav-b:hover{color:#c9a84c;}
</style></head><body>
<a class="bc" href="intro.html">
  <img src="../../Back%20Geschenke.png" alt="Rückseite">
</a>
<a class="nav-b" href="intro.html">← Vorwort</a>
</body></html>\`;
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  VORWORT
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function introHTML`
    );
  }

  // ── 3) introHTML: PNG auf body statt html, pageHeader entfernen, kleiner ───
  // 3a) html+body CSS → body mit PNG, kleiner
  src = src.replace(
    /html\{background:#F5F0E3 url\('..\/..\/..\/..\/Vorwort%20geschenke\.png'\) top center\/100% auto no-repeat scroll;\}\r?\nbody\{color:#1A0A02;background:transparent;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;\}/,
    "body{background:url('../../../../Vorwort%20geschenke.png') top center/100% auto no-repeat scroll;color:#1A0A02;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}"
  );
  // nav transparent für Vorwort
  // 3b) main: kleinere margin
  src = src.replace(
    /main\{max-width:min\(740px,96vw\);margin:72px auto 110px;padding:0 44px;position:relative;z-index:1;\}/,
    "main{max-width:min(680px,94vw);margin:28px auto 60px;padding:0 24px;}"
  );
  // 3c) h2 und p kleiner
  src = src.replace(
    /h2\{font-size:1\.18rem;font-weight:400;color:#1A0A02;padding-bottom:14px;border-bottom:1px solid rgba\(192,155,60,\.22\)\}/,
    "h2{font-size:.92rem;font-weight:600;color:#1A0A02;padding-bottom:10px;border-bottom:1px solid rgba(192,155,60,.22)}"
  );
  src = src.replace(
    /p\{font-size:\.96rem;font-weight:300;line-height:2\.2;color:rgba\(26,10,2,\.75\);margin:1\.7em 0\}/,
    "p{font-size:.8rem;font-weight:400;line-height:1.8;color:rgba(26,10,2,.78);margin:1em 0}"
  );
  // 3d) bismi-box kleiner
  src = src.replace(
    /\.bismi-txt\{display:block;text-align:center;font-family:\$\{AR_FONT\};font-size:2\.4rem;color:#c9a84c;direction:rtl;line-height:1\.9;padding:26px 14px 12px\}/,
    ".bismi-txt{display:block;text-align:center;font-family:${AR_FONT};font-size:1.6rem;color:#c9a84c;direction:rtl;line-height:1.7;padding:16px 14px 8px}"
  );
  // 3e) pageHeader in intro HTML-Body entfernen
  src = src.replace(
    /\$\{pageHeader\('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', `\$\{t\.titleNative\} · القرآن الكريم`\)\}\r?\n<main>/,
    '<main>'
  );
  // 3f) bismi-geo Bänder entfernen aus HTML-Body
  src = src.replace(/      <div class="bismi-geo"><\/div>\r?\n/g, '');
  src = src.replace(/      <div class="bismi-geo-b"><\/div>\r?\n/g, '');

  // ── 4) indexHTML: PNG auf body ─────────────────────────────────────────────
  src = src.replace(
    /html\{background:#F5F0E3 url\('..\/..\/..\/..\/Inhalsangabe%20Geschenke\.png'\) top center\/100% auto no-repeat scroll;\}\r?\nbody\{color:#1A0A02;background:transparent;font-family:'Noto Serif',serif;/,
    "body{background:url('../../../../Inhalsangabe%20Geschenke.png') top center/100% auto no-repeat scroll;color:#1A0A02;font-family:'Noto Serif',serif;"
  );

  // ── 5) surahCSS: PNG auf html (Suren brauchen html wegen full-width) ───────
  // Already correct, skip.

  // ── 6) main(): back-cover generieren ──────────────────────────────────────
  if (!src.includes("back-cover.html'), backCoverHTML")) {
    src = src.replace(
      /    fs\.writeFileSync\(path\.join\(tDir,'intro\.html'\), introHTML\(t\),/,
      `    fs.writeFileSync(path.join(tDir,'back-cover.html'), backCoverHTML(t), 'utf8');
    fs.writeFileSync(path.join(tDir,'intro.html'), introHTML(t),`
    );
  }

  fs.writeFileSync(file, src, 'utf8');
  console.log('✓', file);
}

// =============================================================================
function fixALQURAN(file) {
  let src = fs.readFileSync(file, 'utf8');

  // ── 1) mainCoverHTML: nur Cover.png, language links bleiben ───────────────
  src = src.replace(
    /html\{background:#0f2412 url\('Cover\.png'\) top center\/100% auto no-repeat scroll;\}body\{min-height:100vh;background:transparent;display:flex;align-items:center;justify-content:center;\}/,
    "html,body{margin:0;padding:0;height:100%;}body{background:#000 url('Cover.png') top center/100% auto no-repeat scroll;display:flex;align-items:center;justify-content:center;}"
  );
  // book semi-transparent so PNG shows
  src = src.replace(
    "background:rgba(10,24,12,.82);",
    "background:rgba(0,0,0,.55);"
  );

  // ── 2) backCoverHTML Funktion einfügen ────────────────────────────────────
  if (!src.includes('function backCoverHTML')) {
    src = src.replace(
      /\/\/ \u2550{52}\r?\n\/\/  VORWORT\r?\n\/\/ \u2550{52}\r?\nfunction introHTML/,
      `// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  RÜCKSEITE
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function backCoverHTML(t){
  return \`<!DOCTYPE html>
<html lang="\${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rückseite · القرآن الكريم</title>
\${COPYRIGHT_META}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;}
body{background:#000;}
a.bc{display:block;width:100%;height:100vh;}
a.bc img{width:100%;height:100%;object-fit:contain;display:block;}
.nav-b{position:fixed;top:14px;left:18px;font:.6rem sans-serif;color:rgba(192,155,60,.45);text-decoration:none;letter-spacing:.06em;z-index:10;}
.nav-b:hover{color:#c9a84c;}
</style></head><body>
<a class="bc" href="intro.html">
  <img src="../../../Back.png" alt="Rückseite">
</a>
<a class="nav-b" href="intro.html">← Vorwort</a>
</body></html>\`;
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
//  VORWORT
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function introHTML`
    );
  }

  // ── 3) introHTML: PNG auf body, pageHeader entfernen, kleiner ─────────────
  src = src.replace(
    /html\{background:#1a3a1e url\('..\/..\/..\/Vorwort\.png'\) top center\/100% auto no-repeat scroll;\}\r?\nbody\{color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh\}/,
    "body{background:url('../../../Vorwort.png') top center/100% auto no-repeat scroll;color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh}"
  );
  // main kleiner
  src = src.replace(
    /main\{max-width:min\(740px,96vw\);margin:72px auto 110px;padding:0 44px\}/,
    "main{max-width:min(680px,94vw);margin:28px auto 60px;padding:0 24px}"
  );
  // h2 und p kleiner
  src = src.replace(
    /h2\{font-size:1\.18rem;font-weight:400;color:#3a1e00;padding-bottom:14px;border-bottom:1px solid rgba\(130,92,8,\.22\)\}/,
    "h2{font-size:.92rem;font-weight:600;color:#f0e6c0;padding-bottom:10px;border-bottom:1px solid rgba(192,155,60,.22)}"
  );
  src = src.replace(
    /p\{font-size:\.96rem;font-weight:300;line-height:2\.2;color:#2a1200;margin:1\.7em 0\}/,
    "p{font-size:.8rem;font-weight:400;line-height:1.8;color:rgba(240,230,192,.85);margin:1em 0}"
  );
  // bismi-txt kleiner
  src = src.replace(
    /\.bismi-txt\{display:block;text-align:center;font-family:\$\{AR_FONT\};font-size:2\.4rem;color:#5a3e00;direction:rtl;line-height:1\.9;padding:26px 14px 12px\}/,
    ".bismi-txt{display:block;text-align:center;font-family:${AR_FONT};font-size:1.6rem;color:#c9a84c;direction:rtl;line-height:1.7;padding:16px 14px 8px}"
  );
  // disc-banner entfernen aus HTML-body (r8 has disc-banner)
  src = src.replace(
    /\r?\n<div class="disc-banner">\$\{DISC_LONG\[t\.lang\]\|\|DISC_LONG\.de\}<\/div>/,
    ''
  );
  // pageHeader aus introHTML entfernen
  src = src.replace(
    /\$\{pageHeader\('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', `\$\{t\.titleNative\} · القرآن الكريم`\)\}\r?\n<div class="disc-banner">/,
    '<div style="display:none">'
  );
  // falls noch pageHeader in intro steht ohne disc-banner
  src = src.replace(
    /\$\{pageHeader\('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', `\$\{t\.titleNative\} · القرآن الكريم`\)\}\r?\n<main>/,
    '<main>'
  );
  // bismi-geo bänder entfernen
  src = src.replace(/      <div class="bismi-geo"><\/div>\r?\n/g, '');
  src = src.replace(/      <div class="bismi-geo-b"><\/div>\r?\n/g, '');

  // ── 4) indexHTML: PNG auf body ────────────────────────────────────────────
  src = src.replace(
    /html\{background:#1a3a1e url\('..\/..\/..\/Inhalsangabe\.png'\) top center\/100% auto no-repeat scroll;\}\r?\nbody\{color:#f0e6c0;font-family:'Noto Serif',serif\}/,
    "body{background:url('../../../Inhalsangabe.png') top center/100% auto no-repeat scroll;color:#f0e6c0;font-family:'Noto Serif',serif}"
  );

  // ── 5) main(): back-cover generieren ─────────────────────────────────────
  if (!src.includes("back-cover.html'), backCoverHTML")) {
    src = src.replace(
      /    fs\.writeFileSync\(path\.join\(tDir,'intro\.html'\), introHTML\(t\),/,
      `    fs.writeFileSync(path.join(tDir,'back-cover.html'), backCoverHTML(t), 'utf8');
    fs.writeFileSync(path.join(tDir,'intro.html'), introHTML(t),`
    );
  }

  fs.writeFileSync(file, src, 'utf8');
  console.log('✓', file);
}
