'use strict';
/**
 * fix-cover-lines.js
 * Replaces ALL frame/border/corner CSS and HTML in every Bible cover and back-cover
 * with just two thin horizontal golden lines: top and bottom, full width, 0.5cm from edge.
 * No sides. No corners. No diamonds.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

// The two horizontal lines CSS to inject
const FRAME_CSS = `.frame-top,.frame-bot{position:fixed;left:0;right:0;height:1px;background:rgba(200,160,48,.6);pointer-events:none;z-index:10;}
.frame-top{top:19px;}
.frame-bot{bottom:19px;}`;

// The two HTML divs to put at top of <body>
const FRAME_HTML = '<div class="frame-top"></div>\n<div class="frame-bot"></div>';

function processFile(fpath) {
  let html = fs.readFileSync(fpath, 'utf8');

  // ── 1. Strip ALL old frame/corner CSS blocks ──────────────────────────────
  // Remove .frame-border rules
  html = html.replace(/\.frame-border\s*\{[^}]*\}/g, '');
  // Remove .frame-top and .frame-bot old rules (may include star patterns)
  html = html.replace(/\.frame-top\s*,?\s*\.frame-bot\s*\{[^}]*\}/g, '');
  html = html.replace(/\.frame-top\s*\{[^}]*\}/g, '');
  html = html.replace(/\.frame-bot\s*\{[^}]*\}/g, '');
  // Remove .corner CSS
  html = html.replace(/\.corner\s*\{[^}]*\}/g, '');
  html = html.replace(/\.c-tl\s*\{[^}]*\}/g, '');
  html = html.replace(/\.c-tr\s*\{[^}]*\}/g, '');
  html = html.replace(/\.c-bl\s*\{[^}]*\}/g, '');
  html = html.replace(/\.c-br\s*\{[^}]*\}/g, '');
  // Remove body::before / body::after border rules
  html = html.replace(/body\s*::\s*before\s*\{[^}]*\}/g, '');
  html = html.replace(/body\s*::\s*after\s*\{[^}]*\}/g, '');

  // ── 2. Inject the new frame CSS before </style> (first occurrence) ────────
  // Add inside the first <style> block, before its closing tag
  html = html.replace(/(<\/style>)/, FRAME_CSS + '\n$1');

  // ── 3. Strip ALL old frame/corner HTML divs from body ────────────────────
  html = html.replace(/<div class="frame-border"><\/div>\s*/g, '');
  html = html.replace(/<div class="frame-top"><\/div>\s*/g, '');
  html = html.replace(/<div class="frame-bot"><\/div>\s*/g, '');
  // Corner divs (any combination on one or multiple lines)
  html = html.replace(/<div class="corner c-tl"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-tr"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-bl"><\/div>\s*/g, '');
  html = html.replace(/<div class="corner c-br"><\/div>\s*/g, '');

  // ── 4. Insert the two new frame divs right after <body> ──────────────────
  // Only insert if not already present
  if (!html.includes('class="frame-top"')) {
    html = html.replace(/<body>/, '<body>\n' + FRAME_HTML);
  }

  // ── 5. Remove ✦ diamonds from prayer-label (too Islamic-looking) ─────────
  // Replace ✦ &nbsp; ... &nbsp; ✦ pattern around prayer title with plain · · ·
  html = html.replace(/✦\s*&nbsp;\s*(.*?)\s*&nbsp;\s*✦/g, '· $1 ·');

  fs.writeFileSync(fpath, html, 'utf8');
}

// Collect all cover.html and back-cover.html in dist-diebibel
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name === 'cover.html' || entry.name === 'back-cover.html') results.push(full);
  }
  return results;
}

const files = walk(BIBLE_DIST);
console.log(`Processing ${files.length} files...\n`);

for (const f of files) {
  processFile(f);
  const rel = f.replace(ROOT + path.sep, '');
  console.log('  ✓', rel);
}

console.log('\n✅ Done. All covers and back-covers updated.\n');
