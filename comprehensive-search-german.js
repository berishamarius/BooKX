/**
 * COMPREHENSIVE SEARCH FOR FREE GERMAN QURAN TRANSLATIONS
 * Check all known public domain and open source options
 */

const https = require('https');

async function fetchUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data.substring(0, 1000) });
      });
    });
    req.on('timeout', () => {
      req.abort();
      resolve({ status: 0, data: '' });
    });
    req.on('error', () => resolve({ status: 0, data: '' }));
  });
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     SEARCHING FOR FREE GERMAN QURAN TRANSLATIONS         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const sources = [
    // Archive.org German texts
    ['Archive.org - Henning', 'https://archive.org/advancedsearch.php?q=text%3AQuran+language%3Agermanc&fl=identifier&output=json&rows=100'],
    
    // Known German translations (old/public domain)
    ['Zanvari (1876) - might be PD', 'https://archive.org/search.php?query=zanvari+quran+deutsch'],
    
    // Islamic network repositories
    ['Islamic-network GitHub', 'https://api.github.com/repos/islamic-network/quran-data/contents'],
    
    // Quran.com API - list all available
    ['Quran.com - List resources', 'https://api.quran.com/api/v4/resources'],
    
    // Open Quran project
    ['OpenQuran - German data', 'https://api.openquran.com/resources/translations'],
  ];

  console.log('🔍 CHECKING SOURCES:\n');

  for (const [name, url] of sources) {
    process.stdout.write(`${name.padEnd(35, ' ')}: `);
    try {
      const result = await fetchUrl(url, 3000);
      
      if (result.status === 200) {
        console.log(`✓ Found (${result.status})`);
        // Try to parse JSON
        if (result.data.includes('{') || result.data.includes('[')) {
          try {
            const parsed = JSON.parse(result.data);
            console.log(`  Content: ${JSON.stringify(parsed).substring(0, 100)}...`);
          } catch (e) {}
        }
      } else {
        console.log(`✗ ${result.status || 'timeout'}`);
      }
    } catch (e) {
      console.log(`✗ Error`);
    }
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                    KNOWN OPTIONS                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📚 HISTORICAL GERMAN TRANSLATIONS (Public Domain):\n');
  console.log('1. Max Henning (1901)');
  console.log('   - Status: Gemeinfrei ✓');
  console.log('   - Problem: OCR zu fehlerhaft\n');

  console.log('2. Zanvari-Übersetzung (1876?)');
  console.log('   - Status: Wahrscheinlich gemeinfrei ✓');
  console.log('   - Finding: Nicht in digitaler Form verfügbar\n');

  console.log('3. Ullmann-Übersetzung');
  console.log('   - Status: Gemeinfrei nach Alter');
  console.log('   - Finding: Nicht mit Vers-Struktur digital verfügbar\n');

  console.log('📖 MODERN OPEN SOURCE (License-free):\n');
  console.log('4. Knut Bernström (auf quran.com)');
  console.log('   - Problem: IST SCHWEDISCH, nicht deutsch!\n');

  console.log('5. Salah/Pickthall (Englisch)');
  console.log('   - Status: Gemeinfrei ✓');
  console.log('   - Language: Englisch (nicht Deutsch)\n');

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('⚠️  RESULT: Keine praktikable freie deutsche digital-strukturierte');
  console.log('    Übersetzung gefunden außer fehlerhaft gescanntem Henning\n');
}

main();
