const fs = require('fs');

const files = [
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-diebibel/german/index.html',
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/CATHOLIC-BIBLE/Übersetzungen/german/index.html',
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-micheles/german/index.html'
];

function patchCommon(content) {
  content = content.replace(
    ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#E8C547;letter-spacing:.28em;margin-top:4px;display:block;margin-bottom:28px;}",
    ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#E8C547;letter-spacing:.28em;margin-top:4px;display:none;margin-bottom:28px;}\nbody:not([data-conf]) .sec-s-c,body[data-conf=\"catholic\"] .sec-s-c{display:block;}\nbody[data-conf=\"protestant\"] .sec-s-p{display:block;}"
  );

  content = content.replace(
    ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#7a5800;letter-spacing:.28em;margin-top:4px;display:block;margin-bottom:28px;}",
    ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#7a5800;letter-spacing:.28em;margin-top:4px;display:none;margin-bottom:28px;}\nbody:not([data-conf]) .sec-s-c,body[data-conf=\"catholic\"] .sec-s-c{display:block;}\nbody[data-conf=\"protestant\"] .sec-s-p{display:block;}"
  );

  content = content.replace(
    "  color:#B8962E;\n  margin-left:12px;flex-shrink:0;\n}\n.tdots{",
    "  color:#B8962E;\n  margin-left:12px;flex-shrink:0;\n}\nbody[data-conf=\"protestant\"] .tlat{display:none;}\nbody[data-conf=\"protestant\"] .tname{margin-left:0;font-style:normal;}\n.tdots{"
  );

  content = content.replace(
    "  color:#6B5E40;\n  margin-left:12px;flex-shrink:0;\n}\n.tdots{",
    "  color:#6B5E40;\n  margin-left:12px;flex-shrink:0;\n}\nbody[data-conf=\"protestant\"] .tlat{display:none;}\nbody[data-conf=\"protestant\"] .tname{margin-left:0;font-style:normal;}\n.tdots{"
  );

  content = content.replace(
    '<span class="sec-s">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; 39 &nbsp; L I B R I</span>',
    '<span class="sec-s sec-s-c">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; 39 &nbsp; L I B R I</span>\n  <span class="sec-s sec-s-p">39 &nbsp; B Ü C H E R &nbsp;·&nbsp; A L T E S &nbsp; T E S T A M E N T</span>'
  );

  if (!content.includes("document.querySelectorAll('.tchap')")) {
    content = content.replace(
      "    note.textContent = NOTES[c] || '';",
      "    note.textContent = NOTES[c] || '';\n    document.querySelectorAll('.tchap').forEach(function(el){\n      var m = (el.textContent || '').match(/\\d+/);\n      if (m) el.textContent = m[0] + (c === 'protestant' ? ' Kap.' : ' Cap.');\n    });"
    );
  }

  return content;
}

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;

  if (file.includes('dist-diebibel') || file.includes('/Übersetzungen/german/')) {
    content = content.replace(
      '<a href="../index.html">&#8592; Zur Übersicht</a>',
      '<a href="../cover.html">&#8592; Zur Vorderseite</a>'
    );
  }

  if (file.includes('dist-micheles')) {
    content = content.replace(
      '<a href="../cover.html">&#8592; Zur Vorderseite</a>',
      '<a href="../vorwort.html">&#8592; Zum Vorwort</a>'
    );
  }

  content = patchCommon(content);

  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    updated++;
    console.log('Updated:', file);
  }
}

console.log('Total updated:', updated);
