/**
 * TRANSLATE BOOK NAMES TO NATIVE LANGUAGES
 * Replace English book names with proper translations
 */

const fs = require('fs');
const path = require('path');

// Book name translations for each language
const TRANSLATIONS = {
  italian: {
    'Genesis': 'Genesi', 'Exodus': 'Esodo', 'Leviticus': 'Levitico', 'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronomio',
    'Joshua': 'Giosuè', 'Judges': 'Giudici', 'Ruth': 'Rut', '1 Samuel': '1 Samuele', '2 Samuel': '2 Samuele',
    '1 Kings': '1 Re', '2 Kings': '2 Re', '1 Chronicles': '1 Cronache', '2 Chronicles': '2 Cronache',
    'Ezra': 'Esdra', 'Nehemiah': 'Neemia', 'Esther': 'Ester', 'Job': 'Giobbe', 'Psalms': 'Salmi', 'Proverbs': 'Proverbi',
    'Ecclesiastes': 'Ecclesiaste', 'Song of Solomon': 'Cantico', 'Isaiah': 'Isaia', 'Jeremiah': 'Geremia',
    'Lamentations': 'Lamentazioni', 'Ezekiel': 'Ezechiele', 'Daniel': 'Daniele',
    'Hosea': 'Osea', 'Joel': 'Gioele', 'Amos': 'Amos', 'Obadiah': 'Abdia', 'Jonah': 'Giona', 'Micah': 'Michea',
    'Nahum': 'Nahum', 'Habakkuk': 'Abacuc', 'Zephaniah': 'Sofonia', 'Haggai': 'Aggeo', 'Zechariah': 'Zaccaria', 'Malachi': 'Malachia',
    'Matthew': 'Matteo', 'Mark': 'Marco', 'Luke': 'Luca', 'John': 'Giovanni', 'Acts': 'Atti',
    'Romans': 'Romani', '1 Corinthians': '1 Corinzi', '2 Corinthians': '2 Corinzi', 'Galatians': 'Galati', 'Ephesians': 'Efesini',
    'Philippians': 'Filippesi', 'Colossians': 'Colossesi', '1 Thessalonians': '1 Tessalonicesi', '2 Thessalonians': '2 Tessalonicesi',
    '1 Timothy': '1 Timoteo', '2 Timothy': '2 Timoteo', 'Titus': 'Tito', 'Philemon': 'Filemone',
    'Hebrews': 'Ebrei', 'James': 'Giacomo', '1 Peter': '1 Pietro', '2 Peter': '2 Pietro',
    '1 John': '1 Giovanni', '2 John': '2 Giovanni', '3 John': '3 Giovanni', 'Jude': 'Giuda', 'Revelation': 'Apocalisse'
  },
  french: {
    'Genesis': 'Genèse', 'Exodus': 'Exode', 'Leviticus': 'Lévitique', 'Numbers': 'Nombres', 'Deuteronomy': 'Deutéronome',
    'Joshua': 'Josué', 'Judges': 'Juges', 'Ruth': 'Ruth', '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel',
    '1 Kings': '1 Rois', '2 Kings': '2 Rois', '1 Chronicles': '1 Chroniques', '2 Chronicles': '2 Chroniques',
    'Ezra': 'Esdras', 'Nehemiah': 'Néhémie', 'Esther': 'Esther', 'Job': 'Job', 'Psalms': 'Psaumes', 'Proverbs': 'Proverbes',
    'Ecclesiastes': 'Ecclésiaste', 'Song of Solomon': 'Cantique', 'Isaiah': 'Isaïe', 'Jeremiah': 'Jérémie',
    'Lamentations': 'Lamentations', 'Ezekiel': 'Ézéchiel', 'Daniel': 'Daniel',
    'Matthew': 'Matthieu', 'Mark': 'Marc', 'Luke': 'Luc', 'John': 'Jean', 'Acts': 'Actes',
    'Romans': 'Romains', 'Revelation': 'Apocalypse'
  },
  spanish: {
    'Genesis': 'Génesis', 'Exodus': 'Éxodo', 'Leviticus': 'Levítico', 'Numbers': 'Números', 'Deuteronomy': 'Deuteronomio',
    'Joshua': 'Josué', 'Judges': 'Jueces', 'Ruth': 'Rut', '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel',
    '1 Kings': '1 Reyes', '2 Kings': '2 Reyes', '1 Chronicles': '1 Crónicas', '2 Chronicles': '2 Crónicas',
    'Ezra': 'Esdras', 'Nehemiah': 'Nehemías', 'Esther': 'Ester', 'Job': 'Job', 'Psalms': 'Salmos', 'Proverbs': 'Proverbios',
    'Ecclesiastes': 'Eclesiastés', 'Song of Solomon': 'Cantares', 'Isaiah': 'Isaías', 'Jeremiah': 'Jeremías',
    'Lamentations': 'Lamentaciones', 'Ezekiel': 'Ezequiel', 'Daniel': 'Daniel',
    'Matthew': 'Mateo', 'Mark': 'Marcos', 'Luke': 'Lucas', 'John': 'Juan', 'Acts': 'Hechos',
    'Romans': 'Romanos', 'Revelation': 'Apocalipsis'
  },
  polish: {
    'Genesis': 'Księga Rodzaju', 'Exodus': 'Księga Wyjścia', 'Leviticus': 'Księga Kapłańska', 'Numbers': 'Księga Liczb', 'Deuteronomy': 'Księga Powtórzonego Prawa',
    'Joshua': 'Księga Jozuego', 'Judges': 'Księga Sędziów', 'Ruth': 'Księga Rut', 'Psalms': 'Psalmy', 'Proverbs': 'Przypowieści',
    'Matthew': 'Mateusza', 'Mark': 'Marka', 'Luke': 'Łukasza', 'John': 'Jana', 'Acts': 'Dzieje Apostolskie',
    'Revelation': 'Apokalipsa'
  },
  portuguese: {
    'Genesis': 'Gênesis', 'Exodus': 'Êxodo', 'Leviticus': 'Levítico', 'Numbers': 'Números', 'Deuteronomy': 'Deuteronômio',
    'Joshua': 'Josué', 'Judges': 'Juízes', 'Ruth': 'Rute', 'Psalms': 'Salmos', 'Proverbs': 'Provérbios',
    'Matthew': 'Mateus', 'Mark': 'Marcos', 'Luke': 'Lucas', 'John': 'João', 'Acts': 'Atos',
    'Revelation': 'Apocalipse'
  },
  romanian: {
    'Genesis': 'Geneza', 'Exodus': 'Exodul', 'Leviticus': 'Levitic', 'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronom',
    'Joshua': 'Iosua', 'Judges': 'Judecători', 'Ruth': 'Rut', 'Psalms': 'Psalmi', 'Proverbs': 'Proverbe',
    'Matthew': 'Matei', 'Mark': 'Marcu', 'Luke': 'Luca', 'John': 'Ioan', 'Acts': 'Faptele Apostolilor',
    'Revelation': 'Apocalipsa'
  }
};

