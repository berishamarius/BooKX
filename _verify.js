const fs=require('fs');
const enPath='dist-alquran/\u00DCbersetzungen/Englisch/back-cover.html';
const en=fs.readFileSync(enPath,'utf8');
const fsize=en.match(/font-size:[^;]+;/g)||[];
console.log('=== English Quran back-cover font-sizes ===');
fsize.forEach(f=>console.log(' ',f));

const de=fs.readFileSync('dist-alquran/back-cover.html','utf8');
const deSize=de.match(/font-size:[^;]+;/g)||[];
console.log('\n=== German Quran back-cover font-sizes ===');
deSize.forEach(f=>console.log(' ',f));










