const fs=require('fs');
// Check Protestant rules in French chapter
const fr=fs.readFileSync('dist-diebibel/french/b\u00FCcher/001-gen.html','utf8');
const pRules=(fr.match(/\[data-conf="protestant"\]/g)||[]).length;
console.log('French chapter protestant rules:',pRules);
const pIdx=fr.lastIndexOf('[data-conf="protestant"]');
console.log('Last protestant rule:',fr.substring(pIdx,pIdx+100));
// Check bookmark JS in French chapter
console.log('French BM_KEY:',fr.indexOf('BM_KEY'));
// Check Quran English sura bookmark
const qen=fs.readFileSync('dist-alquran/\u00dcbersetzungen/Englisch/suren/001-Al-Fatihah.html','utf8');
console.log('Quran English BM_KEY:',qen.indexOf('BM_KEY'));
// Check French cover has bookmark overlay
const fcov=fs.readFileSync('dist-diebibel/french/cover.html','utf8');
console.log('French cover KX_bookmark:',fcov.indexOf('KX_bookmark'));
// Check Quran German cover has overlay
const qde=fs.readFileSync('dist-alquran/\u00dcbersetzungen/Deutsch/cover.html','utf8');
console.log('Quran Deutsch cover KX_bookmark:',qde.indexOf('KX_bookmark'));
