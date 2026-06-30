const fs = require('fs');
const path = require('path');

// Read German index.html as template
const germanIndexPath = 'dist-diebibel/german/index.html';
const italianIndexPath = 'dist-diebibel/italian/index.html';

const germanHtml = fs.readFileSync(germanIndexPath, 'utf8');

// Italian book names for translation
const italianBooks = {
  'Genesis': 'Genesi',
  'Exodus': 'Esodo',
  'Levitikus': 'Levitico',
  'Numeri': 'Numeri',
  'Deuteronomium': 'Deuteronomio',
  'Josua': 'Giosuè',
  'Richter': 'Giudici',
  'Rut': 'Rut',
  '1. Samuel': '1 Samuele',
  '2. Samuel': '2 Samuele',
  '1. Könige': '1 Re',
  '2. Könige': '2 Re',
  '1. Chronik': '1 Cronache',
  '2. Chronik': '2 Cronache',
  'Esra': 'Esdra',
  'Nehemia': 'Neemia',
  'Ester': 'Ester',
  'Hiob': 'Giobbe',
  'Psalmen': 'Salmi',
  'Sprichwörter': 'Proverbi',
  'Kohelet': 'Ecclesiaste',
  'Hoheslied': 'Cantico',
  'Jesaja': 'Isaia',
  'Jeremia': 'Geremia',
  'Klagelieder': 'Lamentazioni',
  'Ezechiel': 'Ezechiele',
  'Daniel': 'Daniele',
  'Hosea': 'Osea',
  'Joel': 'Gioele',
  'Amos': 'Amos',
  'Obadja': 'Abdia',
  'Jona': 'Giona',
  'Micha': 'Michea',
  'Nahum': 'Naum',
  'Habakuk': 'Abacuc',
  'Zephania': 'Sofonia',
  'Haggai': 'Aggeo',
  'Sacharja': 'Zaccaria',
  'Maleachi': 'Malachia',
  'Matthäus': 'Matteo',
  'Markus': 'Marco',
  'Lukas': 'Luca',
  'Johannes': 'Giovanni',
  'Apostelgeschichte': 'Atti',
  'Römer': 'Romani',
  '1. Korinther': '1 Corinzi',
  '2. Korinther': '2 Corinzi',
  'Galater': 'Galati',
  'Epheser': 'Efesini',
  'Philipper': 'Filippesi',
  'Kolosser': 'Colossesi',
  '1. Thessalonicher': '1 Tessalonicesi',
  '2. Thessalonicher': '2 Tessalonicesi',
  '1. Timotheus': '1 Timoteo',
  '2. Timotheus': '2 Timoteo',
  'Titus': 'Tito',
  'Philemon': 'Filemone',
  'Hebräer': 'Ebrei',
  'Jakobus': 'Giacomo',
  '1. Petrus': '1 Pietro',
  '2. Petrus': '2 Pietro',
  '1. Johannes': '1 Giovanni',
  '2. Johannes': '2 Giovanni',
  '3. Johannes': '3 Giovanni',
  'Judas': 'Giuda',
  'Offenbarung': 'Apocalisse',
  'Tobit': 'Tobia',
  'Judit': 'Giuditta',
  '1. Makkabäer': '1 Maccabei',
  '2. Makkabäer': '2 Maccabei',
  'Weisheit': 'Sapienza',
  'Jesus Sirach': 'Siracide',
  'Baruch': 'Baruc'
};

// Create Italian version
let italianHtml = germanHtml;

// Replace language-specific content
italianHtml = italianHtml.replace(/<html lang="de">/, '<html lang="it">');
italianHtml = italianHtml.replace(/<title>Biblia Catholica &middot; Deutsch<\/title>/, '<title>Biblia Catholica · Italiano</title>');
italianHtml = italianHtml.replace(/&#8592; Zur Übersicht/, '← Tutte le lingue');
italianHtml = italianHtml.replace(/Rückseite &#8594;/, 'Retro &#8594;');
italianHtml = italianHtml.replace(/<div class="htitle">Die Heilige Bibel<\/div>/, '<div class="htitle">La Sacra Bibbia</div>');
italianHtml = italianHtml.replace(/<div class="hlang">DEUTSCH<\/div>/, '<div class="hlang">ITALIANO</div>');

// Replace "Katholisch" / "Protestantisch" buttons
italianHtml = italianHtml.replace(/✝&#xFE0E; Katholisch/, '✝&#xFE0E; Cattolico');
italianHtml = italianHtml.replace(/☩&#xFE0E; Protestantisch/, '☩&#xFE0E; Protestante');

// Replace "Vetus Testamentum" / "Altes Testament"
italianHtml = italianHtml.replace(/Altes Testament/, 'Antico Testamento');

// Replace "Novum Testamentum" / "Neues Testament"  
italianHtml = italianHtml.replace(/Neues Testament/, 'Nuovo Testamento');

// Replace "Deuterocanonical" / "Deuterokanonisch"
italianHtml = italianHtml.replace(/Deuterokanonische Bücher/, 'Libri Deuterocanonici');

// Replace all German book names with Italian
for (const [german, italian] of Object.entries(italianBooks)) {
  const regex = new RegExp(`<span class="tname">${german}</span>`, 'g');
  italianHtml = italianHtml.replace(regex, `<span class="tname">${italian}</span>`);
}

// Write the new Italian index.html
fs.writeFileSync(italianIndexPath, italianHtml, 'utf8');
console.log('✅ Italian index.html completely rewritten with correct design!');
