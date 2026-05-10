'use strict';

/**
 * Ersetzt Querverweis-Platzhalter in deutschen Bibel-Übersetzungen (.tra)
 * durch echten Text (bevorzugt .base-p, sonst Zielvers-Text aus Referenz).
 *
 * Nutzung:
 *   node fix-bible-xrefs.js
 */

const fs = require('fs');
const path = require('path');

const DIRS = [
  'CATHOLIC-BIBLE/Übersetzungen/german/bücher',
  'Geschenke/Bibel-Deutsch/Übersetzungen/german/bücher',
];

const XREF_RE = /(\bvgl\.|\bs\.?\s*v(?:ers)?\.?\s*\d+|\bsiehe\s+v(?:ers)?\.?\s*\d+|\bwie\s+vers\s*\d+|\bgleich\s+wie\s+v(?:ers)?\.?\s*\d+|\bidentisch\s+mit\s+v(?:ers)?\.?\s*\d+|→\s*v(?:ers)?\.?\s*\d+|=\s*v(?:ers)?\.?\s*\d+)/i;

function clean(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function parseVerseData(content) {
  const map = new Map();
  const vbRe = /<div class="vb[^\"]*" id="v(\d+)-(\d+)">([\s\S]*?)<\/div>\s*<\/div>/g;
  let m;
  while ((m = vbRe.exec(content)) !== null) {
    const ch = Number(m[1]);
    const vs = Number(m[2]);
    const block = m[0];
    const key = `${ch}:${vs}`;

    const trM = block.match(/<p class="tra">([\s\S]*?)<\/p>/);
    const bpM = block.match(/<p class="base base-p">([\s\S]*?)<\/p>/);
    const bcM = block.match(/<p class="base base-c">([\s\S]*?)<\/p>/);

    map.set(key, {
      ch,
      vs,
      block,
      traRaw: trM ? trM[1] : '',
      basePRaw: bpM ? bpM[1] : '',
      baseCRaw: bcM ? bcM[1] : '',
    });
  }
  return map;
}

function resolveFromReference(refText, curCh, verseMap) {
  const nums = [...refText.matchAll(/\b(\d+)\b/g)].map(x => Number(x[1]));
  if (!nums.length) return '';

  // chapter:verse pattern in text (e.g. 3,16 or 3:16)
  const cv = refText.match(/\b(\d+)\s*[:.,]\s*(\d+)\b/);
  if (cv) {
    const key = `${Number(cv[1])}:${Number(cv[2])}`;
    const v = verseMap.get(key);
    if (v) {
      const t = clean(v.traRaw);
      if (t && !XREF_RE.test(t)) return t;
    }
  }

  // verse only → same chapter
  const vNum = nums[nums.length - 1];
  const same = verseMap.get(`${curCh}:${vNum}`);
  if (!same) return '';
  const txt = clean(same.traRaw);
  if (txt && !XREF_RE.test(txt)) return txt;
  return '';
}

function fixFile(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  const verseMap = parseVerseData(content);

  let changed = 0;
  let unresolved = 0;
  const unresolvedList = [];

  for (const [key, v] of verseMap.entries()) {
    const tra = clean(v.traRaw);
    if (!tra || !XREF_RE.test(tra)) continue;

    let replacement = '';

    const bp = clean(v.basePRaw);
    if (bp && bp.length > 12 && !XREF_RE.test(bp)) {
      replacement = bp;
    }

    if (!replacement) {
      replacement = resolveFromReference(tra, v.ch, verseMap);
    }

    if (!replacement) {
      const bc = clean(v.baseCRaw);
      if (bc && bc.length > 12 && !XREF_RE.test(bc)) {
        replacement = bc;
      }
    }

    if (!replacement) {
      unresolved++;
      unresolvedList.push({ key, text: tra });
      continue;
    }

    const oldP = `<p class="tra">${v.traRaw}</p>`;
    const newP = `<p class="tra">${replacement}</p>`;
    if (content.includes(oldP)) {
      content = content.replace(oldP, newP);
      changed++;
    }
  }

  if (changed > 0) {
    fs.writeFileSync(fp, content, 'utf8');
  }

  return { changed, unresolved, unresolvedList };
}

function main() {
  let filesChanged = 0;
  let versesChanged = 0;
  let unresolved = 0;
  const unresolvedDump = [];

  for (const d of DIRS) {
    if (!fs.existsSync(d)) continue;
    const files = fs.readdirSync(d).filter(f => f.endsWith('.html')).sort();
    for (const f of files) {
      const fp = path.join(d, f);
      const r = fixFile(fp);
      if (r.changed > 0) filesChanged++;
      versesChanged += r.changed;
      unresolved += r.unresolved;
      if (r.unresolvedList && r.unresolvedList.length) {
        for (const u of r.unresolvedList) {
          unresolvedDump.push(`${fp} :: ${u.key} :: ${u.text}`);
        }
      }
    }
  }

  console.log(`Dateien geändert: ${filesChanged}`);
  console.log(`Verse ersetzt : ${versesChanged}`);
  console.log(`Unaufgelöst   : ${unresolved}`);
  if (unresolvedDump.length) {
    console.log('\nUnaufgelöste Fälle:');
    unresolvedDump.slice(0, 20).forEach(x => console.log(' - ' + x));
  }
}

main();
