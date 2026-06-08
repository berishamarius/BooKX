const fs = require('fs');
const path = require('path');

// Bible language translations for Navigation
const BIBLE_NAV = {
  syriac: { intro: 'Preface', back: 'Back Cover →', forward: '← Preface' },
  armenian: { intro: 'Preface', back: 'Back Cover →', forward: '← Preface' },
};

const BIBLE_LANGS = {
  syriac: 'Syriac Peshitta',
  armenian: 'Armenian Apostolic',
};

let total = 0;

// Fix Bible index.html
for (const [langCode, langName] of Object.entries(BIBLE_LANGS)) {
  const indexPath = `CATHOLIC-BIBLE/Übersetzungen/${langCode}/index.html`;
  if (!fs.existsSync(indexPath)) continue;
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove copyright/footer/disclaimer
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div class="pl">[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  // Fix navigation if exists
  html = html.replace(`<a href="back-cover.html">Rückseite →</a>`, `<a href="back-cover.html">${BIBLE_NAV[langCode].back}</a>`);
  html = html.replace(`<a href="intro.html">← Vorwort</a>`, `<a href="intro.html">← ${BIBLE_NAV[langCode].intro}</a>`);
  
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✓ ${langCode} index.html`);
  total++;
}

// Fix intro.html
for (const [langCode, langName] of Object.entries(BIBLE_LANGS)) {
  const introPath = `CATHOLIC-BIBLE/Übersetzungen/${langCode}/intro.html`;
  if (!fs.existsSync(introPath)) continue;
  
  let html = fs.readFileSync(introPath, 'utf8');
  
  // Remove copyright/footer/disclaimer
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  // Fix navigation
  html = html.replace(`<a href="back-cover.html">Rückseite →</a>`, `<a href="back-cover.html">${BIBLE_NAV[langCode].back}</a>`);
  
  fs.writeFileSync(introPath, html, 'utf8');
  console.log(`✓ ${langCode} intro.html`);
  total++;
}

// Fix back-cover.html
for (const [langCode, langName] of Object.entries(BIBLE_LANGS)) {
  const bcPath = `CATHOLIC-BIBLE/Übersetzungen/${langCode}/back-cover.html`;
  if (!fs.existsSync(bcPath)) continue;
  
  let html = fs.readFileSync(bcPath, 'utf8');
  
  // Remove copyright/footer/disclaimer
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  html = html.replace(/<div class="pl">[\s\S]*?<\/div>/g, '');
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  // Fix navigation
  html = html.replace(`<a href="intro.html">← Vorwort</a>`, `<a href="intro.html">← ${BIBLE_NAV[langCode].intro}</a>`);
  
  fs.writeFileSync(bcPath, html, 'utf8');
  console.log(`✓ ${langCode} back-cover.html`);
  total++;
}

console.log(`\n✅ ${total} Bible files fixed`);
