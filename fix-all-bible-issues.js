const fs = require('fs');
const path = require('path');

// Language-specific translations
const translations = {
  kjv: { backToLanguages: '← All Languages', tableOfContents: '☧  Table of Contents', backCoverTitle: 'Our Father', lang: 'en' },
  german: { backToLanguages: '← Alle Sprachen', tableOfContents: '☧  Inhaltsverzeichnis', backCoverTitle: 'Vater unser', lang: 'de' },
  french: { backToLanguages: '← Toutes les langues', tableOfContents: '☧  Table des matières', backCoverTitle: 'Notre Père', lang: 'fr' },
  spanish: { backToLanguages: '← Todos los idiomas', tableOfContents: '☧  Tabla de contenido', backCoverTitle: 'Padre Nuestro', lang: 'es' },
  portuguese: { backToLanguages: '← Todos os idiomas', tableOfContents: '☧  Índice', backCoverTitle: 'Pai Nosso', lang: 'pt' },
  polish: { backToLanguages: '← Wszystkie języki', tableOfContents: '☧  Spis treści', backCoverTitle: 'Ojcze Nasz', lang: 'pl' },
  russian: { backToLanguages: '← Все языки', tableOfContents: '☧  Содержание', backCoverTitle: 'Отче наш', lang: 'ru' },
  croatian: { backToLanguages: '← Svi jezici', tableOfContents: '☧  Sadržaj', backCoverTitle: 'Oče naš', lang: 'hr' },
  dutch: { backToLanguages: '← Alle talen', tableOfContents: '☧  Inhoudsopgave', backCoverTitle: 'Onze Vader', lang: 'nl' },
  hungarian: { backToLanguages: '← Minden nyelv', tableOfContents: '☧  Tartalomjegyzék', backCoverTitle: 'Miatyánk', lang: 'hu' },
  czech: { backToLanguages: '← Všechny jazyky', tableOfContents: '☧  Obsah', backCoverTitle: 'Otče náš', lang: 'cs' },
  swedish: { backToLanguages: '← Alla språk', tableOfContents: '☧  Innehållsförteckning', backCoverTitle: 'Fader vår', lang: 'sv' },
  tagalog: { backToLanguages: '← Lahat ng wika', tableOfContents: '☧  Talaan ng Nilalaman', backCoverTitle: 'Ama Namin', lang: 'tl' },
  ukrainian: { backToLanguages: '← Всі мови', tableOfContents: '☧  Зміст', backCoverTitle: 'Отче наш', lang: 'uk' },
  albanian: { backToLanguages: '← Të gjitha gjuhët', tableOfContents: '☧  Përmbajtja', backCoverTitle: 'Ati Ynë', lang: 'sq' },
  italian: { backToLanguages: '← Tutte le lingue', tableOfContents: '☧  Indice', backCoverTitle: 'Padre Nostro', lang: 'it' },
  armenian: { backToLanguages: '← Բոլոր լեզուները', tableOfContents: '☧  Բովանդակություն', backCoverTitle: 'Հայր Մեր', lang: 'hy' }
};

const baseDir = 'dist-diebibel';
let totalChanges = 0;

// 1. Remove donation link from main cover.html
console.log('1. Removing donation link from cover.html...');
const coverPath = path.join(baseDir, 'cover.html');
if (fs.existsSync(coverPath)) {
  let coverHtml = fs.readFileSync(coverPath, 'utf8');
  
  // Remove footer-bar with donation content
  const footerRemoved = coverHtml.replace(
    /<div class="footer-bar">\s*<\/div>/,
    ''
  );
  
  if (footerRemoved !== coverHtml) {
    fs.writeFileSync(coverPath, footerRemoved, 'utf8');
    console.log('   ✓ Removed footer-bar from cover.html');
    totalChanges++;
  }
}

// 2. Add scroll cover elements to main cover
console.log('2. Adding scroll cover elements to main cover...');
if (fs.existsSync(coverPath)) {
  let coverHtml = fs.readFileSync(coverPath, 'utf8');
  
  // Add top and bottom cover bars
  if (!coverHtml.includes('scroll-cover-top')) {
    const scrollCovers = `
<div class="scroll-cover-top"></div>
<div class="scroll-cover-bottom"></div>
<style>
.scroll-cover-top,.scroll-cover-bottom{position:fixed;left:0;right:0;height:60px;background:#2a0810;z-index:99;pointer-events:none;}
.scroll-cover-top{top:0;box-shadow:0 2px 8px rgba(0,0,0,.3);}
.scroll-cover-bottom{bottom:0;box-shadow:0 -2px 8px rgba(0,0,0,.3);}
header{position:sticky;top:0;z-index:100;}
.footer-bar{position:sticky;bottom:0;z-index:100;}
</style>`;
    
    const withCovers = coverHtml.replace('</body>', scrollCovers + '\n</body>');
    fs.writeFileSync(coverPath, withCovers, 'utf8');
    console.log('   ✓ Added scroll cover bars');
    totalChanges++;
  }
}

