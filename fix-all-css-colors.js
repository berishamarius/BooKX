/**
 * fix-all-css-colors.js
 * Fix ALL non-German chapter files to match German CSS exactly:
 * 1. .tra color: #E8C547 -> #F5F2EA (white/cream like German)
 * 2. .tra border-left: match German rgba(245,242,234,.35)
 * 3. Fix garbled chars in .blatin (encoding -> HTML entities)
 */

const fs = require('fs');
const path = require('path');

const DIST = 'dist-diebibel';

// Map of Unicode code points to HTML entities for accented chars
function toEntity(ch) {
  const cp = ch.codePointAt(0);
  if (cp > 127) {
    const named = {
      0xC0:'&Agrave;',0xC1:'&Aacute;',0xC2:'&Acirc;',0xC3:'&Atilde;',
      0xC4:'&Auml;',0xC5:'&Aring;',0xC6:'&AElig;',0xC7:'&Ccedil;',
      0xC8:'&Egrave;',0xC9:'&Eacute;',0xCA:'&Ecirc;',0xCB:'&Euml;',
      0xCC:'&Igrave;',0xCD:'&Iacute;',0xCE:'&Icirc;',0xCF:'&Iuml;',
      0xD1:'&Ntilde;',0xD2:'&Ograve;',0xD3:'&Oacute;',0xD4:'&Ocirc;',
      0xD5:'&Otilde;',0xD6:'&Ouml;',0xD8:'&Oslash;',
      0xD9:'&Ugrave;',0xDA:'&Uacute;',0xDB:'&Ucirc;',0xDC:'&Uuml;',
      0xDD:'&Yacute;',0xDF:'&szlig;',
      0xE0:'&agrave;',0xE1:'&aacute;',0xE2:'&acirc;',0xE3:'&atilde;',
      0xE4:'&auml;',0xE5:'&aring;',0xE6:'&aelig;',0xE7:'&ccedil;',
      0xE8:'&egrave;',0xE9:'&eacute;',0xEA:'&ecirc;',0xEB:'&euml;',
      0xEC:'&igrave;',0xED:'&iacute;',0xEE:'&icirc;',0xEF:'&iuml;',
      0xF1:'&ntilde;',0xF2:'&ograve;',0xF3:'&oacute;',0xF4:'&ocirc;',
      0xF5:'&otilde;',0xF6:'&ouml;',0xF8:'&oslash;',
      0xF9:'&ugrave;',0xFA:'&uacute;',0xFB:'&ucirc;',0xFC:'&uuml;',
      0xFD:'&yacute;',
    };
    if (named[cp]) return named[cp];
    return '&#' + cp + ';';
  }
  return ch;
}

function encodeForBlatin(text) {
  if (!/[^\x00-\x7E]/.test(text)) return text;
  return [...text].map(ch => toEntity(ch)).join('');
}

let totalFixed = 0;
let totalFiles = 0;

const langs = fs.readdirSync(DIST).filter(d => {
  const full = path.join(DIST, d);
  try {
    return fs.statSync(full).isDirectory() && d !== 'german' && d !== 'node_modules';
  } catch(e) { return false; }
});

console.log(`Processing ${langs.length} languages: ${langs.join(', ')}`);

for (const lang of langs) {
  const bDir = path.join(DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bDir)) continue;

  const files = fs.readdirSync(bDir).filter(f => f.endsWith('.html'));
  let langFixed = 0;

  for (const file of files) {
    const fp = path.join(bDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let changed = false;

    // 1. Fix .tra color: #E8C547 -> #F5F2EA (white/cream like German)
    // and fix border-left rgba to match German
    html = html.replace(/\.tra\{([\s\S]*?)\}/g, (match, body) => {
      let newBody = body;
      if (/color:#E8C547/i.test(newBody)) {
        newBody = newBody.replace(/color:#E8C547/gi, 'color:#F5F2EA');
        changed = true;
      }
      if (/border-left:2px solid rgba\(/.test(newBody)) {
        const newBorder = 'border-left:2px solid rgba(245,242,234,.35)';
        const oldBorder = newBody.match(/border-left:2px solid rgba\([^)]*\)/);
        if (oldBorder && oldBorder[0] !== newBorder) {
          newBody = newBody.replace(/border-left:2px solid rgba\([^)]*\)/, newBorder);
          changed = true;
        }
      }
      if (newBody !== body) return '.tra{' + newBody + '}';
      return match;
    });

    // 2. Fix .blatin encoding: accented chars in blatin-c and blatin-p divs
    // Elements look like: <div class="blatin blatin-c">TEXT</div>
    html = html.replace(/<div class="blatin[^"]*">([^<]*)<\/div>/g, (m, text) => {
      const fixed = encodeForBlatin(text);
      if (fixed !== text) {
        changed = true;
        return m.replace('>' + text + '<', '>' + fixed + '<');
      }
      return m;
    });

    // 3. Fix .btrans encoding: accented chars in btrans div (book name · language)
    html = html.replace(/<div class="btrans">([^<]*(?:<[^>]+>[^<]*<\/[^>]+>[^<]*)?)<\/div>/g, (m, content) => {
      // Only fix non-ASCII outside of tags
      const fixed = content.replace(/[^\x00-\x7E<>&;#]/g, ch => toEntity(ch));
      if (fixed !== content) {
        changed = true;
        return '<div class="btrans">' + fixed + '</div>';
      }
      return m;
    });

    if (changed) {
      fs.writeFileSync(fp, html, 'utf8');
      langFixed++;
    }
  }

  if (langFixed > 0) {
    console.log(`  ${lang}: fixed ${langFixed}/${files.length} files`);
  }
  totalFixed += langFixed;
  totalFiles += files.length;
}

console.log(`\nDone: fixed ${totalFixed}/${totalFiles} chapter files`);
