const fs = require('fs');
const path = require('path');

const navTranslations = {
  'Französisch': {
    'Zur Sure-Übersicht': 'Vers la liste des sourates',
    'Alle Sprachen': 'Toutes les langues',
    'Ergebnisse': 'Résultats',
    'Einträge': 'Entrées'
  },
  'Spanisch': {
    'Zur Sure-Übersicht': 'A la lista de suras',
    'Alle Sprachen': 'Todos los idiomas',
    'Ergebnisse': 'Resultados',
    'Einträge': 'Entradas'
  },
  'Tagalog': {
    'Zur Sure-Übersicht': 'Sa listahan ng mga sura',
    'Alle Sprachen': 'Lahat ng wika',
    'Ergebnisse': 'Mga Resulta',
    'Einträge': 'Mga Entry'
  },
  'Kasachisch': {
    'Zur Sure-Übersicht': 'Сүрелер тізіміне',
    'Alle Sprachen': 'Барлық тілдер',
    'Ergebnisse': 'Нәтижелер',
    'Einträge': 'Жазбалар'
  }
};

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

console.log('Fixing navigation and JavaScript in dictionaries...\n');

for (const [lang, trans] of Object.entries(navTranslations)) {
  const dictPath = path.join(translationsDir, lang, 'woerterbuch.html');
  
  if (!fs.existsSync(dictPath)) {
    console.log(`⚠ ${lang}: Dictionary not found`);
    continue;
  }

  let content = fs.readFileSync(dictPath, 'utf8');
  const original = content;

  // Fix navigation links
  content = content.replace(
    /<a class="bn" href="index\.html">← Zur Sure-Übersicht<\/a>/g,
    `<a class="bn" href="index.html">← ${trans['Zur Sure-Übersicht']}</a>`
  );

  content = content.replace(
    /<a class="bn" href="\.\.\/\.\.\/cover\.html">Alle Sprachen →<\/a>/g,
    `<a class="bn" href="../../cover.html">${trans['Alle Sprachen']} →</a>`
  );

  // Fix JavaScript counter text
  content = content.replace(
    /vis \+ ' Ergebnisse'/g,
    `vis + ' ${trans['Ergebnisse']}'`
  );

  content = content.replace(
    /entries\.length \+ ' Einträge'/g,
    `entries.length + ' ${trans['Einträge']}'`
  );

  if (content !== original) {
    fs.writeFileSync(dictPath, content, 'utf8');
    console.log(`✓ ${lang}: Fixed navigation and JavaScript`);
  } else {
    console.log(`✓ ${lang}: Already fixed`);
  }
}

console.log('\n✅ All navigation and JavaScript fixed!');
