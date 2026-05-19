// check-state.js
'use strict';
const fs = require('fs');
const path = require('path');

// 1. French index topbar
const fr = fs.readFileSync('dist-diebibel/french/index.html', 'utf8');
const ti = fr.indexOf('back-cover');
console.log('French topbar:', fr.substring(ti-30, ti+70));

// 2. Check bookmark JS in a few non-German chapters (Bible)
const langs = ['french','italian','spanish','kjv','romanian','czech'];
langs.forEach(lang => {
  const p = `dist-diebibel/${lang}/bücher/001-gen.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const hasBM = c.includes('BM_KEY');
    const backText = (c.match(/back\.textContent\s*=\s*'([^']+)'/) || [])[1] || '?';
    const toastText = (c.match(/toast\.textContent\s*=\s*'([^']+)'/) || [])[1] || '?';
    console.log(`[${lang}] BM:${hasBM ? 'YES' : 'NO'} back='${backText}' toast='${toastText}'`);
  } catch(e) { console.log(`[${lang}] ERROR:`, e.message); }
});

// 3. Check Quran sura bookmark
const quranLangs = ['Albanisch','Englisch','Türkisch'];
quranLangs.forEach(lang => {
  const dir = `dist-alquran/Übersetzungen/${lang}/suren`;
  try {
    const files = fs.readdirSync(dir);
    const c = fs.readFileSync(path.join(dir, files[0]), 'utf8');
    const hasBM = c.includes('BM_KEY');
    const backText = (c.match(/back\.textContent\s*=\s*'([^']+)'/) || [])[1] || '?';
    const toastText = (c.match(/toast\.textContent\s*=\s*'([^']+)'/) || [])[1] || '?';
    console.log(`[Quran ${lang}] BM:${hasBM ? 'YES' : 'NO'} back='${backText}' toast='${toastText}'`);
  } catch(e) { console.log(`[Quran ${lang}] ERROR:`, e.message); }
});

// 4. Check Quran back-cover for Vorwort button
const qLangs = ['Albanisch','Englisch','Deutsch'];
qLangs.forEach(lang => {
  const p = `dist-alquran/Übersetzungen/${lang}/back-cover.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const hasVorwort = c.includes('vorwort') || c.includes('Vorwort');
    console.log(`[Quran back-cover ${lang}] hasVorwort:${hasVorwort}`);
    if (hasVorwort) {
      const vi = c.indexOf('orwort');
      console.log('  context:', c.substring(Math.max(0,vi-30), vi+80));
    }
  } catch(e) { console.log(`[Quran back-cover ${lang}] ERROR:`, e.message); }
});

// 5. Check Bible cover bookmark overlay - back button text
const covLangs = ['french','italian','spanish','kjv'];
covLangs.forEach(lang => {
  const p = `dist-diebibel/${lang}/cover.html`;
  try {
    const c = fs.readFileSync(p, 'utf8');
    const hasBM = c.includes('BM_KEY');
    const backText = (c.match(/back\.textContent\s*=\s*'([^']+)'/) || [])[1] || '?';
    console.log(`[cover ${lang}] BM:${hasBM ? 'YES':'NO'} back='${backText}'`);
  } catch(e) { console.log(`[cover ${lang}] ERROR:`, e.message); }
});
