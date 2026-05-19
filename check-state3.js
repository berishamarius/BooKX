// check-state3.js — show full BM JS to find back/toast texts
'use strict';
const fs = require('fs');

const frch = fs.readFileSync('dist-diebibel/french/bücher/001-gen.html', 'utf8');
const bmi = frch.indexOf('BM_KEY');
// Show 2000 chars of the BM script
console.log(frch.substring(bmi, bmi + 2000));
