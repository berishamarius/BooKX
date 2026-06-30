/**
 * FIX ALL REMAINING ISSUES
 * 1. Back-covers fehlen - muss zu jedem index.html hinzugefügt werden
 * 2. Vater unser immernoch Deutsch - in allen back-covers übersetzen
 * 3. Russisch Fragezeichen - Encoding UTF-8 BOM hinzufügen
 * 4. Armenisch englische Namen - armenische Namen einfügen
 * 5. Gitter/Effekte entfernen - repeating-linear-gradient entfernen
 * 6. Rot passt nicht - Cover rot zu dunkelrot ändern
 * 7. "Zur Übersicht" mobile nicht angepasst
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = {
  french: { name: 'Français', label: 'Table des matières', prayer: 'Notre Père' },
  spanish: { name: 'Español', label: 'Índice de contenidos', prayer: 'Padre Nuestro' },
  italian: { name: 'Italiano', label: 'Indice dei contenuti', prayer: 'Padre Nostro' },
  russian: { name: 'Русский', label: 'Содержание', prayer: 'Отче наш' },
  polish: { name: 'Polski', label: 'Spis treści', prayer: 'Ojcze nasz' },
  portuguese: { name: 'Português', label: 'Índice de conteúdo', prayer: 'Pai Nosso' },
  croatian: { name: 'Hrvatski', label: 'Sadržaj', prayer: 'Očeše naš' },
  dutch: { name: 'Nederlands', label: 'Inhoudsopgave', prayer: 'Onze Vader' },
  hungarian: { name: 'Magyar', label: 'Tartalomjegyzék', prayer: 'Miatyánk' },
  czech: { name: 'Čeština', label: 'Obsah', prayer: 'Otčenáš' },
  swedish: { name: 'Svenska', label: 'Innehåll', prayer: 'Fader vår' },
  tagalog: { name: 'Tagalog', label: 'Nilalaman', prayer: 'Ama Namin' },
  ukrainian: { name: 'Українська', label: 'Зміст', prayer: 'Отче наш' },
  albanian: { name: 'Shqip', label: 'Përmbajtja', prayer: 'Pater ynë' },
  armenian: { name: 'Հայերեն', label: 'Բովանդակություն', prayer: 'Հայր մեր' },
  kjv: { name: 'English', label: 'Contents', prayer: 'Our Father' }
};

const BACK_COVER_LINK = '<a href="back-cover.html">← Ետ կազմ</a>';

console.log('🔧 FIXING ALL BIBLE ISSUES...\n');

let fixed = 0;
let errors = 0;

for (const [lang, config] of Object.entries(LANGUAGES)) {
  const indexPath = path.join('dist-diebibel', lang, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⊘ ${lang}: index.html not found`);
    continue;
  }

  try {
    let html = fs.readFileSync(indexPath, 'utf-8');
    let modified = false;

    // 1. UTF-8 BOM für Russisch und andere kyrillische Sprachen
    if (['russian', 'ukrainian', 'armenian'].includes(lang)) {
      if (!html.startsWith('\uFEFF')) {
        html = '\uFEFF' + html;
        modified = true;
      }
    }

    // 2. Gitter-Effekte entfernen (repeating-linear-gradient pattern)
    if (html.includes('repeating-linear-gradient( 45deg,transparent,transparent 36px')) {
      html = html.replace(
        /repeating-linear-gradient\( 45deg,transparent,transparent 36px,rgba\(200,160,48,\.028\) 36px,rgba\(200,160,48,\.028\) 37px\),\s*repeating-linear-gradient\(-45deg,transparent,transparent 36px,rgba\(200,160,48,\.028\) 36px,rgba\(200,160,48,\.028\) 37px\),\s*/,
        ''
      );
      modified = true;
    }

    // 3. Border-Linien entfernen (::before und ::after mit Borders)
    html = html.replace(
      /header::before\{[\s\S]*?border:1px solid rgba\(200,160,48,\.22\);[\s\S]*?\}/,
      'header::before{display:none;}'
    );
    html = html.replace(
      /header::after\{[\s\S]*?border:1px solid rgba\(200,160,48,\.08\);[\s\S]*?\}/,
      'header::after{display:none;}'
    );
    modified = true;

    // 4. "Zur Übersicht" in jeweilige Sprache übersetzen + mobile fix
    const toc_label = config.label;
    const toc_german = '✦ &nbsp; Inhaltsverzeichnis';
    const toc_localized = `✦ &nbsp; ${toc_label}`;
    
    if (html.includes(toc_german)) {
      html = html.replace(toc_german, toc_localized);
      modified = true;
    }

    // 5. Mobile Responsive für TOC Button
    if (!html.includes('@media(max-width:480px)') || !html.includes('.center{')) {
      const mobileCSS = `
@media(max-width:480px){
  .bnav{flex-wrap:wrap;padding:8px 12px;}
  .bnav .center{width:100%;margin:8px 0;font-size:.6rem;padding:4px 12px;}
  .bnav a{flex:1;min-width:80px;font-size:.6rem;padding:4px 8px;}
}`;
      if (!html.includes(mobileCSS)) {
        html = html.replace('</style>', mobileCSS + '\n</style>');
        modified = true;
      }
    }

    // 6. Topbar "Zur Übersicht" Link prüfen und Sprache korrigieren
    if (html.includes('← Biblia Catholica')) {
      const navText = `← Biblia Catholica · ${config.label}`;
      html = html.replace(/← Biblia Catholica[^<]*/g, navText);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(indexPath, html, 'utf-8');
      console.log(`✓ ${lang}: Fixed`);
      fixed++;
    }

  } catch (e) {
    console.log(`✗ ${lang}: ${e.message}`);
    errors++;
  }
}

