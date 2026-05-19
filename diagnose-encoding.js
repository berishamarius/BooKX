// diagnose-encoding.js — identify all unique corruption patterns
'use strict';
const fs = require('fs');
const path = require('path');

const TRIPLE = '\u00CF\u00BF\u00BD'; // the "Ï¿½" corruption pattern

function getContext(content, pattern, contextLen=30) {
  const results = [];
  let idx = 0;
  while ((idx = content.indexOf(pattern, idx)) !== -1) {
    results.push(content.substring(Math.max(0, idx - contextLen), idx + pattern.length + contextLen));
    idx++;
  }
  return results;
}

const langs = ['albanian','croatian','czech','dutch','french','hungarian','italian','kjv','polish','portuguese','romanian','russian','spanish','swedish','tagalog','ukrainian'];

console.log('=== Looking for TRIPLE Ï¿½ (U+00CF U+00BF U+00BD) ===');
const allPatterns = new Set();

for (const lang of langs) {
  // Check index
  try {
    const c = fs.readFileSync(`dist-diebibel/${lang}/index.html`, 'utf8');
    if (c.includes(TRIPLE)) {
      const ctxs = getContext(c, TRIPLE, 20);
      ctxs.forEach(ctx => {
        allPatterns.add(ctx.replace(TRIPLE, '<CORRUPT>'));
        console.log(`  [${lang} index]`, JSON.stringify(ctx));
      });
    }
  } catch(e) {}

  // Check one chapter
  const buchDir = `dist-diebibel/${lang}/b\u00FCcher`;
  try {
    const files = fs.readdirSync(buchDir);
    if (files.length > 0) {
      const c = fs.readFileSync(path.join(buchDir, files[0]), 'utf8');
      if (c.includes(TRIPLE)) {
        const ctxs = getContext(c, TRIPLE, 25);
        ctxs.slice(0, 5).forEach(ctx => {
          allPatterns.add(ctx.replace(new RegExp(TRIPLE.split('').map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join(''),'g'), '<CORRUPT>'));
          console.log(`  [${lang} ch1]`, JSON.stringify(ctx));
        });
      }
    }
  } catch(e) {}
}

// Also check for single U+FFFD in Spanish chapters
console.log('\n=== Looking for single U+FFFD in Spanish chapters ===');
const FFFD = '\uFFFD';
const spDir = `dist-diebibel/spanish/b\u00FCcher`;
try {
  const files = fs.readdirSync(spDir).slice(0, 2);
  for (const f of files) {
    const c = fs.readFileSync(path.join(spDir, f), 'utf8');
    if (c.includes(FFFD)) {
      const ctxs = getContext(c, FFFD, 20);
      ctxs.slice(0, 3).forEach(ctx => console.log(`  [spanish/${f}]`, JSON.stringify(ctx)));
    }
    if (c.includes(TRIPLE)) {
      const ctxs = getContext(c, TRIPLE, 20);
      ctxs.slice(0, 3).forEach(ctx => console.log(`  [spanish/${f} TRIPLE]`, JSON.stringify(ctx)));
    }
  }
} catch(e) { console.log('Spanish err:', e.message); }

// Check German chapter for correct CSS (no corruption)
console.log('\n=== German chapter title (reference) ===');
const deDir = `dist-diebibel/german/b\u00FCcher`;
try {
  const files = fs.readdirSync(deDir);
  if (files.length > 0) {
    const c = fs.readFileSync(path.join(deDir, files[0]), 'utf8');
    const ti = c.indexOf('<title>');
    const te = c.indexOf('</title>');
    console.log('German title:', JSON.stringify(c.substring(ti, te+8)));
    // Look for .bhead or any CSS
    const bhi = c.indexOf('.bhead');
    if (bhi >= 0) console.log('German .bhead CSS:', JSON.stringify(c.substring(Math.max(0,bhi-40), bhi+60)));
  }
} catch(e) { console.log('German err:', e.message); }
