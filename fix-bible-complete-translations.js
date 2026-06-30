/**
 * COMPREHENSIVE BIBLE TRANSLATION FIX
 * Replace ALL English book names with correct local language translations
 */

const fs = require('fs');
const path = require('path');

const BASE = 'dist-diebibel';

// COMPLETE translations for all 73 Catholic Bible books
const BOOK_NAMES = {
  italian: {
    'Genesis': 'Genesi', 'Exodus': 'Esodo', 'Leviticus': 'Levitico',
    'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronomio', 'Joshua': 'Giosuè',
    'Judges': 'Giudici', 'Ruth': 'Rut', '1 Samuel': '1 Samuele',
    '2 Samuel': '2 Samuele', '1 Kings': '1 Re', '2 Kings': '2 Re',
    '1 Chronicles': '1 Cronache', '2 Chronicles': '2 Cronache', 'Ezra': 'Esdra',
    'Nehemiah': 'Neemia', 'Tobit': 'Tobia', 'Judith': 'Giuditta', 'Esther': 'Ester',
    '1 Maccabees': '1 Maccabei', '2 Maccabees': '2 Maccabei', 'Job': 'Giobbe', 
    'Psalms': 'Salmi', 'Proverbs': 'Proverbi', 'Ecclesiastes': 'Qoelet',
    'Song of Solomon': 'Cantico dei Cantici', 'Wisdom': 'Sapienza', 'Sirach': 'Siracide',
    'Isaiah': 'Isaia', 'Jeremiah': 'Geremia', 'Lamentations': 'Lamentazioni',
    'Baruch': 'Baruc', 'Ezekiel': 'Ezechiele', 'Daniel': 'Daniele',
    'Hosea': 'Osea', 'Joel': 'Gioele', 'Amos': 'Amos', 'Obadiah': 'Abdia',
    'Jonah': 'Giona', 'Micah': 'Michea', 'Nahum': 'Naum', 'Habakkuk': 'Abacuc',
    'Zephaniah': 'Sofonia', 'Haggai': 'Aggeo', 'Zechariah': 'Zaccaria', 
    'Malachi': 'Malachia', 'Matthew': 'Matteo', 'Mark': 'Marco', 'Luke': 'Luca',
    'John': 'Giovanni', 'Acts': 'Atti', 'Romans': 'Romani', 
    '1 Corinthians': '1 Corinzi', '2 Corinthians': '2 Corinzi', 'Galatians': 'Galati',
    'Ephesians': 'Efesini', 'Philippians': 'Filippesi', 'Colossians': 'Colossesi',
    '1 Thessalonians': '1 Tessalonicesi', '2 Thessalonians': '2 Tessalonicesi',
    '1 Timothy': '1 Timoteo', '2 Timothy': '2 Timoteo', 'Titus': 'Tito',
    'Philemon': 'Filemone', 'Hebrews': 'Ebrei', 'James': 'Giacomo',
    '1 Peter': '1 Pietro', '2 Peter': '2 Pietro', '1 John': '1 Giovanni',
    '2 John': '2 Giovanni', '3 John': '3 Giovanni', 'Jude': 'Giuda',
    'Revelation': 'Apocalisse'
  },
  french: {
    'Genesis': 'Genèse', 'Exodus': 'Exode', 'Leviticus': 'Lévitique',
    'Numbers': 'Nombres', 'Deuteronomy': 'Deutéronome', 'Joshua': 'Josué',
    'Judges': 'Juges', 'Ruth': 'Ruth', '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel', '1 Kings': '1 Rois', '2 Kings': '2 Rois',
    '1 Chronicles': '1 Chroniques', '2 Chronicles': '2 Chroniques', 'Ezra': 'Esdras',
    'Nehemiah': 'Néhémie', 'Tobit': 'Tobie', 'Judith': 'Judith', 'Esther': 'Esther',
    '1 Maccabees': '1 Maccabées', '2 Maccabees': '2 Maccabées', 'Job': 'Job',
    'Psalms': 'Psaumes', 'Proverbs': 'Proverbes', 'Ecclesiastes': 'Ecclésiaste',
    'Song of Solomon': 'Cantique des Cantiques', 'Wisdom': 'Sagesse', 'Sirach': 'Siracide',
    'Isaiah': 'Isaïe', 'Jeremiah': 'Jérémie', 'Lamentations': 'Lamentations',
    'Baruch': 'Baruch', 'Ezekiel': 'Ézéchiel', 'Daniel': 'Daniel',
    'Hosea': 'Osée', 'Joel': 'Joël', 'Amos': 'Amos', 'Obadiah': 'Abdias',
    'Jonah': 'Jonas', 'Micah': 'Michée', 'Nahum': 'Nahum', 'Habakkuk': 'Habacuc',
    'Zephaniah': 'Sophonie', 'Haggai': 'Aggée', 'Zechariah': 'Zacharie',
    'Malachi': 'Malachie', 'Matthew': 'Matthieu', 'Mark': 'Marc', 'Luke': 'Luc',
    'John': 'Jean', 'Acts': 'Actes', 'Romans': 'Romains',
    '1 Corinthians': '1 Corinthiens', '2 Corinthians': '2 Corinthiens', 
    'Galatians': 'Galates', 'Ephesians': 'Éphésiens', 'Philippians': 'Philippiens',
    'Colossians': 'Colossiens', '1 Thessalonians': '1 Thessaloniciens',
    '2 Thessalonians': '2 Thessaloniciens', '1 Timothy': '1 Timothée',
    '2 Timothy': '2 Timothée', 'Titus': 'Tite', 'Philemon': 'Philémon',
    'Hebrews': 'Hébreux', 'James': 'Jacques', '1 Peter': '1 Pierre',
    '2 Peter': '2 Pierre', '1 John': '1 Jean', '2 John': '2 Jean',
    '3 John': '3 Jean', 'Jude': 'Jude', 'Revelation': 'Apocalypse'
  },
  spanish: {
    'Genesis': 'Génesis', 'Exodus': 'Éxodo', 'Leviticus': 'Levítico',
    'Numbers': 'Números', 'Deuteronomy': 'Deuteronomio', 'Joshua': 'Josué',
    'Judges': 'Jueces', 'Ruth': 'Rut', '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel', '1 Kings': '1 Reyes', '2 Kings': '2 Reyes',
    '1 Chronicles': '1 Crónicas', '2 Chronicles': '2 Crónicas', 'Ezra': 'Esdras',
    'Nehemiah': 'Nehemías', 'Tobit': 'Tobías', 'Judith': 'Judit', 'Esther': 'Ester',
    '1 Maccabees': '1 Macabeos', '2 Maccabees': '2 Macabeos', 'Job': 'Job',
    'Psalms': 'Salmos', 'Proverbs': 'Proverbios', 'Ecclesiastes': 'Eclesiastés',
    'Song of Solomon': 'Cantar de los Cantares', 'Wisdom': 'Sabiduría', 'Sirach': 'Eclesiástico',
    'Isaiah': 'Isaías', 'Jeremiah': 'Jeremías', 'Lamentations': 'Lamentaciones',
    'Baruch': 'Baruc', 'Ezekiel': 'Ezequiel', 'Daniel': 'Daniel',
    'Hosea': 'Oseas', 'Joel': 'Joel', 'Amos': 'Amós', 'Obadiah': 'Abdías',
    'Jonah': 'Jonás', 'Micah': 'Miqueas', 'Nahum': 'Nahúm', 'Habakkuk': 'Habacuc',
    'Zephaniah': 'Sofonías', 'Haggai': 'Ageo', 'Zechariah': 'Zacarías',
    'Malachi': 'Malaquías', 'Matthew': 'Mateo', 'Mark': 'Marcos', 'Luke': 'Lucas',
    'John': 'Juan', 'Acts': 'Hechos', 'Romans': 'Romanos',
    '1 Corinthians': '1 Corintios', '2 Corinthians': '2 Corintios', 
    'Galatians': 'Gálatas', 'Ephesians': 'Efesios', 'Philippians': 'Filipenses',
    'Colossians': 'Colosenses', '1 Thessalonians': '1 Tesalonicenses',
    '2 Thessalonians': '2 Tesalonicenses', '1 Timothy': '1 Timoteo',
    '2 Timothy': '2 Timoteo', 'Titus': 'Tito', 'Philemon': 'Filemón',
    'Hebrews': 'Hebreos', 'James': 'Santiago', '1 Peter': '1 Pedro',
    '2 Peter': '2 Pedro', '1 John': '1 Juan', '2 John': '2 Juan',
    '3 John': '3 Juan', 'Jude': 'Judas', 'Revelation': 'Apocalipsis'
  },
  portuguese: {
    'Genesis': 'Gênesis', 'Exodus': 'Êxodo', 'Leviticus': 'Levítico',
    'Numbers': 'Números', 'Deuteronomy': 'Deuteronômio', 'Joshua': 'Josué',
    'Judges': 'Juízes', 'Ruth': 'Rute', '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel', '1 Kings': '1 Reis', '2 Kings': '2 Reis',
    '1 Chronicles': '1 Crônicas', '2 Chronicles': '2 Crônicas', 'Ezra': 'Esdras',
    'Nehemiah': 'Neemias', 'Tobit': 'Tobias', 'Judith': 'Judite', 'Esther': 'Ester',
    '1 Maccabees': '1 Macabeus', '2 Maccabees': '2 Macabeus', 'Job': 'Jó',
    'Psalms': 'Salmos', 'Proverbs': 'Provérbios', 'Ecclesiastes': 'Eclesiastes',
    'Song of Solomon': 'Cântico dos Cânticos', 'Wisdom': 'Sabedoria', 'Sirach': 'Eclesiástico',
    'Isaiah': 'Isaías', 'Jeremiah': 'Jeremias', 'Lamentations': 'Lamentações',
    'Baruch': 'Baruc', 'Ezekiel': 'Ezequiel', 'Daniel': 'Daniel',
    'Hosea': 'Oseias', 'Joel': 'Joel', 'Amos': 'Amós', 'Obadiah': 'Obadias',
    'Jonah': 'Jonas', 'Micah': 'Miqueias', 'Nahum': 'Naum', 'Habakkuk': 'Habacuque',
    'Zephaniah': 'Sofonias', 'Haggai': 'Ageu', 'Zechariah': 'Zacarias',
    'Malachi': 'Malaquias', 'Matthew': 'Mateus', 'Mark': 'Marcos', 'Luke': 'Lucas',
    'John': 'João', 'Acts': 'Atos', 'Romans': 'Romanos',
    '1 Corinthians': '1 Coríntios', '2 Corinthians': '2 Coríntios',
    'Galatians': 'Gálatas', 'Ephesians': 'Efésios', 'Philippians': 'Filipenses',
    'Colossians': 'Colossenses', '1 Thessalonians': '1 Tessalonicenses',
    '2 Thessalonians': '2 Tessalonicenses', '1 Timothy': '1 Timóteo',
    '2 Timothy': '2 Timóteo', 'Titus': 'Tito', 'Philemon': 'Filemom',
    'Hebrews': 'Hebreus', 'James': 'Tiago', '1 Peter': '1 Pedro',
    '2 Peter': '2 Pedro', '1 John': '1 João', '2 John': '2 João',
    '3 John': '3 João', 'Jude': 'Judas', 'Revelation': 'Apocalipse'
  },
  romanian: {
    'Genesis': 'Geneza', 'Exodus': 'Exod', 'Leviticus': 'Levitic',
    'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronom', 'Joshua': 'Iosua',
    'Judges': 'Judecători', 'Ruth': 'Rut', '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel', '1 Kings': '1 Regi', '2 Kings': '2 Regi',
    '1 Chronicles': '1 Cronici', '2 Chronicles': '2 Cronici', 'Ezra': 'Ezra',
    'Nehemiah': 'Neemia', 'Tobit': 'Tobit', 'Judith': 'Iudita', 'Esther': 'Estera',
    '1 Maccabees': '1 Macabei', '2 Maccabees': '2 Macabei', 'Job': 'Iov',
    'Psalms': 'Psalmi', 'Proverbs': 'Proverbe', 'Ecclesiastes': 'Ecclesiastul',
    'Song of Solomon': 'Cântarea Cântărilor', 'Wisdom': 'Înțelepciunea', 'Sirach': 'Ecclesiasticul',
    'Isaiah': 'Isaia', 'Jeremiah': 'Ieremia', 'Lamentations': 'Plângerile',
    'Baruch': 'Baruh', 'Ezekiel': 'Iezechiel', 'Daniel': 'Daniel',
    'Hosea': 'Osea', 'Joel': 'Ioel', 'Amos': 'Amos', 'Obadiah': 'Obadia',
    'Jonah': 'Iona', 'Micah': 'Mica', 'Nahum': 'Naum', 'Habakkuk': 'Habacuc',
    'Zephaniah': 'Țefania', 'Haggai': 'Hagai', 'Zechariah': 'Zaharia',
    'Malachi': 'Maleahi', 'Matthew': 'Matei', 'Mark': 'Marcu', 'Luke': 'Luca',
    'John': 'Ioan', 'Acts': 'Faptele Apostolilor', 'Romans': 'Romani',
    '1 Corinthians': '1 Corinteni', '2 Corinthians': '2 Corinteni',
    'Galatians': 'Galateni', 'Ephesians': 'Efeseni', 'Philippians': 'Filipeni',
    'Colossians': 'Coloseni', '1 Thessalonians': '1 Tesaloniceni',
    '2 Thessalonians': '2 Tesaloniceni', '1 Timothy': '1 Timotei',
    '2 Timothy': '2 Timotei', 'Titus': 'Tit', 'Philemon': 'Filimon',
    'Hebrews': 'Evrei', 'James': 'Iacov', '1 Peter': '1 Petru',
    '2 Peter': '2 Petru', '1 John': '1 Ioan', '2 John': '2 Ioan',
    '3 John': '3 Ioan', 'Jude': 'Iuda', 'Revelation': 'Apocalipsa'
  },
  polish: {
    'Genesis': 'Księga Rodzaju', 'Exodus': 'Księga Wyjścia', 'Leviticus': 'Księga Kapłańska',
    'Numbers': 'Księga Liczb', 'Deuteronomy': 'Księga Powtórzonego Prawa', 'Joshua': 'Księga Jozuego',
    'Judges': 'Księga Sędziów', 'Ruth': 'Księga Rut', '1 Samuel': '1 Księga Samuela',
    '2 Samuel': '2 Księga Samuela', '1 Kings': '1 Księga Królewska', '2 Kings': '2 Księga Królewska',
    '1 Chronicles': '1 Księga Kronik', '2 Chronicles': '2 Księga Kronik', 'Ezra': 'Księga Ezdrasza',
    'Nehemiah': 'Księga Nehemiasza', 'Tobit': 'Księga Tobiasza', 'Judith': 'Księga Judyty', 
    'Esther': 'Księga Estery', '1 Maccabees': '1 Księga Machabejska', '2 Maccabees': '2 Księga Machabejska',
    'Job': 'Księga Hioba', 'Psalms': 'Księga Psalmów', 'Proverbs': 'Księga Przysłów',
    'Ecclesiastes': 'Księga Koheleta', 'Song of Solomon': 'Pieśń nad Pieśniami', 
    'Wisdom': 'Księga Mądrości', 'Sirach': 'Mądrość Syracha',
    'Isaiah': 'Księga Izajasza', 'Jeremiah': 'Księga Jeremiasza', 'Lamentations': 'Lamentacje',
    'Baruch': 'Księga Barucha', 'Ezekiel': 'Księga Ezechiela', 'Daniel': 'Księga Daniela',
    'Hosea': 'Księga Ozeasza', 'Joel': 'Księga Joela', 'Amos': 'Księga Amosa', 'Obadiah': 'Księga Abdiasza',
    'Jonah': 'Księga Jonasza', 'Micah': 'Księga Micheasza', 'Nahum': 'Księga Nahuma', 
    'Habakkuk': 'Księga Habakuka', 'Zephaniah': 'Księga Sofoniasza', 'Haggai': 'Księga Aggeusza',
    'Zechariah': 'Księga Zachariasza', 'Malachi': 'Księga Malachiasza',
    'Matthew': 'Ewangelia wg Mateusza', 'Mark': 'Ewangelia wg Marka', 'Luke': 'Ewangelia wg Łukasza',
    'John': 'Ewangelia wg Jana', 'Acts': 'Dzieje Apostolskie', 'Romans': 'List do Rzymian',
    '1 Corinthians': '1 List do Koryntian', '2 Corinthians': '2 List do Koryntian',
    'Galatians': 'List do Galatów', 'Ephesians': 'List do Efezjan', 'Philippians': 'List do Filipian',
    'Colossians': 'List do Kolosan', '1 Thessalonians': '1 List do Tesaloniczan',
    '2 Thessalonians': '2 List do Tesaloniczan', '1 Timothy': '1 List do Tymoteusza',
    '2 Timothy': '2 List do Tymoteusza', 'Titus': 'List do Tytusa', 'Philemon': 'List do Filemona',
    'Hebrews': 'List do Hebrajczyków', 'James': 'List Jakuba', '1 Peter': '1 List Piotra',
    '2 Peter': '2 List Piotra', '1 John': '1 List Jana', '2 John': '2 List Jana',
    '3 John': '3 List Jana', 'Jude': 'List Judy', 'Revelation': 'Apokalipsa'
  }
};

