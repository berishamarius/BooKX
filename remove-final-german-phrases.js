const fs = require('fs');
const path = require('path');

// Complete German-to-native translation mappings
const translations = {
  'Französisch': {
    'Schlüsselformeln': 'Formules Clés',
    'Im Namen Allahs, des Allerbarmers, des Barmherzigen': 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
    'Alles Lob gebührt Allah': 'Toute louange appartient à Allah',
    'Gepriesen sei Allah': 'Gloire à Allah',
    'Allah ist le Plus Grand': 'Allah est le Plus Grand',
    'Allah ist der Plus Grand': 'Allah est le Plus Grand',
    'Es gibt keinen Gott außer Allah': 'Il n\'y a de dieu qu\'Allah'
  },
  'Spanisch': {
    'Schlüsselformeln': 'Fórmulas Clave',
    'Im Namen Allahs, des Allerbarmers, des Barmherzigen': 'En el nombre de Allah, el Clementísimo, el Misericordioso',
    'Alles Lob gebührt Allah': 'Toda alabanza pertenece a Allah',
    'Gepriesen sei Allah': 'Gloria a Allah',
    'Allah ist der Größte': 'Allah es el Más Grande',
    'Es gibt keinen Gott außer Allah': 'No hay más dios que Allah'
  },
  'Tagalog': {
    'Schlüsselformeln': 'Mga Pangunahing Pormula',
    'Im Namen Allahs, des Allerbarmers, des Barmherzigen': 'Sa ngalan ni Allah, ang Napakamaawain, ang Maawain',
    'Alles Lob gebührt Allah': 'Lahat ng papuri ay kay Allah',
    'Gepriesen sei Allah': 'Purihin si Allah',
    'Allah ist der Größte': 'Si Allah ang Pinakadakila',
    'Es gibt keinen Gott außer Allah': 'Walang ibang Diyos kundi si Allah'
  },
  'Kasachisch': {
    'Schlüsselformeln': 'Негізгі формулалар',
    'Im Namen Allahs, des Allerbarmers, des Barmherzigen': 'Аса Мейірімді, Мейірбан Алланың атымен',
    'Alles Lob gebührt Allah': 'Барлық мақтау Аллаға тиесілі',
    'Gepriesen sei Allah': 'Алла дәріптелсін',
    'Allah ist der Größte': 'Алла ұлы',
    'Es gibt keinen Gott außer Allah': 'Алладан басқа құдай жоқ'
  }
};

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

console.log('Removing remaining German phrases from all dictionaries...\n');

for (const lang of ['Französisch', 'Spanisch', 'Tagalog', 'Kasachisch']) {
  const dictPath = path.join(translationsDir, lang, 'woerterbuch.html');
  
  if (!fs.existsSync(dictPath)) {
    console.log(`⚠ ${lang}: Dictionary not found`);
    continue;
  }

  let content = fs.readFileSync(dictPath, 'utf8');
  const original = content;
  let changes = 0;

  const langTranslations = translations[lang];
  
  for (const [german, localized] of Object.entries(langTranslations)) {
    // Escape special regex characters
    const escapedGerman = german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Replace in entry-tr divs
    const entryRegex = new RegExp(`(<div class="entry-tr"[^>]*>)${escapedGerman}(<\\/div>)`, 'g');
    const entryMatches = content.match(entryRegex);
    if (entryMatches) {
      content = content.replace(entryRegex, `$1${localized}$2`);
      changes += entryMatches.length;
    }
    
    // Replace in cat-de spans
    const catRegex = new RegExp(`(<span class="cat-de">)${escapedGerman}(<\\/span>)`, 'g');
    const catMatches = content.match(catRegex);
    if (catMatches) {
      content = content.replace(catRegex, `$1${localized}$2`);
      changes += catMatches.length;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(dictPath, content, 'utf8');
    console.log(`✓ ${lang}: Removed ${changes} German phrases`);
  } else {
    console.log(`✓ ${lang}: No German phrases found`);
  }
}

console.log('\n✅ All German phrases removed from dictionaries!');
