// check-covers2.js — show the CONTINUE button text and full overlay for French and Quran
'use strict';
const fs = require('fs');

// French cover full script
const fr = fs.readFileSync('dist-diebibel/french/cover.html', 'utf8');
const si = fr.lastIndexOf('<script>');
console.log('=== French cover full script ===');
console.log(fr.substring(si));

// Quran German cover
const qde = fs.readFileSync('dist-alquran/Übersetzungen/Deutsch/cover.html', 'utf8');
const qsi = qde.lastIndexOf('<script>');
console.log('\n=== Quran Deutsch cover full script ===');
console.log(qde.substring(qsi));