// 3. Fix all language indexes
console.log('3. Fixing language indexes...');
for (const [lang, trans] of Object.entries(translations)) {
  const indexPath = path.join(baseDir, lang, 'index.html');
  if (!fs.existsSync(indexPath)) continue;
  
  let html = fs.readFileSync(indexPath, 'utf8');
  const original = html;
  
  // Fix "Alle Sprachen" hardcoded text
  html = html.replace(
    /← Biblia Catholica · Alle Sprachen<\/a>/g,
    `${trans.backToLanguages}</a>`
  );
  
  // Fix Italian index - has wrong design
  if (lang === 'italian') {
    // Check if it has the wrong design (simple top-nav)
    if (html.includes('class="top-nav"')) {
      console.log('   → Fixing Italian index design...');
      
      // Replace with proper design matching other languages
      html = html.replace(
        /<nav class="top-nav"><a href="\.\.\/\.\.\/index\.html">.*?<\/a><\/nav>/,
        `<nav class="topbar">
  <a href="../../index.html">${trans.backToLanguages}</a>
</nav>`
      );
      
      // Fix header structure if needed
      if (html.includes('class="h-flag"')) {
        html = html.replace(
          /<header>\s*<div class="h-flag">.*?<\/header>/s,
          `<header>
  <div class="h-orn">✦ &nbsp; &#10023; &nbsp; ✦</div>
  <h1 class="htitle">BIBLIA CATHOLICA</h1>
  <div class="h-rule-full"></div>
  <div class="h-sub">SCRIPTURA SACRA</div>
  <div class="hlang">Italiano · Italien</div>
  <div class="h-orn-bot">✦ &nbsp; &#10023; &nbsp; ✦</div>
</header>`
        );
      }
    }
  }
  
  // Fix Russian encoding issues in title
  if (lang === 'russian') {
    html = html.replace(
      /<title>Biblia Catholica &middot; \?+<\/title>/,
      `<title>Biblia Catholica · Русский</title>`
    );
  }
  
  if (html !== original) {
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`   ✓ Fixed ${lang}/index.html`);
    totalChanges++;
  }
}

// 4. Fix all back-cover.html files
console.log('4. Fixing back-cover files...');
for (const [lang, trans] of Object.entries(translations)) {
  const backCoverPath = path.join(baseDir, lang, 'back-cover.html');
  if (!fs.existsSync(backCoverPath)) continue;
  
  let html = fs.readFileSync(backCoverPath, 'utf8');
  const original = html;
  
  // Fix title - remove "Rückseite" hardcoded
  html = html.replace(
    /<title>.*? ï¿½ Biblia Catholica ï¿½ Rückseite<\/title>/,
    `<title>${trans.backCoverTitle} · Biblia Catholica</title>`
  );
  
  // Fix prayer label - replace "Vater unser" with language-specific
  html = html.replace(
    /<div class="prayer-label">✦ &nbsp; Vater unser &nbsp; ✦<\/div>/,
    `<div class="prayer-label">✦ &nbsp; ${trans.backCoverTitle} &nbsp; ✦</div>`
  );
  
  // Fix lang attribute
  html = html.replace(
    /<html lang="de">/,
    `<html lang="${trans.lang}">`
  );
  html = html.replace(
    /<html lang="fr">/,
    `<html lang="${trans.lang}">`
  );
  html = html.replace(
    /<html lang="la">/,
    `<html lang="${trans.lang}">`
  );
  
  if (html !== original) {
    fs.writeFileSync(backCoverPath, html, 'utf8');
    console.log(`   ✓ Fixed ${lang}/back-cover.html`);
    totalChanges++;
  }
}

// 5. Fix all book files (bücher/*.html)
console.log('5. Fixing book navigation buttons...');
for (const [lang, trans] of Object.entries(translations)) {
  const bucherDir = path.join(baseDir, lang, 'bücher');
  if (!fs.existsSync(bucherDir)) continue;
  
  const files = fs.readdirSync(bucherDir).filter(f => f.endsWith('.html'));
  let langChanges = 0;
  
  for (const file of files) {
    const filePath = path.join(bucherDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    
    // Fix "Inhaltsverzeichnis" button - replace German with language-specific
    html = html.replace(
      /<a href="\.\.\/index\.html" class="center">\? &nbsp; Inhaltsverzeichnis<\/a>/g,
      `<a href="../index.html" class="center">${trans.tableOfContents}</a>`
    );
    
    if (html !== original) {
      fs.writeFileSync(filePath, html, 'utf8');
      langChanges++;
    }
  }
  
  if (langChanges > 0) {
    console.log(`   ✓ Fixed ${langChanges} files in ${lang}/bücher/`);
    totalChanges += langChanges;
  }
}

console.log(`\n✅ DONE! Total changes: ${totalChanges}`);
