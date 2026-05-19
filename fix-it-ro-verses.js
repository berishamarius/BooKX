/**
 * fix-it-ro-verses.js
 * Fix Italian and Romanian chapter files:
 * 1. Extract verse text from git history (commit 86492d74 had old design with full text)
 * 2. Inject Italian/Romanian text into .base-p and .tra elements
 * 3. Fix .bmeta (remove "Vulgata Clementina · Giovanni Diodati (1649) ·" prefix)
 * 4. Fix .chlbl-p (DAS 1. CAPITEL → copy from .chlbl-c = Caput N)
 * 5. Fix .tra color to #F5F2EA (white like German)
 * 6. Fix blatin-p (Genesis → GENESIS uppercase)
 */

'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST = 'dist-diebibel';
const GIT_COMMIT = '86492d74';

// Convert non-ASCII chars to HTML entities (for Latin-1 source data)
function toEntity(ch) {
  const cp = ch.codePointAt(0);
  if (cp <= 127) return ch;
  const named = {
    0xC0:'&Agrave;',0xC1:'&Aacute;',0xC2:'&Acirc;',0xC3:'&Atilde;',
    0xC4:'&Auml;',0xC5:'&Aring;',0xC6:'&AElig;',0xC7:'&Ccedil;',
    0xC8:'&Egrave;',0xC9:'&Eacute;',0xCA:'&Ecirc;',0xCB:'&Euml;',
    0xCC:'&Igrave;',0xCD:'&Iacute;',0xCE:'&Icirc;',0xCF:'&Iuml;',
    0xD0:'&ETH;',0xD1:'&Ntilde;',0xD2:'&Ograve;',0xD3:'&Oacute;',
    0xD4:'&Ocirc;',0xD5:'&Otilde;',0xD6:'&Ouml;',0xD8:'&Oslash;',
    0xD9:'&Ugrave;',0xDA:'&Uacute;',0xDB:'&Ucirc;',0xDC:'&Uuml;',
    0xDD:'&Yacute;',0xDF:'&szlig;',
    0xE0:'&agrave;',0xE1:'&aacute;',0xE2:'&acirc;',0xE3:'&atilde;',
    0xE4:'&auml;',0xE5:'&aring;',0xE6:'&aelig;',0xE7:'&ccedil;',
    0xE8:'&egrave;',0xE9:'&eacute;',0xEA:'&ecirc;',0xEB:'&euml;',
    0xEC:'&igrave;',0xED:'&iacute;',0xEE:'&icirc;',0xEF:'&iuml;',
    0xF0:'&eth;',0xF1:'&ntilde;',0xF2:'&ograve;',0xF3:'&oacute;',
    0xF4:'&ocirc;',0xF5:'&otilde;',0xF6:'&ouml;',0xF8:'&oslash;',
    0xF9:'&ugrave;',0xFA:'&uacute;',0xFB:'&ucirc;',0xFC:'&uuml;',
    0xFD:'&yacute;',0xFF:'&yuml;',
    // Special Latin chars needed for Vulgate
    0x00E6:'&aelig;', 0x00C6:'&AElig;',
  };
  if (named[cp]) return named[cp];
  return '&#' + cp + ';';
}

function encodeText(text) {
  return [...text].map(ch => toEntity(ch)).join('');
}

// Extract verse texts from OLD design HTML (has .trans divs)
function extractOldVerses(oldHtml) {
  // Map: verse id -> { latin, trans }
  const verses = {};
  // Match verse blocks: <div class="verse-block" id="v1-1"> ... </div>
  const blockRe = /<div class="verse-block" id="(v\d+-\d+)">([\s\S]*?)<\/div>\s*(?=<div class="verse-block"|<\/section>)/g;
  let m;
  while ((m = blockRe.exec(oldHtml)) !== null) {
    const id = m[1];
    const block = m[2];
    const latinMatch = block.match(/<div class="latin">([\s\S]*?)<\/div>/);
    const transMatch = block.match(/<div class="trans">([\s\S]*?)<\/div>/);
    verses[id] = {
      latin: latinMatch ? latinMatch[1].trim() : '',
      trans: transMatch ? transMatch[1].trim() : '',
    };
  }
  return verses;
}

// Read git file as latin1 binary to preserve accented characters
function readGitFile(lang, file) {
  const gitPath = `dist-diebibel/${lang}/b\u00FCcher/${file}`;
  try {
    const buf = execSync(`git show "${GIT_COMMIT}:${gitPath}"`, { encoding: 'buffer' });
    return buf.toString('latin1');
  } catch(e) {
    return null;
  }
}

const LANGS_CONFIG = {
  italian: { display: 'Italiano', langAttr: 'it' },
  romanian: { display: 'Rom&acirc;n&atilde;', langAttr: 'ro' },
};

let totalFixed = 0;

