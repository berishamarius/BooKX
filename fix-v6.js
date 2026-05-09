const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
//  Columns as body BACKGROUND gradient (no pseudo-elements, no z-index issues)
//  Nav + footer just need opaque backgrounds to cover the gradient on sides
// ═══════════════════════════════════════════════════════════════════════════

const G_BG = `linear-gradient(to right,#c9a84c,#c9a84c 2px,#ddd4a4 2px,#ddd4a4 178px,#F5F0E3 178px,#F5F0E3 calc(100% - 178px),#ddd4a4 calc(100% - 178px),#ddd4a4 calc(100% - 2px),#c9a84c calc(100% - 2px),#c9a84c) 0/100% 100% fixed,#F5F0E3`;
const Q_BG = `linear-gradient(to right,rgba(192,155,60,.72),rgba(192,155,60,.72) 2px,#0d2612 2px,#0d2612 178px,#1a3a1e 178px,#1a3a1e calc(100% - 178px),#0d2612 calc(100% - 178px),#0d2612 calc(100% - 2px),rgba(192,155,60,.72) calc(100% - 2px),rgba(192,155,60,.72)) 0/100% 100% fixed,#1a3a1e`;

// Remove the body::before/after pillars block
function removePillars(html) {
  return html.replace(/\n?\/\* ── (Dekorative )?Seiten-Säulen[^*]*\*\/[\s\S]*?body::after\{[^}]*\}\n?/g, '');
}

// Inject CSS overrides right before </style> — later rules win in same-specificity CSS
function inject(html, css) {
  return html.replace('</style>', css + '\n</style>');
}

// ═══════════════════════════════════════════════════════════════════════════
//  GESCHENKE – Suren (228 files)
// ═══════════════════════════════════════════════════════════════════════════
const BASE_G = path.join(__dirname, 'Geschenke');
let countG = 0;

// CSS injected into EVERY Geschenke sura file
const G_SURA_INJECT = `
/* ─── v6: column-gradient body, geo header strips, wider content ─── */
.sh{text-align:center;padding:0;border-bottom:1px solid rgba(192,155,60,.25);position:relative;z-index:1;background:transparent;}
.sh::before{content:'';display:block;height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(192,155,60,.12) 3px,rgba(192,155,60,.12) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(192,155,60,.12) 3px,rgba(192,155,60,.12) 4px);background-size:8px 10px;border-bottom:1px solid rgba(192,155,60,.18);}
.sh-in{padding:18px 24px 18px;text-align:center;}
.sh::after{content:'';display:block;height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(192,155,60,.12) 3px,rgba(192,155,60,.12) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(192,155,60,.12) 3px,rgba(192,155,60,.12) 4px);background-size:8px 10px;border-top:1px solid rgba(192,155,60,.18);}
.bismi-area{border-bottom:1px solid rgba(192,155,60,.18);position:relative;z-index:1;background:transparent;}
.bismi-txt{display:block;text-align:center;padding:24px;font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:2.8rem;color:#c9a84c;direction:rtl;line-height:2;}
.page-wrap{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;overflow-y:auto;position:relative;z-index:1;}
.verses{flex:1;min-height:0;overflow-y:auto;width:min(800px,70vw);padding:32px 32px 56px;box-sizing:border-box;scrollbar-width:none;}
.verses::-webkit-scrollbar{display:none;}
.tr{font-family:'Noto Serif',Georgia,serif;font-size:1rem;font-weight:400;line-height:1.9;color:rgba(26,10,2,.85);direction:ltr;text-align:left;hyphens:none;-webkit-hyphens:none;padding:10px 20px;border-left:2px solid rgba(192,155,60,.3);margin-top:18px;}
.bot-nav{flex-shrink:0;background:#F4EDD8;border-top:1px solid rgba(192,155,60,.2);display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;min-height:64px;position:relative;z-index:1;}`;

for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const surenDir = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'suren');
  for (const file of fs.readdirSync(surenDir).filter(f => f.endsWith('.html'))) {
    const fp = path.join(surenDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const orig = html;

    html = removePillars(html);
    // Body: replace beige with gradient
    html = html.replace(
      'background:#F5F0E3;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;}',
      `background:${G_BG};min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;}`
    );
    // Remove mask-image (was on .verses)
    html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
    html = inject(html, G_SURA_INJECT);

    if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); countG++; }
  }
  console.log(`✓ Geschenke ${dir} Suren`);
}

// ─── Geschenke index.html ────────────────────────────────────────────────────
const G_INDEX_INJECT = `
/* ─── v6 ─── */
nav{background:#F4EDD8;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:1px solid rgba(192,155,60,.22);position:sticky;top:0;z-index:200;flex-shrink:0;}
.list{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{flex:1;min-height:0;overflow-y:auto;width:min(820px,70vw);padding:24px 0 36px;scrollbar-width:none;}
.list-rows::-webkit-scrollbar{display:none;}
footer{flex-shrink:0;background:#F4EDD8;border-top:1px solid rgba(192,155,60,.2);padding:0;position:relative;z-index:1;}`;

for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const fp = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'index.html');
  let html = fs.readFileSync(fp, 'utf8');
  html = removePillars(html);
  html = html.replace(
    "background:#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}",
    `background:${G_BG};color:#1A0A02;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}`
  );
  html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
  html = inject(html, G_INDEX_INJECT);
  fs.writeFileSync(fp, html, 'utf8'); countG++;
  console.log(`✓ Geschenke ${dir}/index.html`);
}