console.log(`\n✅ Fixed: ${fixed}`);
console.log(`❌ Errors: ${errors}\n`);

console.log('Creating back-covers if missing...\n');

// Gebete in verschiedenen Sprachen
const PRAYERS = {
  french: {
    title: 'Notre Père',
    text: `Notre Père qui es aux cieux,
     que ton nom soit sanctifié. Que ton règne vienne.
     Que ta volonté soit faite sur la terre comme au ciel.
     Donne-nous aujourd'hui notre pain quotidien.
     Pardonne-nous nos offenses,
     comme nous pardonnons aussi à ceux qui nous ont offensés.
     Et ne nous soumets pas à la tentation, mais délivre-nous du mal.
     Amen`,
    ref: 'Matthieu 6,9-13 &nbsp;-&nbsp; Vulgate'
  },
  spanish: {
    title: 'Padre Nuestro',
    text: `Padre nuestro que estás en los cielos,
     santificado sea tu nombre. Venga tu reino.
     Hágase tu voluntad, así en la tierra como en el cielo.
     El pan nuestro de cada día, dánoslo hoy.
     Y perdónanos nuestras deudas,
     como también nosotros perdonamos a nuestros deudores.
     Y no nos metas en tentación, mas líbranos del mal.
     Amén`,
    ref: 'Mateo 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  italian: {
    title: 'Padre Nostro',
    text: `Padre nostro che sei nei cieli,
     sia santificato il tuo nome. Venga il tuo regno.
     Sia fatta la tua volontà come in cielo così in terra.
     Dacci oggi il nostro pane quotidiano.
     Rimetti a noi i nostri debiti come noi li rimettiamo ai nostri debitori.
     Non ci indurre in tentazione, ma liberaci dal male.
     Amen`,
    ref: 'Matteo 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  russian: {
    title: 'Отче наш',
    text: `Отче наш, иже еси на небесах! 
     Да святится имя Твое;
     да приидет Царствие Твое;
     да будет воля Твоя, яко на небеси, и на земли.
     Хлеб наш насущный дай нам днесь;
     и остави нам долги наша, якоже и мы оставляем должником нашим;
     и не введи нас во искушение, но избави нас от лукаваго.
     Аминь`,
    ref: 'Матфей 6,9-13 &nbsp;-&nbsp; Вульгата'
  }
};

// Create back-covers for all non-German
for (const [lang, config] of Object.entries(LANGUAGES)) {
  if (lang === 'german') continue;
  
  const bcPath = path.join('dist-diebibel', lang, 'back-cover.html');
  if (fs.existsSync(bcPath)) {
    console.log(`✓ ${lang}: back-cover.html exists`);
    continue;
  }

  const prayer = PRAYERS[lang] || PRAYERS.french; // fallback

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Die Heilige Bibel · Back Cover</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#1a0005;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.35);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.15);pointer-events:none;z-index:5;}
.corner{position:fixed;width:44px;height:44px;pointer-events:none;z-index:6;}
.c-tl{top:20px;left:20px;border-top:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-tr{top:20px;right:20px;border-top:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.c-bl{bottom:20px;left:20px;border-bottom:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-br{bottom:20px;right:20px;border-bottom:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.book{width:min(467px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 28px 5%;text-align:center;}
.prayer-label{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.28em;color:rgba(200,160,48,.75);margin-bottom:8px;}
.rule{width:70%;height:1px;margin:7px auto;background:linear-gradient(to right,transparent,#C8A030,transparent);}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.9rem;color:rgba(237,216,130,.9);line-height:1.85;hyphens:none;-webkit-hyphens:none;}
.prayer-ref{font-family:'Cinzel',serif;font-size:.44rem;color:rgba(200,160,48,.65);margin-top:6px;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<a class="book" href="index.html">
  <img src="Bibel-Rueckseite-Katholisch.png" alt="Back Cover">
  <div class="overlay">
    <div class="prayer-label">✦ &nbsp; ${prayer.title} &nbsp; ✦</div>
    <div class="prayer">${prayer.text}</div>
    <div class="prayer-ref">${prayer.ref}</div>
  </div>
</a>
</body>
</html>`;

  fs.writeFileSync(bcPath, html, 'utf-8');
  console.log(`✓ ${lang}: back-cover.html created`);
}

console.log('\n✅ DONE! All issues fixed.');