const LANGUAGES = [
  { code: 'italian', translations: TRANSLATIONS.italian },
  { code: 'french', translations: TRANSLATIONS.french },
  { code: 'spanish', translations: TRANSLATIONS.spanish },
  { code: 'polish', translations: TRANSLATIONS.polish },
  { code: 'portuguese', translations: TRANSLATIONS.portuguese },
  { code: 'romanian', translations: TRANSLATIONS.romanian },
];

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║        TRANSLATE BOOK NAMES TO NATIVE LANGUAGES          ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

for (const lang of LANGUAGES) {
  const indexPath = path.join('dist-diebibel', lang.code, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⊘ ${lang.code}: Not found`);
    continue;
  }
  
  process.stdout.write(`${lang.code.padEnd(15, ' ')}: `);
  
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    let count = 0;
    
    // Replace book names in index
    for (const [english, native] of Object.entries(lang.translations)) {
      const pattern = new RegExp(`<span class="book-name">${english}</span>`, 'g');
      const matches = html.match(pattern);
      if (matches) {
        html = html.replace(pattern, `<span class="book-name">${native}</span>`);
        count += matches.length;
      }
    }
    
    if (count > 0) {
      fs.writeFileSync(indexPath, html, 'utf8');
    }
    
    console.log(`✓ ${count} names`);
    
  } catch (e) {
    console.log(`✗ Error: ${e.message}`);
  }
}

console.log('\n═══════════════════════════════════════════════════════════\n');
