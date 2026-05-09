const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'Geschenke');
const DIRS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];
const PNG_SUREN = "url('../../../../../Suren%20Geschenke.png')";
const MASK = '-webkit-mask-image:linear-gradient(to bottom,transparent 0,black 100px,black calc(100% - 100px),transparent);mask-image:linear-gradient(to bottom,transparent 0,black 100px,black calc(100% - 100px),transparent);';

let total = 0;

for (const dir of DIRS) {
  const surenDir = path.join(BASE, dir, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const original = html;

    // 1. Body: Creme → Gold
    html = html.replace(
      'background:#F5F0E3;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;',
      'background:#c9a84c;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;'
    );

    // 2. .sh: fixed PNG Hintergrund hinzufügen, Border dezenter
    html = html.replace(
      '.sh{text-align:center;padding:52px 24px 36px;border-bottom:1px solid rgba(192,155,60,.2);position:relative;z-index:1;}',
      `.sh{text-align:center;padding:52px 24px 36px;border-bottom:1px solid rgba(192,155,60,.1);position:relative;z-index:1;background:${PNG_SUREN} center/auto 100% no-repeat fixed;}`
    );

    // 3. .bismi-area: fixed PNG Hintergrund hinzufügen
    html = html.replace(
      '.bismi-area{border-bottom:1px solid rgba(192,155,60,.15);position:relative;z-index:1;}',
      `.bismi-area{border-bottom:1px solid rgba(192,155,60,.1);position:relative;z-index:1;background:${PNG_SUREN} center/auto 100% no-repeat fixed;}`
    );

    // 4. .page-wrap: "fixed" hinzufügen
    html = html.replace(
      'center/auto 100% no-repeat;display:flex;flex-direction:column;align-items:center;overflow:hidden;position:relative;z-index:1;}',
      'center/auto 100% no-repeat fixed;display:flex;flex-direction:column;align-items:center;overflow:hidden;position:relative;z-index:1;}'
    );

    // 5. ::before und ::after entfernen (mask-image ersetzt sie)
    html = html.replace(/\.page-wrap::before\{[^}]*\}/g, '');
    html = html.replace(/\.page-wrap::after\{[^}]*\}/g, '');

    // 6. .verses: breiter + mask-image für Fade-Effekt
    html = html.replace(
      'width:min(54vh,720px);padding:110px 24px 110px;box-sizing:border-box;scrollbar-width:none;}',
      `width:min(60vh,800px);padding:110px 24px 110px;box-sizing:border-box;scrollbar-width:none;${MASK}}`
    );

    if (html !== original) {
      fs.writeFileSync(fp, html, 'utf8');
      total++;
    }
  }

  console.log(`✓ ${dir}: ${files.length} Suren`);
}

console.log(`\n✅ Gesamt geändert: ${total}`);
