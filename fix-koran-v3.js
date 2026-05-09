const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'Geschenke');
const DIRS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];

let total = 0;

for (const dir of DIRS) {
  const surenDir = path.join(BASE, dir, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const original = html;

    // 1. Body: Gold → Beige
    html = html.replace(
      'background:#c9a84c;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;',
      'background:#F5F0E3;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;'
    );

    // 2. .sh: Fixed-Background entfernen, original wiederherstellen
    html = html.replace(
      '.sh{text-align:center;padding:52px 24px 36px;border-bottom:1px solid rgba(192,155,60,.1);position:relative;z-index:1;background:url(\'../../../../../Suren%20Geschenke.png\') center/auto 100% no-repeat fixed;}',
      '.sh{text-align:center;padding:52px 24px 36px;border-bottom:1px solid rgba(192,155,60,.2);position:relative;z-index:1;}'
    );

    // 3. .bismi-area: Fixed-Background entfernen, original wiederherstellen
    html = html.replace(
      '.bismi-area{border-bottom:1px solid rgba(192,155,60,.1);position:relative;z-index:1;background:url(\'../../../../../Suren%20Geschenke.png\') center/auto 100% no-repeat fixed;}',
      '.bismi-area{border-bottom:1px solid rgba(192,155,60,.15);position:relative;z-index:1;}'
    );

    // 4. .page-wrap: fixed entfernen, PNG breiter (min(85vh,1100px) statt auto 100%)
    html = html.replace(
      'center/auto 100% no-repeat fixed;display:flex;flex-direction:column;align-items:center;overflow:hidden;position:relative;z-index:1;}',
      'center top/min(85vh,1100px) auto no-repeat;display:flex;flex-direction:column;align-items:center;overflow:hidden;position:relative;z-index:1;}'
    );

    // 5. .verses: Breite anpassen damit Inhalt im Rahmen bleibt
    html = html.replace(
      'width:min(60vh,800px);padding:110px 24px 110px;box-sizing:border-box;scrollbar-width:none;',
      'width:min(50vh,640px);padding:110px 24px 110px;box-sizing:border-box;scrollbar-width:none;'
    );

    if (html !== original) {
      fs.writeFileSync(fp, html, 'utf8');
      total++;
    }
  }

  console.log(`✓ ${dir}: ${files.length} Suren`);
}

console.log(`\n✅ Gesamt: ${total}`);
