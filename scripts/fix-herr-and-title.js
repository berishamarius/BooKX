const fs = require('fs');
const path = require('path');

const roots = [
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-diebibel/german',
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/CATHOLIC-BIBLE/Übersetzungen/german'
];

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

let filesChanged = 0;
let jahweRepl = 0;
let titleRepl = 0;

for (const root of roots) {
  const files = walkHtml(root);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const before = content;

    const r0 = (content.match(/\bJahwes\b/g) || []).length;
    if (r0) {
      content = content.replace(/\bJahwes\b/g, 'des Herrn');
      jahweRepl += r0;
    }

    const r1 = (content.match(/\bJahwe\b/g) || []).length;
    if (r1) {
      content = content.replace(/\bJahwe\b/g, 'Herr');
      jahweRepl += r1;
    }

    const r2 = (content.match(/\bJahves\b/g) || []).length;
    if (r2) {
      content = content.replace(/\bJahves\b/g, 'des Herrn');
      jahweRepl += r2;
    }

    const r3 = (content.match(/\bJahve\b/g) || []).length;
    if (r3) {
      content = content.replace(/\bJahve\b/g, 'Herr');
      jahweRepl += r3;
    }

    const rt = (content.match(/Biblia Catholica/g) || []).length;
    if (rt) {
      content = content.replace(/Biblia Catholica/g, 'Die Heilige Bibel');
      titleRepl += rt;
    }

    if (content !== before) {
      fs.writeFileSync(file, content, 'utf8');
      filesChanged++;
    }
  }
}

console.log(JSON.stringify({ filesChanged, jahweRepl, titleRepl }, null, 2));
