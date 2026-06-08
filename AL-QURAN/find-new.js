'use strict';
const https = require('https');

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Finder/1.0' },
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const data = await apiGet('https://api.quran.com/api/v4/resources/translations?language=de');
  const all = data.translations || [];
  
  console.log('\n=== NEW LANGUAGES ===\n');
  
  const langs = ['spanish', 'french', 'tagalog', 'chinese'];
  for (const lang of langs) {
    const found = all.filter(t => (t.language_name || '').toLowerCase().includes(lang));
    console.log(lang.toUpperCase() + ':');
    if (found.length === 0) {
      console.log('  (keine gefunden)');
    } else {
      found.forEach(t => {
        console.log(`  ID: ${t.id}  |  ${t.name}  |  ${t.author_name || '(unknown)'}`);
      });
    }
    console.log();
  }
})().catch(e => console.error('Error:', e.message));