for (const [lang, cfg] of Object.entries(LANGS_CONFIG)) {
  const bDir = path.join(DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bDir)) { console.log(`Skip ${lang}: no folder`); continue; }

  const files = fs.readdirSync(bDir).filter(f => f.endsWith('.html'));
  let langFixed = 0;

  for (const file of files) {
    const fp = path.join(bDir, file);
    let html = fs.readFileSync(fp, 'utf8');

    // Read old file from git to get verse text
    const oldHtml = readGitFile(lang, file);
    const oldVerses = oldHtml ? extractOldVerses(oldHtml) : {};

    let changed = false;

    // 1. Inject verse text into .base-p and add .tra elements
    html = html.replace(
      /(<div class="vb[^"]*" id="(v\d+-\d+)">\s*<span class="vn">\d+<\/span>\s*<div class="vt">)([\s\S]*?)(<\/div>\s*<\/div>)/g,
      (m, open, vid, vtContent, close) => {
        const vdata = oldVerses[vid];
        if (!vdata) return m;

        // Extract current base-c content (Latin, from current file)
        const baseCMatch = vtContent.match(/<p class="base base-c">([\s\S]*?)<\/p>/);
        const currentBaseC = baseCMatch ? baseCMatch[1] : '';

        // Use old Italian/Romanian text as base-p and tra
        const nativeText = encodeText(vdata.trans);
        const latinText = vdata.latin ? encodeText(vdata.latin) : currentBaseC;

        // Build new vt content: base-c (latin), base-p (native), tra (native again as secondary)
        const newVt = `
    <p class="base base-c">${latinText || currentBaseC}</p>
    <p class="base base-p">${nativeText}</p>
    <p class="tra">${nativeText}</p>`;

        if (newVt.trim() !== vtContent.trim()) {
          changed = true;
          return open + newVt + '\n  ' + close;
        }
        return m;
      }
    );

    // 2. Fix .bmeta: remove "Vulgata Clementina · ... ·" prefix, keep only "N Capita · N Versus"
    html = html.replace(
      /<div class="bmeta">([^<]*Clementina[^<]*|[^<]*Diodati[^<]*)<\/div>/g,
      (m, content) => {
        // Extract just "N Capita · N Versus" part
        const capMatch = content.match(/(\d+\s*Capita[\s\S]*?Versus)/);
        if (capMatch) {
          changed = true;
          return `<div class="bmeta">${capMatch[1]}</div>`;
        }
        return m;
      }
    );

    // Also fix bmeta with middot separators
    html = html.replace(
      /<div class="bmeta">(?:[^<]*?&middot;&nbsp;|[^<]*?┬À\s*)[^<]*?(?:&middot;&nbsp;|┬À\s*)(\d+\s*Capita[^<]*)<\/div>/g,
      (m, capPart) => {
        changed = true;
        return `<div class="bmeta">${capPart}</div>`;
      }
    );

    // Simpler bmeta fix: if it has "Clementina" or "Diodati", strip everything before the last pair
    html = html.replace(/<div class="bmeta">([^<]+)<\/div>/g, (m, content) => {
      if (content.includes('Clementina') || content.includes('Diodati') || content.includes('1649')) {
        // Find "NN Capita" pattern
        const match = content.match(/(\d+\s*Capita\s*(?:&nbsp;|·|┬À)\s*(?:&middot;|·|┬À)\s*(?:&nbsp;|)?\d+\s*Versus)/i);
        if (match) { changed = true; return `<div class="bmeta">${match[1]}</div>`; }
        // Try simpler: just keep from "N Capita" to end
        const simpleMatch = content.match(/(\d+ Capita.+)/);
        if (simpleMatch) { changed = true; return `<div class="bmeta">${simpleMatch[1]}</div>`; }
      }
      return m;
    });

    // 3. Fix .chlbl-p: change "DAS N. CAPITEL" or "Das N. Capitel" to match .chlbl-c pattern
    // .chlbl-c is typically "Caput I", "Caput II", etc. - keep same for Protestant
    html = html.replace(
      /(<span class="chlbl chlbl-c">)(Caput [IVXLCivxlc]+)(<\/span>\s*<span class="chlbl chlbl-p">)[^<]*/g,
      (m, openC, caputText, midPart) => {
        changed = true;
        return openC + caputText + midPart + caputText;
      }
    );

    // 4. Fix .tra color: use #F5F2EA (white) instead of rgba(232...)
    html = html.replace(/\.tra\{([\s\S]*?)\}/g, (match, body) => {
      let newBody = body;
      if (/color:rgba\(232/.test(newBody) || /color:#E8C547/i.test(newBody)) {
        newBody = newBody.replace(/color:rgba\(232[^)]*\)/g, 'color:#F5F2EA');
        newBody = newBody.replace(/color:#E8C547/gi, 'color:#F5F2EA');
        // Also fix border-left
        newBody = newBody.replace(/border-left:[^;]+;/, 'border-left:2px solid rgba(245,242,234,.35);');
        changed = true;
      }
      return newBody !== body ? '.tra{' + newBody + '}' : match;
    });

    // 5. Fix .blatin-p uppercase (should match .blatin-c uppercase)
    html = html.replace(
      /(<div class="blatin blatin-p">)([^<]*)(<\/div>)/g,
      (m, open, text, close) => {
        const upper = text.toUpperCase();
        if (upper !== text) { changed = true; return open + upper + close; }
        return m;
      }
    );

    if (changed) {
      fs.writeFileSync(fp, html, 'utf8');
      langFixed++;
    }
  }

  console.log(`${lang}: fixed ${langFixed}/${files.length} files`);
  totalFixed += langFixed;
}

console.log(`\nTotal: fixed ${totalFixed} files`);
