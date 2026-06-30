/**
 * TEST MULTIPLE ROMANIAN BIBLE APIs
 * Try different sources for Cornilescu (1921)
 */

const https = require('https');

async function testAPI(name, url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ name, status: res.statusCode, size: data.length, sample: data.substring(0, 200) });
      });
    }).on('error', (e) => {
      resolve({ name, status: 0, error: e.message });
    }).on('timeout', () => {
      resolve({ name, status: 0, error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        TESTING ROMANIAN BIBLE APIs (CORNILESCU)          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const sources = [
    ['BibleAPI.com', 'https://bible-api.com/genesis+1:1?translation=cornilescu'],
    ['API.Bible (needs key)', 'https://api.scripture.api.bible/v1/bibles'],
    ['Biblia.com', 'https://api.biblia.com/v1/bible/content/cornilescu.json?passage=Genesis1'],
    ['eBible.org', 'https://ebible.org/api/rom1912_Genisis_1.json'],
    ['BibleGateway (scrape)', 'https://www.biblegateway.com/passage/?search=Genesis+1&version=RMNN'],
  ];

  for (const [name, url] of sources) {
    process.stdout.write(`${name.padEnd(30, ' ')}: `);
    const result = await testAPI(name, url);
    
    if (result.status === 200) {
      console.log(`✓ ${result.status} (${result.size} bytes)`);
      if (result.sample) console.log(`  Sample: ${result.sample.substring(0, 100)}...`);
    } else {
      console.log(`✗ ${result.error || result.status}`);
    }
    
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('\n💡 FALLBACK OPTIONS:\n');
  console.log('1. Check if Romanian JSON files exist locally');
  console.log('2. Use existing Italian/French structure as template');
  console.log('3. Extract from Romanian txt files if available');
  console.log('4. API with authentication key\n');
}

main();
