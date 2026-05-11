const fs = require('fs');
const path = require('path');

const root = 'C:/Users/beris_xrgc50t/KX KroniX/BooKX';

const indexFiles = [
  path.join(root, 'dist-diebibel/german/index.html'),
  path.join(root, 'CATHOLIC-BIBLE/Übersetzungen/german/index.html'),
  path.join(root, 'dist-micheles/german/index.html'),
];

function patchIndex(file) {
  let c = fs.readFileSync(file, 'utf8');
  const before = c;

  // Keep thick title line in protestant mode and show German book names there.
  c = c.replace(
    'body[data-conf="protestant"] .tlat{display:none;}\nbody[data-conf="protestant"] .tname{margin-left:0;font-style:normal;}',
    'body[data-conf="protestant"] .tlat{display:block;font-family:\'UnifrakturMaguntia\',cursive;font-size:1.18rem;letter-spacing:.01em;}\nbody[data-conf="protestant"] .tname{display:none;}'
  );

  if (!c.includes('lat.dataset.latin')) {
    c = c.replace(
      "    note.textContent = NOTES[c] || '';\n    document.querySelectorAll('.tchap').forEach(function(el){\n      var m = (el.textContent || '').match(/\\d+/);\n      if (m) el.textContent = m[0] + (c === 'protestant' ? ' Kap.' : ' Kap.');\n    });",
      "    note.textContent = NOTES[c] || '';\n    document.querySelectorAll('.toc-item').forEach(function(item){\n      var lat = item.querySelector('.tlat');\n      var de = item.querySelector('.tname');\n      if (!lat || !de) return;\n      if (!lat.dataset.latin) lat.dataset.latin = (lat.textContent || '').trim();\n      lat.textContent = c === 'protestant' ? (de.textContent || '').trim() : lat.dataset.latin;\n    });\n    document.querySelectorAll('.tchap').forEach(function(el){\n      var m = (el.textContent || '').match(/\\d+/);\n      if (m) el.textContent = m[0] + ' Kap.';\n    });"
    );
  }

  if (c !== before) {
    fs.writeFileSync(file, c, 'utf8');
    return true;
  }
  return false;
}

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function patchUmlautsInDist() {
  const base = path.join(root, 'dist-diebibel/german');
  const files = walkHtml(base);
  let changed = 0;
  for (const file of files) {
    let c = fs.readFileSync(file, 'utf8');
    const before = c;

    // Core missing-umlaut typo repairs.
    c = c.replace(/\bfr\b/g, 'für');
    c = c.replace(/\bFr\b/g, 'Für');
    c = c.replace(/\bfur\b/g, 'für');
    c = c.replace(/\bFur\b/g, 'Für');
    c = c.replace(/\buber\b/g, 'über');
    c = c.replace(/\bUber\b/g, 'Über');

    if (c !== before) {
      fs.writeFileSync(file, c, 'utf8');
      changed++;
    }
  }
  return changed;
}

let idxChanged = 0;
for (const file of indexFiles) {
  if (fs.existsSync(file) && patchIndex(file)) idxChanged++;
}

const umlautChanged = patchUmlautsInDist();

console.log(JSON.stringify({ idxChanged, umlautChanged }, null, 2));
