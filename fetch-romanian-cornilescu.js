/**
 * FETCH ROMANIAN CORNILESCU BIBLE & FIX ALL TRANSLATIONS
 * 1. Get Cornilescu (1921) from GetBible API
 * 2. Insert into all Romanian HTML books
 * 3. Translate book names to native languages
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ROMANIAN BOOK NAMES (1-73)
const ROMANIAN_BOOKS = {
  '001': 'Geneza', '002': 'Exodul', '003': 'Leviticul', '004': 'Numeri', 
  '005': 'Deuteronomul', '006': 'Iosua', '007': 'Judecători', '008': 'Rut',
  '009': '1 Samuel', '010': '2 Samuel', '011': '1 Împărați', '012': '2 Împărați',
  '013': '1 Cronici', '014': '2 Cronici', '015': 'Ezra', '016': 'Neemia',
  '017': 'Tobit', '018': 'Iudit', '019': 'Estera', '020': '1 Macabei',
  '021': '2 Macabei', '022': 'Iov', '023': 'Psalmi', '024': 'Proverbe',
  '025': 'Eclesiastul', '026': 'Cântarea Cântărilor', '027': 'Înțelepciunea', 
  '028': 'Ecclesiasticul', '029': 'Isaia', '030': 'Ieremia', '031': 'Plângerile',
  '032': 'Baruc', '033': 'Ezechiel', '034': 'Daniel', '035': 'Osea',
  '036': 'Ioel', '037': 'Amos', '038': 'Obadia', '039': 'Iona',
  '040': 'Mica', '041': 'Naum', '042': 'Habacuc', '043': 'Țefania',
  '044': 'Hagai', '045': 'Zaharia', '046': 'Maleahi', '047': 'Matei',
  '048': 'Marcu', '049': 'Luca', '050': 'Ioan', '051': 'Faptele Apostolilor',
  '052': 'Romani', '053': '1 Corinteni', '054': '2 Corinteni', '055': 'Galateni',
  '056': 'Efeseni', '057': 'Filipeni', '058': 'Coloseni', '059': '1 Tesaloniceni',
  '060': '2 Tesaloniceni', '061': '1 Timotei', '062': '2 Timotei', '063': 'Tit',
  '064': 'Filimon', '065': 'Evrei', '066': 'Iacov', '067': '1 Petru',
  '068': '2 Petru', '069': '1 Ioan', '070': '2 Ioan', '071': '3 Ioan',
  '072': 'Iuda', '073': 'Apocalipsa'
};

// ITALIAN BOOK NAMES
const ITALIAN_BOOKS = {
  '001': 'Genesi', '002': 'Esodo', '003': 'Levitico', '004': 'Numeri',
  '005': 'Deuteronomio', '006': 'Giosuè', '007': 'Giudici', '008': 'Rut',
  '009': '1 Samuele', '010': '2 Samuele', '011': '1 Re', '012': '2 Re',
  '013': '1 Cronache', '014': '2 Cronache', '015': 'Esdra', '016': 'Neemia',
  '017': 'Tobia', '018': 'Giuditta', '019': 'Ester', '020': '1 Maccabei',
  '021': '2 Maccabei', '022': 'Giobbe', '023': 'Salmi', '024': 'Proverbi',
  '025': 'Ecclesiaste', '026': 'Cantico dei Cantici', '027': 'Sapienza',
  '028': 'Siracide', '029': 'Isaia', '030': 'Geremia', '031': 'Lamentazioni',
  '032': 'Baruc', '033': 'Ezechiele', '034': 'Daniele', '035': 'Osea',
  '036': 'Gioele', '037': 'Amos', '038': 'Abdia', '039': 'Giona',
  '040': 'Michea', '041': 'Naum', '042': 'Abacuc', '043': 'Sofonia',
  '044': 'Aggeo', '045': 'Zaccaria', '046': 'Malachia', '047': 'Matteo',
  '048': 'Marco', '049': 'Luca', '050': 'Giovanni', '051': 'Atti degli Apostoli',
  '052': 'Romani', '053': '1 Corinzi', '054': '2 Corinzi', '055': 'Galati',
  '056': 'Efesini', '057': 'Filippesi', '058': 'Colossesi', '059': '1 Tessalonicesi',
  '060': '2 Tessalonicesi', '061': '1 Timoteo', '062': '2 Timoteo', '063': 'Tito',
  '064': 'Filemone', '065': 'Ebrei', '066': 'Giacomo', '067': '1 Pietro',
  '068': '2 Pietro', '069': '1 Giovanni', '070': '2 Giovanni', '071': '3 Giovanni',
  '072': 'Giuda', '073': 'Apocalisse'
};

// Bible book code mapping (Genesis = 1, Exodus = 2, etc.)
const BOOK_CODES = {
  '001': 1, '002': 2, '003': 3, '004': 4, '005': 5, '006': 6, '007': 7, '008': 8,
  '009': 9, '010': 10, '011': 11, '012': 12, '013': 13, '014': 14, '015': 15,
  '016': 16, '022': 18, '023': 19, '024': 20, '025': 21, '026': 22, '029': 23,
  '030': 24, '031': 25, '033': 26, '034': 27, '035': 28, '036': 29, '037': 30,
  '038': 31, '039': 32, '040': 33, '041': 34, '042': 35, '043': 36, '044': 37,
  '045': 38, '046': 39, '047': 40, '048': 41, '049': 42, '050': 43, '051': 44,
  '052': 45, '053': 46, '054': 47, '055': 48, '056': 49, '057': 50, '058': 51,
  '059': 52, '060': 53, '061': 54, '062': 55, '063': 56, '064': 57, '065': 58,
  '066': 59, '067': 60, '068': 61, '069': 62, '070': 63, '071': 64, '072': 65,
  '073': 66
};

async function fetchFromGetBible(bookNum) {
  return new Promise((resolve, reject) => {
    const url = `https://getbible.net/json?passage=${bookNum}&version=cornilescu`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // GetBible returns JSONP, strip callback
          const json = data.replace(/^[^{]+/, '').replace(/[^}]+$/, '');
          const parsed = JSON.parse(json);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   FETCHING ROMANIAN CORNILESCU & FIXING BOOK NAMES       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📖 Testing GetBible API for Cornilescu...\n');
  
  try {
    // Test with Genesis
    const test = await fetchFromGetBible('Genesis');
    console.log('✓ GetBible API works!');
    console.log(`  Sample: ${test.book[0].chapter['1'].verse['1'].verse.substring(0, 80)}...\n`);
    
    console.log('⚠️  GetBible structure needs parsing. Building extraction script...\n');
    console.log('NOTE: Full Romanian translation requires ~66 API calls + processing');
    console.log('      Estimated time: ~10 minutes\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (e) {
    console.log(`✗ Error: ${e.message}`);
    console.log('\nAlternative: Use bible-api.com or create from Romanian JSON files\n');
  }
}

main();
