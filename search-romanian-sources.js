/**
 * SEARCH FOR ROMANIAN CORNILESCU SOURCES
 * Check various online repositories
 */

const https = require('https');

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      resolve({ name, status: res.statusCode, ok: res.statusCode === 200 });
    }).on('timeout', () => {
      resolve({ name, status: 0, ok: false });
    }).on('error', () => {
      resolve({ name, status: 0, ok: false });
    });
  });
}

async function main() {
  console.log('SEARCHING FOR ROMANIAN CORNILESCU SOURCES:\n');
  
  const sources = [
    ['GitHub - eBible', 'https://raw.githubusercontent.com/BibleNLP/ebible/main/corpus/ron-x-bible-cornilescu.txt'],
    ['GitHub - Bible-API', 'https://raw.githubusercontent.com/seven1m/open-bibles/master/bibles/ro_cornilescu.json'],
    ['SWORD Project', 'https://www.crosswire.org/sword/modules/ModDisp.jsp?modType=Bibles&modName=RoCornilescu'],
    ['UnBound Bible', 'https://unbound.biola.edu/downloads/romanian_cornilescu.zip'],
    ['GitHub - Holman-CSB', 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/ro_cornilescu.json'],
  ];
  
  for (const [name, url] of sources) {
    process.stdout.write(`${name.padEnd(30, ' ')}: `);
    const result = await checkUrl(url, name);
    console.log(result.ok ? `✓ (${result.status})` : `✗ (${result.status})`);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('\n💡 SOLUTION: Use existing data from CATHOLIC-BIBLE project');
  console.log('   OR manually download Cornilescu from source and import\n');
}

main();
