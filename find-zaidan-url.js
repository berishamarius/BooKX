/**
 * FIND CORRECT TANZIL DOWNLOAD URL FOR ZAIDAN
 */

const https = require('https');

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve({ name, url, status: res.statusCode, size });
      });
    }).on('error', () => resolve({ name, url, status: 0, size: 0 }));
  });
}

async function main() {
  const urls = [
    ['Tanzil base format', 'https://tanzil.net/res/text/editions/de.zaidan.txt'],
    ['Tanzil downloads', 'https://tanzil.net/download/quran/de.zaidan'],
    ['With aya numbers', 'https://tanzil.net/download/quran/de.zaidan/text-uthmani-with-aya-numbers'],
    ['Simple text', 'https://tanzil.net/download/de.zaidan'],
    ['Direct Tanzil', 'https://tanzil.net/trans/de.zaidan'],
  ];

  console.log('Checking Tanzil URLs:\n');

  for (const [name, url] of urls) {
    process.stdout.write(`${name.padEnd(30, ' ')}: `);
    const result = await checkUrl(url, name);
    
    if (result.status === 200) {
      console.log(`✓ ${result.status} - ${(result.size / 1024).toFixed(1)} KB`);
    } else {
      console.log(`✗ ${result.status}`);
    }
  }
}

main();
