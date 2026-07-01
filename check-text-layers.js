const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

const ORTHODOX_LANGUAGES = ['german', 'russian', 'ukrainian', 'croatian'];

console.log('🔍 Checking text layers completeness...\n');

for (const lang of LANGUAGES) {
  const booksDir = path.join('dist-diebibel', lang, 'bücher');
  
  if (!fs.existsSync(booksDir)) {
    console.log(`⚠️  ${lang}: Books directory not found`);
    continue;
  }
  
  const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.html'));
  
  const isOrthodox = ORTHODOX_LANGUAGES.includes(lang);
  const expectedBooks = isOrthodox ? 79 : 66;
  
  let latinCount = 0;
  let germanCount = 0;
  let greekCount = 0;
  let totalVerses = 0;
  
  for (const file of files) {
    const filePath = path.join(booksDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Count verses using regex
    const verses = (html.match(/<div class="vb"/g) || []).length;
    totalVerses += verses;
    
    // Count text layers using regex
    const latinVerses = (html.match(/<p class="base base-c">/g) || []).length;
    const germanVerses = (html.match(/<p class="base base-p">/g) || []).length;
    const greekVerses = (html.match(/<p class="base base-o">/g) || []).length;
    
    latinCount += latinVerses;
    germanCount += germanVerses;
    greekCount += greekVerses;
  }
  
  const latinComplete = latinCount === totalVerses ? '✅' : '❌';
  const germanComplete = germanCount === totalVerses ? '✅' : '❌';
  const greekComplete = greekCount === totalVerses ? '✅' : '❌';
  
  console.log(`📖 ${lang.toUpperCase()} (${files.length}/${expectedBooks} books):`);
  console.log(`   Latin:  ${latinComplete} ${latinCount}/${totalVerses} verses`);
  console.log(`   German: ${germanComplete} ${germanCount}/${totalVerses} verses`);
  console.log(`   Greek:  ${greekComplete} ${greekCount}/${totalVerses} verses`);
  console.log('');
}

console.log('✅ Completeness check finished!');
