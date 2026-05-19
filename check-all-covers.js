// check-all-covers.js
'use strict';
const fs = require('fs');

console.log('=== Bible covers ===');
const bLangs = ['albanian','croatian','czech','dutch','french','hungarian','italian','kjv','polish','portuguese','romanian','russian','spanish','swedish','tagalog','ukrainian'];
bLangs.forEach(lang => {
  const p = `dist-diebibel/${lang}/cover.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const btnMatch = c.match(/btn\.textContent\s*=\s*'([^']+)'/);
    const titleMatch = c.match(/back\.title\s*=\s*'([^']+)'/);
    const backTextMatch = c.match(/back\.textContent\s*=\s*'([^']+)'/);
    console.log(`[${lang}] btn='${btnMatch&&btnMatch[1]||'?'}' backTitle='${titleMatch&&titleMatch[1]||'?'}' backText='${backTextMatch&&backTextMatch[1]||'?'}'`);
  } catch(e) { console.log(`[${lang}] ERROR:`, e.message); }
});

console.log('\n=== Quran covers ===');
const qLangs = ['Albanisch','Bengalisch','Bosnisch','Chinesisch','Deutsch','Englisch','Hausa','Hindi','Indonesisch','Persisch','Russisch','Türkisch','Urdu','Uygurisch'];
qLangs.forEach(lang => {
  const p = `dist-alquran/Übersetzungen/${lang}/cover.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const btnMatch = c.match(/btn\.textContent\s*=\s*'([^']+)'/);
    const titleMatch = c.match(/back\.title\s*=\s*'([^']+)'/);
    console.log(`[${lang}] btn='${btnMatch&&btnMatch[1]||'?'}' backTitle='${titleMatch&&titleMatch[1]||'?'}'`);
  } catch(e) { console.log(`[${lang}] ERROR:`, e.message); }
});

console.log('\n=== Quran back-covers ===');
qLangs.forEach(lang => {
  const p = `dist-alquran/Übersetzungen/${lang}/back-cover.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const hasVorwort = /nav-b|vorwort/i.test(c);
    if (hasVorwort) {
      const vi = c.search(/nav-b|vorwort/i);
      console.log(`[${lang}] HAS nav-b/vorwort:`, JSON.stringify(c.substring(Math.max(0,vi-10), vi+60)));
    }
  } catch(e) {}
});

console.log('\n=== Checking non-German chapters have BM ===');
const sampleFiles = [
  'dist-diebibel/albanian/bücher/001-gen.html',
  'dist-diebibel/croatian/bücher/001-gen.html',
  'dist-diebibel/dutch/bücher/001-gen.html',
  'dist-diebibel/hungarian/bücher/001-gen.html',
  'dist-diebibel/polish/bücher/001-gen.html',
  'dist-diebibel/portuguese/bücher/001-gen.html',
  'dist-diebibel/romanian/bücher/001-gen.html',
  'dist-diebibel/russian/bücher/001-gen.html',
  'dist-diebibel/swedish/bücher/001-gen.html',
  'dist-diebibel/tagalog/bücher/001-gen.html',
  'dist-diebibel/ukrainian/bücher/001-gen.html',
];
sampleFiles.forEach(p => {
  try {
    const c = fs.readFileSync(p, 'utf8');
    const lang = p.split('/')[1];
    console.log(`[${lang}] BM:${c.includes('BM_KEY')?'YES':'MISSING'}`);
  } catch(e) { console.log(p, 'ERROR:', e.message); }
});

console.log('\n=== Quran suras BM check ===');
const qSuraLangs = ['Albanisch','Bengalisch','Bosnisch','Chinesisch','Englisch','Hausa','Hindi','Indonesisch','Persisch','Russisch','Türkisch','Urdu','Uygurisch'];
qSuraLangs.forEach(lang => {
  const dir = `dist-alquran/Übersetzungen/${lang}/suren`;
  try {
    const files = fs.readdirSync(dir);
    const c = fs.readFileSync(`${dir}/${files[0]}`, 'utf8');
    const toastMatch = c.match(/showToast\(['"]([^'"]+)['"]\)/);
    console.log(`[Quran ${lang}] BM:${c.includes('BM_KEY')?'YES':'MISSING'} toast='${toastMatch&&toastMatch[1]||'?'}'`);
  } catch(e) { console.log(`[Quran ${lang}] ERROR:`, e.message); }
});
