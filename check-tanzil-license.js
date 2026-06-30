/**
 * CHECK TANZIL ZAIDAN LICENSE AND AVAILABILITY
 */

const https = require('https');

async function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         CHECKING TANZIL ZAIDAN TRANSLATION              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // Check multiple Tanzil resources
  const urls = [
    'https://tanzil.net/docs/terms',
    'https://tanzil.net/docs/translations',
    'https://tanzil.net/docs/',
  ];

  console.log('1️⃣  Checking license information...\n');

  for (const url of urls) {
    console.log(`Fetching: ${url}`);
    const data = await fetchUrl(url);
    
    if (data.length > 100) {
      // Look for license info
      if (data.toLowerCase().includes('license') || 
          data.toLowerCase().includes('copyright') ||
          data.toLowerCase().includes('zaidan') ||
          data.toLowerCase().includes('freely')) {
        
        const lines = data.split('\n').filter(l => 
          l.toLowerCase().includes('zaidan') ||
          l.toLowerCase().includes('license') ||
          l.toLowerCase().includes('free')
        );
        
        if (lines.length > 0) {
          console.log('✓ Found relevant info:\n');
          lines.slice(0, 5).forEach(line => {
            console.log(`  ${line.substring(0, 100)}`);
          });
        }
      }
    }
    console.log();
  }

  console.log('2️⃣  Direct API check for Zaidan data...\n');

  // Try Tanzil API
  const apiUrls = [
    'https://tanzil.net/api/v0/verse/19:1/editions/de.zaidan',
    'https://tanzil.net/api/v1/resources',
    'https://tanzil.net/res/text/editions/de.zaidan.txt',
  ];

  for (const url of apiUrls) {
    process.stdout.write(`${url.split('/').pop().padEnd(30, ' ')}: `);
    try {
      const result = await fetch(url, { timeout: 3000 });
      if (result.ok) {
        console.log(`✓ Available`);
      } else {
        console.log(`✗ ${result.statusCode}`);
      }
    } catch (e) {
      console.log(`✗ Error`);
    }
  }
}

// Simple fetch polyfill for node
async function fetch(url, opts) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ ok: res.statusCode === 200, statusCode: res.statusCode, data }));
    }).on('error', () => resolve({ ok: false }));
  });
}

main();
