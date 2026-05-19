const fs=require('fs');

function check(label, file, searchStr) {
  try {
    const content=fs.readFileSync(file,'utf8');
    const idx=content.indexOf(searchStr);
    console.log(label+':', idx>-1 ? 'OK \u2713' : 'MISSING \u2717');
    if(idx>-1) console.log('  '+content.substring(idx,idx+80).replace(/\n/g,' '));
  } catch(e) { console.log(label+': ERROR -',e.message); }
}

// 1. Protestant drop-cap in French chapter
check('Protestant drop-cap French', 
  'dist-diebibel/french/b\u00FCcher/001-gen.html',
  "protestant] .vb.first .base-p::first-letter");

// 2. Protestant .base-p font in Spanish chapter
check('Protestant base-p Spanish', 
  'dist-diebibel/spanish/b\u00FCcher/001-gen.html',
  ".base-p{font-family:'UnifrakturMaguntia'");

// 3. Bookmark JS in Italian chapter
check('Bookmark JS Italian',
  'dist-diebibel/italian/b\u00FCcher/001-gen.html',
  'BM_KEY');

// 4. Bookmark toast text Italian
check('Toast Italian',
  'dist-diebibel/italian/b\u00FCcher/001-gen.html',
  'Segnalibro');

// 5. Bookmark JS in KJV chapter
check('Bookmark JS KJV',
  'dist-diebibel/kjv/b\u00FCcher/001-gen.html',
  'BM_KEY');

// 6. Bookmark JS in Quran English sura
check('Bookmark JS Quran Englisch',
  'dist-alquran/\u00DCbersetzungen/Englisch/suren/001-Al-Fatihah.html',
  'BM_KEY');

// 7. Bookmark JS in Quran Albanian sura
check('Bookmark JS Quran Albanisch',
  'dist-alquran/\u00DCbersetzungen/Albanisch/suren/001-Al-Fatihah.html',
  'BM_KEY');

// 8. Bookmark display on French Bible cover
check('Cover bookmark French',
  'dist-diebibel/french/cover.html',
  'KX_bookmark');

// 9. Bookmark display on Quran Albanian cover
check('Cover bookmark Quran Albanisch',
  'dist-alquran/\u00DCbersetzungen/Albanisch/cover.html',
  'KX_bookmark');

// 10. Italian index - Italian button labels
check('Italian index Cattolico',
  'dist-diebibel/italian/index.html',
  'Cattolico');

// 11. Italian index - Cap. not Kap.
check('Italian index Cap.',
  'dist-diebibel/italian/index.html',
  'Cap.</span>');

// 12. Italian index - Italian tname (Genesi)
check('Italian index Genesi',
  'dist-diebibel/italian/index.html',
  '>Genesi<');

// 13. Italian index - deuterocanonical books
check('Italian index Tobia',
  'dist-diebibel/italian/index.html',
  '>Tobia<');

// 14. German Quran back-cover - reduced font
check('Quran back-cover font reduced',
  'dist-alquran/back-cover.html',
  '.62rem');

// 15. German Bible chapter unchanged (already had bookmark)
check('German chapter has BM_KEY',
  'dist-diebibel/german/b\u00FCcher/001-gen.html',
  'BM_KEY');
