const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

// ── 1. PayPal button + mobile CSS for QURAN cover ────────────────────────────
const quranCoverPath = path.join(BASE, 'dist-alquran', 'cover.html');
let qc = fs.readFileSync(quranCoverPath, 'utf8');

// Fix mobile grid
qc = qc.replace(
  '.grid{display:grid;grid-template-columns:repeat(2,220px);justify-content:center;gap:28px;padding:24px 28px 80px;max-width:520px;margin:0 auto;position:relative;z-index:1;}',
  '.grid{display:grid;grid-template-columns:repeat(2,minmax(0,220px));justify-content:center;gap:20px;padding:24px 20px 80px;max-width:520px;margin:0 auto;position:relative;z-index:1;}@media(max-width:480px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:16px 12px 80px;}}'
);

// Fix tile width for mobile
qc = qc.replace(
  '.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:220px;transition:transform .2s;}',
  '.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:100%;transition:transform .2s;}'
);

// Add PayPal button style + element
const paypalStyleQuran = `
<style id="paypal-btn-style">
.paypal-btn{position:fixed;top:18px;right:18px;z-index:20;background:rgba(15,47,26,.88);border:1px solid rgba(201,168,76,.4);border-radius:10px;padding:8px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;color:#c9a84c;font-family:'Noto Serif',Georgia,serif;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;transition:background .2s,border-color .2s;backdrop-filter:blur(6px);}
.paypal-btn:hover{background:rgba(192,155,60,.12);border-color:#c9a84c;}
.paypal-btn svg{width:18px;height:18px;flex-shrink:0;}
@media(max-width:400px){.paypal-btn span{display:none;}.paypal-btn{padding:8px;}}
</style>`;

const paypalBtnQuran = `<button class="paypal-btn" onclick="alert('Später verfügbar')" title="Spenden – Später verfügbar">
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
  <span>Spenden</span>
</button>`;

qc = qc.replace('</head><body>', `${paypalStyleQuran}\n</head><body>\n${paypalBtnQuran}\n`);

fs.writeFileSync(quranCoverPath, qc, 'utf8');
console.log('✅ Quran cover.html updated');

// ── 2. PayPal button + mobile CSS for BIBLE cover ─────────────────────────────
const bibleCoverPath = path.join(BASE, 'dist-diebibel', 'cover.html');
let bc = fs.readFileSync(bibleCoverPath, 'utf8');

// Fix mobile grid
bc = bc.replace(
  '.grid{display:grid;grid-template-columns:repeat(2,210px);justify-content:center;gap:28px;padding:24px 28px 80px;max-width:500px;margin:0 auto;position:relative;z-index:1;}',
  '.grid{display:grid;grid-template-columns:repeat(2,minmax(0,210px));justify-content:center;gap:20px;padding:24px 20px 80px;max-width:500px;margin:0 auto;position:relative;z-index:1;}@media(max-width:460px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:16px 12px 80px;}}'
);

// Fix tile width for mobile
bc = bc.replace(
  '.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:210px;transition:transform .2s;}',
  '.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:100%;transition:transform .2s;}'
);

const paypalStyleBible = `
<style id="paypal-btn-style">
.paypal-btn{position:fixed;top:18px;right:18px;z-index:20;background:rgba(26,5,8,.88);border:1px solid rgba(200,160,48,.4);border-radius:10px;padding:8px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;color:#C8A030;font-family:'EB Garamond',Georgia,serif;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;transition:background .2s,border-color .2s;backdrop-filter:blur(6px);}
.paypal-btn:hover{background:rgba(200,160,48,.1);border-color:#C8A030;}
.paypal-btn svg{width:18px;height:18px;flex-shrink:0;}
@media(max-width:400px){.paypal-btn span{display:none;}.paypal-btn{padding:8px;}}
</style>`;

const paypalBtnBible = `<button class="paypal-btn" onclick="alert('Später verfügbar')" title="Spenden – Später verfügbar">
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
  <span>Spenden</span>
</button>`;

bc = bc.replace('</head><body>', `${paypalStyleBible}\n</head><body>\n${paypalBtnBible}\n`);

fs.writeFileSync(bibleCoverPath, bc, 'utf8');
console.log('✅ Bible cover.html updated');

// ── 3. Remove dict-icon-btn from ALL sura files ───────────────────────────────
const quranTransDir = path.join(BASE, 'dist-alquran', 'Übersetzungen');
const langs = fs.readdirSync(quranTransDir).filter(d =>
  fs.statSync(path.join(quranTransDir, d)).isDirectory()
);

let totalFixed = 0;

for (const lang of langs) {
  const surenDir = path.join(quranTransDir, lang, 'suren');
  if (!fs.existsSync(surenDir)) continue;

  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const fp = path.join(surenDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let changed = false;

    // Remove <style id="dict-icon-style">...</style>
    if (html.includes('id="dict-icon-style"')) {
      html = html.replace(/<style id="dict-icon-style">[\s\S]*?<\/style>\n?/g, '');
      changed = true;
    }

    // Remove <a id="dict-icon-btn" ...>...</a>
    if (html.includes('id="dict-icon-btn"')) {
      html = html.replace(/<a id="dict-icon-btn"[\s\S]*?<\/a>\n?/g, '');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(fp, html, 'utf8');
      totalFixed++;
    }
  }
  console.log(`  ✓ ${lang}: cleaned`);
}

console.log(`\n✅ Dict-icon removed from ${totalFixed} sura files`);
console.log('\nAll done!');
