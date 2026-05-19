// verify-arc.js
'use strict';
const fs = require('fs');

// French Bible
const fr = fs.readFileSync('dist-diebibel/french/bücher/001-gen.html', 'utf8');
const ai = fr.indexOf('arc-back');
console.log('=== French Bible chapter arc-back ===');
console.log(fr.substring(Math.max(0, ai-15), ai + 130));

// English Quran
const dir = 'dist-alquran/Übersetzungen/Englisch/suren';
const files = fs.readdirSync(dir);
const en = fs.readFileSync(`${dir}/${files[0]}`, 'utf8');
const qi = en.indexOf('arc-back');
console.log('\n=== English Quran sura arc-back ===');
console.log(en.substring(Math.max(0, qi-15), qi + 130));

// Urdu Quran (RTL)
const urdu = fs.readFileSync(`dist-alquran/Übersetzungen/Urdu/suren/${fs.readdirSync('dist-alquran/Übersetzungen/Urdu/suren')[0]}`, 'utf8');
const ui = urdu.indexOf('arc-back');
console.log('\n=== Urdu Quran arc-back ===');
console.log(urdu.substring(Math.max(0, ui-10), ui + 130));

// Russian Bible
const ru = fs.readFileSync('dist-diebibel/russian/bücher/001-gen.html', 'utf8');
const ri = ru.indexOf('arc-back');
console.log('\n=== Russian Bible arc-back ===');
console.log(ru.substring(Math.max(0, ri-10), ri + 130));
