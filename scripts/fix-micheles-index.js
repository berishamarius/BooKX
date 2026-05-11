const fs = require('fs');

const file = 'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-micheles/german/index.html';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('<a href="../cover.html">&#8592; Zur Vorderseite</a>', '<a href="../vorwort.html">&#8592; Zum Vorwort</a>');

c = c.replace(
  ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#7a5800;letter-spacing:.28em;margin-top:4px;display:block;margin-bottom:28px;}",
  ".sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#7a5800;letter-spacing:.28em;margin-top:4px;display:none;margin-bottom:28px;}\nbody:not([data-conf]) .sec-s-c,body[data-conf=\"catholic\"] .sec-s-c{display:block;}\nbody[data-conf=\"protestant\"] .sec-s-p{display:block;}"
);

c = c.replace(
  "  color:#6B5E40;\n  margin-left:12px;flex-shrink:0;\n}\n.tdots{",
  "  color:#6B5E40;\n  margin-left:12px;flex-shrink:0;\n}\nbody[data-conf=\"protestant\"] .tlat{display:none;}\nbody[data-conf=\"protestant\"] .tname{margin-left:0;font-style:normal;}\n.tdots{"
);

c = c.replace(
  '<span class="sec-s">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; 39 &nbsp; L I B R I</span>',
  '<span class="sec-s sec-s-c">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; 39 &nbsp; L I B R I</span>\n  <span class="sec-s sec-s-p">39 &nbsp; B Ü C H E R &nbsp;·&nbsp; A L T E S &nbsp; T E S T A M E N T</span>'
);

if (!c.includes("document.querySelectorAll('.tchap')")) {
  c = c.replace(
    "    note.textContent = NOTES[c] || '';",
    "    note.textContent = NOTES[c] || '';\n    document.querySelectorAll('.tchap').forEach(function(el){\n      var m = (el.textContent || '').match(/\\d+/);\n      if (m) el.textContent = m[0] + (c === 'protestant' ? ' Kap.' : ' Cap.');\n    });"
  );
}

fs.writeFileSync(file, c, 'utf8');
console.log('Patched micheles index');
