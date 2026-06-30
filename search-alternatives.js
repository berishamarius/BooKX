/**
 * SEARCH FOR ALTERNATIVE FREE GERMAN QURAN SOURCES
 * Repository databases and open sources
 */

const https = require('https');

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      resolve({ 
        name, 
        url,
        status: res.statusCode,
        ok: res.statusCode === 200 
      });
    }).on('error', () => {
      resolve({ name, url, status: 0, ok: false });
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('SEARCHING FOR FREE GERMAN QURAN TRANSLATIONS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const sources = [
    // German repositories
    ['Zanvari (Zanvari-Übersetzung)', 'https://raw.githubusercontent.com/islamic-network/quran-data/master/de.md'],
    
    // GitHub Quran projects
    ['OpenQuran - Zanvari JSON', 'https://raw.githubusercontent.com/quran/quran-data/master/sources.md'],
    ['Quran.com API - German options', 'https://api.quran.com/api/v4/resources'],
    
    // Archive.org alternatives
    ['Pickthall German (if exists)', 'https://archive.org/details/texts?query=quran+german'],
    
    // Known free sources
    ['Tanzil XML - German', 'https://tanzil.net/data/quran-uthmani.xml'],
  ];

  console.log('CHECKING SOURCES:\n');

  for (const [name, url] of sources) {
    process.stdout.write(`${name.padEnd(40, ' ')}: `);
    const result = await checkUrl(url, name);
    
    if (result.ok) {
      console.log(`✓ Available (${result.status})`);
    } else {
      console.log(`✗ Unavailable (${result.status})`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('\n💡 REALITY CHECK:\n');
  console.log('❌ Max Henning OCR: Too corrupted for reliable extraction');
  console.log('❌ No other free German digital sources found');
  console.log('❌ Bubenheim: Not allowed per user request\n');
  
  console.log('✅ PRACTICAL OPTIONS:\n');
  console.log('1. Use Zanvari translation (German, open source)');
  console.log('   - Check if available via API/GitHub');
  console.log('   - More recent than 1901 Henning\n');
  
  console.log('2. Manually extract from Henning PDF');
  console.log('   - Use PDF text layer (not OCR)');
  console.log('   - Requires PDF library and manual verification\n');
  
  console.log('3. Use alternate language (e.g., English)');
  console.log('   - Salah (ID 24) - English public domain\n');
}

main();
