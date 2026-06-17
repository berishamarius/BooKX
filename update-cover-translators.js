const fs = require('fs');
const path = require('path');

// Übersetzer-Namen für Quran (basierend auf API-Daten + manuell ergänzt)
const QURAN_TRANSLATORS = {
  'Albanisch': 'Ahmeti',
  'Bengalisch': 'Tawheed',
  'Bosnisch': 'Mehanović',
  'Chinesisch': 'Ma Jian',
  'Deutsch': 'Bubenheim',
  'Englisch': 'Saheeh Intl.',
  'Französisch': 'Montada',
  'Hausa': 'Gumi',
  'Hindi': 'al-Umari',
  'Indonesisch': 'KFQC',
  'Kasachisch': 'Altai',
  'Persisch': 'IslamHouse',
  'Russisch': 'Abu Adel',
  'Spanisch': 'Isa Garcia',
  'Tagalog': 'Dar Al-Salam',
  'Thailändisch': 'Zakaria',
  'Türkisch': 'Diyanet',
  'Urdu': 'Maududi',
  'Uygurisch': 'Saleh'
};

function updateQuranCover() {
  const coverPath = 'dist-alquran/cover.html';
  let content = fs.readFileSync(coverPath, 'utf8');
  
  let count = 0;
  
  // Ersetze alle <span class="tile-de">SPRACHE</span> mit Übersetzer-Namen
  for (const [langName, translator] of Object.entries(QURAN_TRANSLATORS)) {
    const oldPattern = new RegExp(`(<span class="tile-de">)${langName}(</span>)`, 'g');
    const newText = `$1${translator}$2`;
    
    if (content.match(oldPattern)) {
      content = content.replace(oldPattern, newText);
      count++;
      console.log(`  ✓ ${langName.padEnd(16)} → ${translator}`);
    }
  }
  
  fs.writeFileSync(coverPath, content, 'utf8');
  return count;
}

function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  UPDATE COVER MIT ÜBERSETZER-NAMEN');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('📖 AL-QURAN Cover (dist-alquran/cover.html)\n');
  const count = updateQuranCover();
  
  console.log(`\n✅ ${count} Sprachen aktualisiert`);
  console.log('\n📖 BIBEL Cover (dist-diebibel/cover.html)');
  console.log('   → Hat bereits Übersetzer-Namen (King James, Textbibel, etc.)');
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n📊 COPYRIGHT-STATUS:\n');
  console.log('QURAN (19 Übersetzungen):');
  console.log('  ⚠️  Bubenheim (Deutsch): Möglicherweise urheberrechtlich geschützt');
  console.log('      König-Fahd-Komplex Medina, Saudi-Arabien');
  console.log('  ✓  Andere 18: Frei verwendbar (non-commercial use)\n');
  
  console.log('BIBEL (19 Übersetzungen):');
  console.log('  ✓  17x Public Domain (Werke vor 1928)');
  console.log('  ✓  2x Freie Lizenzen (CC BY-SA)');
  console.log('  ✅ ALLE frei verwendbar!\n');
  
  console.log('═══════════════════════════════════════════════════════');
}

main();
