const fs = require('fs');
const { execSync } = require('child_process');

// Check German .tra CSS
const de = fs.readFileSync('dist-diebibel/german/b\u00FCcher/001-gen.html', 'utf8');
const deSt = de.match(/<style>([\s\S]*?)<\/style>/)[1];
const traCSS = deSt.match(/\.tra[\s\S]{0,200}/);
console.log('German .tra CSS:', traCSS ? traCSS[0].substring(0,200) : 'NOT FOUND');

// Check French .tra CSS
const fr = fs.readFileSync('dist-diebibel/french/b\u00FCcher/001-gen.html', 'utf8');
const frSt = fr.match(/<style>([\s\S]*?)<\/style>/)[1];
const frTraCSS = frSt.match(/\.tra[\s\S]{0,200}/);
console.log('French .tra CSS:', frTraCSS ? frTraCSS[0].substring(0,200) : 'NOT FOUND');

// Check French first verse - show the vb and tra content
const frVb = fr.match(/<div class="vb[^"]*"[^>]*id="v1-1"[\s\S]{0,600}/);
console.log('\nFrench v1-1 vb:');
console.log(frVb ? frVb[0].substring(0,500) : 'NOT FOUND');

// Check blatin-p CSS rule
const frBlatinCSS = frSt.match(/\.blatin[\s\S]{0,400}/);
console.log('\nFrench .blatin CSS:', frBlatinCSS ? frBlatinCSS[0].substring(0,300) : 'NOT FOUND');
