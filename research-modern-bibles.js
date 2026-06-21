// Recherche: Moderne CC-lizenzierte Bibel-Übersetzungen

const MODERN_CC_BIBLES = {
  // Englisch
  'English': {
    old: 'King James (1611)',
    modern: [
      { name: 'World English Bible (WEB)', year: 2000, license: 'Public Domain', org: 'ebible.org' },
      { name: 'American Standard Version (ASV)', year: 1901, license: 'Public Domain', org: 'Various' },
      { name: 'Berean Standard Bible', year: 2016, license: 'CC BY-NC-ND 4.0', org: 'Bible Hub' }
    ],
    recommended: 'World English Bible'
  },
  
  // Deutsch
  'Deutsch': {
    old: 'Textbibel (1899)',
    modern: [
      { name: 'Schlachter 2000', year: 2000, license: 'Copyright (Geneva Bible Society)', note: 'Nicht CC' },
      { name: 'Elberfelder', year: 1905, license: 'Public Domain', org: 'Various' },
      { name: 'Luther 1912', year: 1912, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Elberfelder'
  },
  
  // Französisch
  'Français': {
    old: 'Crampon (1923)',
    modern: [
      { name: 'Louis Segond 1910', year: 1910, license: 'Public Domain', org: 'Various' },
      { name: 'Darby (French)', year: 1885, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Louis Segond'
  },
  
  // Spanisch
  'Español': {
    old: 'Reina-Valera (1909)',
    modern: [
      { name: 'Reina-Valera 1960', year: 1960, license: 'Copyright (Sociedades Bíblicas Unidas)', note: 'Nicht CC' },
      { name: 'Sagradas Escrituras 1569', year: 1569, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Reina-Valera 1909' // Bereits gut
  },
  
  // Polnisch
  'Polski': {
    old: 'Gdańska (1632)',
    modern: [
      { name: 'Biblia Warszawska', year: 1975, license: 'Copyright', note: 'Nicht CC' },
      { name: 'Uwspółcześniona Gdańska', year: 2017, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Uwspółcześniona Gdańska'
  },
  
  // Russisch
  'Русский': {
    old: 'Синодальный (1876)',
    modern: [
      { name: 'Современный Русский Перевод', year: 2011, license: 'Copyright (IBS)', note: 'Nicht CC' },
      { name: 'Synodal (1876)', year: 1876, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Synodal' // Bleibt, ist Standard
  },
  
  // Niederländisch
  'Nederlands': {
    old: 'Statenvertaling (1637)',
    modern: [
      { name: 'Het Boek', year: 1979, license: 'Copyright', note: 'Nicht CC' },
      { name: 'Nieuwe Bijbelvertaling', year: 2004, license: 'Copyright (NBG)', note: 'Nicht CC' }
    ],
    recommended: 'Statenvertaling' // Bleibt, keine freie moderne Alternative
  },
  
  // Ungarisch
  'Magyar': {
    old: 'Károli (1590)',
    modern: [
      { name: 'Károli Revisited (1908)', year: 1908, license: 'Public Domain', org: 'Various' },
      { name: 'Magyar Bibliatársulat (2014)', year: 2014, license: 'Copyright', note: 'Nicht CC' }
    ],
    recommended: 'Károli' // Bleibt Standard
  },
  
  // Tschechisch
  'Čeština': {
    old: 'Kralická (1613)',
    modern: [
      { name: 'Český ekumenický překlad', year: 1979, license: 'Copyright (ČBS)', note: 'Nicht CC' },
      { name: 'Kralická (1613)', year: 1613, license: 'Public Domain', org: 'Various' }
    ],
    recommended: 'Kralická' // Bleibt, ist historisch wichtig
  }
};

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  MODERNE CC-BIBEL RECHERCHE FÜR 9 ALTE ÜBERSETZUNGEN        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

let canUpdate = 0;
let keepOld = 0;

for (const [lang, data] of Object.entries(MODERN_CC_BIBLES)) {
  console.log(`\n📖 ${lang}`);
  console.log(`   Alt: ${data.old}`);
  console.log(`   Empfehlung: ${data.recommended}`);
  
  const hasModern = data.modern.some(m => 
    (m.year >= 1950 && m.license.includes('Public Domain')) || 
    m.license.includes('CC')
  );
  
  if (hasModern && data.recommended !== data.old.split('(')[0].trim()) {
    console.log(`   ✅ Kann auf modern updaten!`);
    canUpdate++;
  } else {
    console.log(`   ⚠️ Keine gute freie Alternative - alt bleibt`);
    keepOld++;
  }
}

console.log('\n' + '═'.repeat(65));
console.log(`\n📊 ERGEBNIS:`);
console.log(`   ${canUpdate} Sprachen: Moderne Alternative verfügbar`);
console.log(`   ${keepOld} Sprachen: Alte Version bleibt (keine bessere freie)`);

console.log(`\n💡 EMPFEHLUNG:`);
console.log(`   Die meisten alten Übersetzungen sind STANDARDS in ihrer Sprache!`);
console.log(`   Moderne Alternativen haben meist Copyright.`);
console.log(`   Besser: ZUSÄTZLICH moderne anbieten, alte BEHALTEN.\n`);

console.log('✅ BESTE STRATEGIE:');
console.log('   1. Alte Übersetzungen BEHALTEN (sind Klassiker)');
console.log('   2. Nur Übersetzer-Namen im Cover anzeigen');
console.log('   3. Später optional moderne ERGÄNZEN (nicht ersetzen)\n');

console.log('═'.repeat(65));

// Export für Cover-Update
const COVER_NAMES = {
  'King James': 'KJV 1611',
  'Textbibel': 'Kautzsch 1899',
  'Crampon': 'Crampon 1923',
  'Reina-Valera': 'RV 1909',
  'Gdańska': 'Gdańska 1632',
  'Синодальный': 'Synodal 1876',
  'Statenvertaling': 'SV 1637',
  'Károli': 'Károli 1590',
  'Kralická': 'Kralická 1613'
};

console.log('\n📝 ÜBERSETZER-NAMEN FÜR COVER (mit Jahr für Klarheit):');
for (const [key, value] of Object.entries(COVER_NAMES)) {
  console.log(`   ${key.padEnd(20)} → ${value}`);
}
