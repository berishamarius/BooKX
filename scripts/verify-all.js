const fs = require('fs');
const p = require('path');

const base = p.join('dist-alquran', 'Übersetzungen');
const langs = fs.readdirSync(base).filter(d => fs.statSync(p.join(base,d)).isDirectory());

console.log('\n=== QURAN: Übersetzungen (erste Sure, erste Übersetzungszeile) ===');
langs.forEach(l => {
  const sd = p.join(base, l, 'suren');
  if (!fs.existsSync(sd)) { console.log(`${l}: KEIN suren/`); return; }
  const files = fs.readdirSync(sd).filter(f => f.endsWith('.html')).sort();
  if (!files.length) { console.log(`${l}: LEER`); return; }
  const c = fs.readFileSync(p.join(sd, files[0]), 'utf8');
  const m = c.match(/class="tr">([^<]{4,100})</);
  console.log(`${l}: ${m ? m[1].trim() : 'NICHT GEFUNDEN'}`);
});

console.log('\n=== QURAN: Wörterbücher (erste 3 arabische Wörter) ===');
langs.forEach(l => {
  const wf = p.join(base, l, 'woerterbuch.html');
  if (!fs.existsSync(wf)) { console.log(`${l}: KEIN woerterbuch.html`); return; }
  const c = fs.readFileSync(wf, 'utf8');
  const words = [...c.matchAll(/class="word-ar">([^<]+)</g)].slice(0,3).map(m=>m[1].trim());
  console.log(`${l}: ${words.join(' | ')}`);
});

console.log('\n=== QURAN: Dict-Icon in Suren (sollte 0 sein) ===');
let dictCount = 0;
langs.forEach(l => {
  const sd = p.join(base, l, 'suren');
  if (!fs.existsSync(sd)) return;
  fs.readdirSync(sd).filter(f=>f.endsWith('.html')).forEach(f => {
    const c = fs.readFileSync(p.join(sd, f), 'utf8');
    if (c.includes('dict-icon-btn')) dictCount++;
  });
});
console.log(`dict-icon-btn in Suren: ${dictCount} (erwartet: 0)`);

console.log('\n=== BIBEL: Sprachen und Cover-Links ===');
const bBase = 'dist-diebibel';
const coverContent = fs.readFileSync(p.join(bBase, 'cover.html'), 'utf8');
const bTiles = [...coverContent.matchAll(/href="([^"]+)"[^>]*>[^<]*<[^>]+>[^<]*<img[^>]+alt="([^"]+)"/g)];
bTiles.forEach(m => console.log(`Bibel: ${m[2]} → ${m[1]} (existiert: ${fs.existsSync(p.join(bBase, m[1]))})`));

console.log('\n=== PAYPAL Button vorhanden? ===');
const qCover = fs.readFileSync('dist-alquran/cover.html','utf8');
const bCover = fs.readFileSync('dist-diebibel/cover.html','utf8');
console.log(`Quran cover PayPal: ${qCover.includes('paypal-btn')}`);
console.log(`Bibel cover PayPal: ${bCover.includes('paypal-btn')}`);

console.log('\n=== GRID: 2-spaltig? ===');
console.log(`Quran grid 2-col: ${qCover.includes('repeat(2')}`);
console.log(`Bibel grid 2-col: ${bCover.includes('repeat(2')}`);

console.log('\nFertig.');