function fixLanguage(lang) {
  const indexPath = path.join(BASE, lang, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`  ✗ ${lang}: Not found`);
    return false;
  }

  const translations = BOOK_NAMES[lang];
  if (!translations) {
    console.log(`  − ${lang}: No translations (skip)`);
    return false;
  }

  let content = fs.readFileSync(indexPath, 'utf8');
  let changes = 0;

  // Replace each English name with local translation
  for (const [eng, local] of Object.entries(translations)) {
    const pattern = new RegExp(`<span class="b-name">${eng.replace(/[()]/g, '\\$&')}</span>`, 'g');
    const count = (content.match(pattern) || []).length;
    if (count > 0) {
      content = content.replace(pattern, `<span class="b-name">${local}</span>`);
      changes += count;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`  ✓ ${lang}: ${changes} book names translated`);
    return true;
  }

  console.log(`  − ${lang}: Already fixed`);
  return false;
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║    COMPREHENSIVE BIBLE TRANSLATION REPLACEMENT            ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const langs = ['italian', 'french', 'spanish', 'portuguese', 'romanian', 'polish'];
let fixed = 0;

for (const lang of langs) {
  if (fixLanguage(lang)) fixed++;
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`✅ Fixed: ${fixed} languages with complete translations`);
console.log('═══════════════════════════════════════════════════════════\n');