// ─── Geschenke intro.html ────────────────────────────────────────────────────
const G_INTRO_INJECT = `
/* ─── v6 ─── */
main{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.intro-c{flex:1;min-height:0;overflow-y:auto;width:min(820px,70vw);padding:28px 5% 36px;scrollbar-width:none;}
.intro-c::-webkit-scrollbar{display:none;}
h2{font-size:1rem;font-weight:600;color:#1A0A02;padding-bottom:10px;border-bottom:1px solid rgba(192,155,60,.28);}
p{font-size:.95rem;line-height:1.88;color:rgba(26,10,2,.85);margin:.9em 0;}
footer{flex-shrink:0;background:#F4EDD8;border-top:1px solid rgba(192,155,60,.2);padding:0;position:relative;z-index:1;}`;

for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const fp = path.join(BASE_G, dir, 'Übersetzungen', 'Deutsch', 'intro.html');
  let html = fs.readFileSync(fp, 'utf8');
  html = removePillars(html);
  html = html.replace(
    "background:#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}",
    `background:${G_BG};color:#1A0A02;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}`
  );
  html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
  html = inject(html, G_INTRO_INJECT);
  fs.writeFileSync(fp, html, 'utf8'); countG++;
  console.log(`✓ Geschenke ${dir}/intro.html`);
}

console.log(`\n✅ Geschenke: ${countG} Dateien\n`);

// ═══════════════════════════════════════════════════════════════════════════
//  ORIGINAL AL-QURAN – alle Sprachen
// ═══════════════════════════════════════════════════════════════════════════
const BASE_Q = path.join(__dirname, 'AL-QURAN', 'Übersetzungen');
const langDirs = fs.readdirSync(BASE_Q).filter(d =>
  fs.statSync(path.join(BASE_Q, d)).isDirectory()
);
let countQ = 0;

const Q_SURA_INJECT = `
/* ─── v6 ─── */
.sh{background:transparent;}
.bismi-area{border-bottom:1px solid rgba(130,92,8,.2);background:transparent;}
.bismi-txt{display:block;text-align:center;padding:28px 24px;font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:2.8rem;color:#c9a84c;direction:rtl;line-height:2;}
.page-wrap{flex:1;background:transparent;display:flex;flex-direction:column;align-items:center;overflow-y:auto;min-height:0;position:relative;}
.verses{width:min(800px,70vw);padding:4vh 28px 60px;box-sizing:border-box;}`;

const Q_INDEX_INJECT = `
/* ─── v6 ─── */
nav{background:#0f2412;}
.list{flex:1;min-height:0;background:transparent;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{width:min(820px,70vw);padding-top:6vh;}
footer{background:#0f2412;}`;

const Q_INTRO_INJECT = `
/* ─── v6 ─── */
nav{background:#0f2412;}
main{flex:1;min-height:0;background:transparent;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.intro-c{width:min(820px,70vw);padding:28px 5% 36px;}
footer{background:#0f2412;}`;

for (const lang of langDirs) {
  const langPath = path.join(BASE_Q, lang);
  let n = 0;

  // suren
  const surenDir = path.join(langPath, 'suren');
  if (fs.existsSync(surenDir)) {
    for (const file of fs.readdirSync(surenDir).filter(f => f.endsWith('.html'))) {
      const fp = path.join(surenDir, file);
      let html = fs.readFileSync(fp, 'utf8');
      const orig = html;
      html = removePillars(html);
      html = html.replace(
        'background:#1a3a1e;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;}',
        `background:${Q_BG};min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;}`
      );
      html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
      html = inject(html, Q_SURA_INJECT);
      if (html !== orig) { fs.writeFileSync(fp, html, 'utf8'); n++; }
    }
  }

  // index.html
  const ixFp = path.join(langPath, 'index.html');
  if (fs.existsSync(ixFp)) {
    let html = fs.readFileSync(ixFp, 'utf8');
    html = removePillars(html);
    html = html.replace(
      'background:#1a3a1e;color:#f0e6c0;font-family:\'Noto Serif\',serif;min-height:100vh;display:flex;flex-direction:column;}',
      `background:${Q_BG};color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}`
    );
    html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
    html = inject(html, Q_INDEX_INJECT);
    fs.writeFileSync(ixFp, html, 'utf8'); n++;
  }

  // intro.html
  const inFp = path.join(langPath, 'intro.html');
  if (fs.existsSync(inFp)) {
    let html = fs.readFileSync(inFp, 'utf8');
    html = removePillars(html);
    html = html.replace(
      'background:#1a3a1e;color:#f0e6c0;font-family:\'Noto Serif\',serif;min-height:100vh;display:flex;flex-direction:column;}',
      `background:${Q_BG};color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}`
    );
    html = html.replace(/;-webkit-mask-image:[^;]+;mask-image:[^;]+;/g, ';');
    html = inject(html, Q_INTRO_INJECT);
    fs.writeFileSync(inFp, html, 'utf8'); n++;
  }

  if (n > 0) { console.log(`✓ AL-QURAN ${lang}: ${n}`); countQ += n; }
}

console.log(`\n✅ AL-QURAN: ${countQ} Dateien`);
console.log(`\n🎉 Total: ${countG + countQ} Dateien`);
