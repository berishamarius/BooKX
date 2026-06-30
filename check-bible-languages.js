/**
 * CHECK ALL BIBLE LANGUAGES
 * Verify which languages have data and which are in cover
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = 'CATHOLIC-BIBLE/data';
const DIST_DIR = 'dist-diebibel';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║           BIBLE LANGUAGES STATUS CHECK                   ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Get all languages with data
const dataLangs = fs.readdirSync(DATA_DIR)
  .filter(f => fs.statSync(path.join(DATA_DIR, f)).isDirectory())
  .sort();

// Get all languages in dist
const distLangs = fs.readdirSync(DIST_DIR)
  .filter(f => fs.statSync(path.join(DIST_DIR, f)).isDirectory())
  .filter(f => !f.startsWith('.') && f !== 'Deutsch')
  .sort();

console.log('📁 LANGUAGES WITH JSON DATA:\n');
dataLangs.forEach(lang => {
  const files = fs.readdirSync(path.join(DATA_DIR, lang)).filter(f => f.endsWith('.json'));
  console.log(`   ✓ ${lang.padEnd(18, ' ')} (${files.length} books)`);
});

console.log('\n📁 LANGUAGES IN DIST-DIEBIBEL:\n');
distLangs.forEach(lang => {
  const booksDir = path.join(DIST_DIR, lang, 'bücher');
  const hasBooks = fs.existsSync(booksDir);
  const count = hasBooks ? fs.readdirSync(booksDir).filter(f => f.endsWith('.html')).length : 0;
  console.log(`   ${hasBooks ? '✓' : '✗'} ${lang.padEnd(18, ' ')} (${count} books)`);
});

console.log('\n🔍 COMPARISON:\n');

// Check which dist langs don't have data
const distNoData = distLangs.filter(d => !dataLangs.includes(d));
if (distNoData.length > 0) {
  console.log('❌ IN DIST BUT NO DATA:');
  distNoData.forEach(l => console.log(`   ⚠️  ${l}`));
} else {
  console.log('✅ All dist languages have data folders');
}

// Check which data langs aren't in dist
const dataNotInDist = dataLangs.filter(d => !distLangs.includes(d) && d !== 'vulgate');
if (dataNotInDist.length > 0) {
  console.log('\n❓ HAS DATA BUT NOT IN DIST:');
  dataNotInDist.forEach(l => console.log(`   • ${l}`));
}

console.log('\n═══════════════════════════════════════════════════════════\n');
