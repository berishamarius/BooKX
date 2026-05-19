// check-backcov.js — show actual link element (not just CSS) in Quran back-covers
'use strict';
const fs = require('fs');
const qLangs = ['Albanisch','Deutsch','Englisch','Türkisch'];
qLangs.forEach(lang => {
  const p = `dist-alquran/Übersetzungen/${lang}/back-cover.html`;
  const c = fs.readFileSync(p, 'utf8');
  // Find <a elements
  const links = [...c.matchAll(/<a\s[^>]+>/gi)].map(m => m[0]);
  console.log(`[${lang}] links:`, links.join(' | '));
  // Also show last 200 chars (body area)
  console.log(`[${lang}] body end:`, JSON.stringify(c.substring(c.length-250)));
});
