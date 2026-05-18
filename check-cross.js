const fs = require('fs');
const c = fs.readFileSync('dist-diebibel/german/b\u00FCcher/001-gen.html', 'utf8');
const idx = c.indexOf('<header class="bhead">');
const slice = c.substring(idx, idx + 600);
let out = '';
for (let i = 0; i < slice.length; i++) {
  const code = slice.charCodeAt(i);
  if (code > 127) out += '[U+' + code.toString(16).toUpperCase() + ']';
  else out += slice[i];
}
console.log(out);

// Fix cross: replace '? &nbsp; Inhaltsverzeichnis' with SVG cross in all non-Italian/Romanian
const path = require('path');
const SVG_CROSS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14" width="13" height="18" style="vertical-align:middle;stroke:currentColor;stroke-width:1.8;fill:none;stroke-linecap:square"><path d="M5,0V14M0,4H10"/></svg>';
const LANGS = ['albanian','croatian','czech','dutch','french','german','hungarian','kjv','polish','portuguese','russian','spanish','swedish','tagalog','ukrainian'];
let total = 0;
LANGS.forEach(lang => {
  const dir = path.join('dist-diebibel', lang, 'b\u00FCcher');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let fixed = 0;
  files.forEach(file => {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const needle = 'class="center">? &nbsp;';
    if (html.includes(needle)) {
      html = html.replace(needle, 'class="center">' + SVG_CROSS + ' &nbsp;');
      fs.writeFileSync(fp, html, 'utf8');
      fixed++;
    }
  });
  if (fixed > 0) console.log('  fixed', fixed, lang);
  total += fixed;
});
console.log('Total cross fixed:', total);
