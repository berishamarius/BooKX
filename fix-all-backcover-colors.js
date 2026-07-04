const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist-alquran', 'Übersetzungen');

// Alle Sprachen (außer Deutsch als Referenz)
const languages = [
  'Albanisch', 'Bengalisch', 'Bosnisch', 'Chinesisch', 'Englisch',
  'Französisch', 'Hausa', 'Hindi', 'Indonesisch', 'Kasachisch',
  'Persisch', 'Russisch', 'Spanisch', 'Tagalog', 'Thailändisch',
  'Türkisch', 'Urdu', 'Uygurisch'
];

console.log('🎨 Korrigiere Back-Cover Farben für alle Sprachen...\n');

let fixed = 0;
let alreadyOk = 0;

for (const lang of languages) {
  const backCoverPath = path.join(DIST, lang, 'back-cover.html');
  
  if (!fs.existsSync(backCoverPath)) {
    console.log(`  ⚠️  ${lang}: back-cover.html nicht gefunden`);
    continue;
  }
  
  let html = fs.readFileSync(backCoverPath, 'utf-8');
  const original = html;
  
  // 1. Background von #0f2f1a zu #0b2414 (wie im deutschen + cover)
  html = html.replace(
    /background:#0f2f1a;/g,
    'background:#0b2414;'
  );
  
  // 2. Alle Farben rgba(201,168,76,...) zu rgba(192,155,60,...)
  html = html.replace(/rgba\(201,168,76,/g, 'rgba(192,155,60,');
  
  // 3. Alle rgba(212,165,116,...) auch zu rgba(192,155,60,...)
  html = html.replace(/rgba\(212,165,116,/g, 'rgba(192,155,60,');
  
  // 4. Alle rgba(230,214,178,...) zu rgba(201,168,76,...) für sekundäre Elemente
  html = html.replace(/rgba\(230,214,178,/g, 'rgba(201,168,76,');
  
  // 5. Background-Pattern muss #0f2f1a haben und rgba(192,155,60,0.48)
  html = html.replace(
    /background:(#[a-f0-9]{6})?\s*url\("data:image\/svg\+xml[^"]+"\)/g,
    (match) => {
      // Extrahiere das SVG
      const svgMatch = match.match(/url\("(data:image\/svg\+xml[^"]+)"\)/);
      if (svgMatch) {
        const svg = svgMatch[1];
        // Decode und korrigiere Farbe im SVG
        const decoded = Buffer.from(svg.split(',')[1], 'base64').toString('utf-8');
        const fixed = decoded.replace(/rgba\([^)]+\)/g, 'rgba(192,155,60,0.48)');
        const encoded = 'data:image/svg+xml;base64,' + Buffer.from(fixed).toString('base64');
        return `background:#0f2f1a url("${encoded}")`;
      }
      return match;
    }
  );
  
  // 6. Border-Farben für top/bottom bars
  html = html.replace(
    /border-(bottom|top):1px solid rgba\([^)]+\);/g,
    'border-$1:1px solid rgba(192,155,60,.28);'
  );
  
  // 7. Gradient in .rule sollte #c9a84c sein
  html = html.replace(
    /background:linear-gradient\(to right,transparent,rgba\([^)]+\),transparent\);/g,
    'background:linear-gradient(to right,transparent,#c9a84c,transparent);'
  );
  
  if (html !== original) {
    fs.writeFileSync(backCoverPath, html, 'utf-8');
    console.log(`  ✅ ${lang}: Farben korrigiert`);
    fixed++;
  } else {
    console.log(`  ✓  ${lang}: bereits korrekt`);
    alreadyOk++;
  }
}

console.log(`\n✅ Fertig! ${fixed} korrigiert, ${alreadyOk} bereits ok`);
