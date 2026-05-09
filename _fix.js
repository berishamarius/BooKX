const fs = require('fs');

let b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

// Remove btn-wrap + btn CSS from backcover style block
b4 = b4.replace(
  '\r\n.btn-wrap{text-align:center;position:relative;z-index:1;}\r\n.btn{display:inline-block;padding:11px 50px;background:#5a0010;color:#EDD882;border:2px solid #5a0010;text-decoration:none;font-family:\'Cinzel\',serif;font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}\r\n.btn:hover{background:#7a1020;border-color:#7a1020;}',
  ''
);
// <div class="book"> → <a class="book" href="${coverLink}">
b4 = b4.replace(
  '<div class="book">\r\n  <img src="${imgPath}" alt="R\u00fcckseite">',
  '<a class="book" href="${coverLink}">\r\n  <img src="${imgPath}" alt="R\u00fcckseite">'
);
// close </div> after overlay + remove btn
b4 = b4.replace(
  '    <div class="prayer-ref">Matthaeus 6,9\u201313 &nbsp;\u00b7&nbsp; Vulgata</div>\r\n  </div>\r\n</div>\r\n<div class="btn-wrap">\r\n  <a href="${coverLink}" class="btn">\u271d Zum Cover</a>\r\n</div>\r\n</body>',
  '    <div class="prayer-ref">Matthaeus 6,9\u201313 &nbsp;\u00b7&nbsp; Vulgata</div>\r\n  </div>\r\n</a>\r\n</body>'
);

fs.writeFileSync('CATHOLIC-BIBLE/build4.js', b4);
console.log('b4 backcover <a>:', b4.includes('class="book" href="${coverLink}"'));
console.log('b4 btn-wrap count:', (b4.match(/btn-wrap/g)||[]).length);

// ============================================================
//  build3.js  – fix remaining: backcover btn + <div>→<a> + background design
// ============================================================
let b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

// Backcover: replace entire style block (remove btn CSS, add background design)
b3 = b3.replace(
  '*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}\r\nhtml,body{min-height:100vh;background:#e8e0d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}\r\n.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}\r\n.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.25);}\r\n.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 2.2rem;text-align:center;}\r\n.loss{font-family:\'EB Garamond\',Georgia,serif;font-style:italic;font-size:.98rem;color:#1a0a04;line-height:1.75;margin-bottom:1.1rem;}\r\n.rule{width:50%;height:1px;margin:0 auto .9rem;background:linear-gradient(to right,transparent,rgba(90,40,0,.4),transparent);}\r\n.verse{font-family:\'EB Garamond\',Georgia,serif;font-style:italic;font-size:1.02rem;color:#1a0a04;line-height:1.8;}\r\n.verse-ref{font-family:\'Cinzel\',serif;font-size:.5rem;color:rgba(90,40,0,.7);letter-spacing:.15em;margin-top:5px;}\r\n.copy{font-family:\'Cinzel\',serif;font-size:.72rem;font-weight:700;color:rgba(240,200,130,.8);margin-top:1rem;letter-spacing:.12em;}\r\n.btn-wrap{text-align:center;position:relative;z-index:1;}\r\n.btn{display:inline-block;padding:13px 56px;color:#f0e8d0;text-decoration:none;font-family:\'Cinzel\',serif;font-size:.82rem;font-weight:600;letter-spacing:.28em;border:2px solid #5a2000;background:#5a2000;transition:all .22s;}\r\n.btn:hover{background:#7a3010;border-color:#7a3010;}',
  '*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}\r\nhtml,body{min-height:100vh;background:#e8e0d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}\r\nbody::before{content:\'\';position:fixed;inset:16px;border:1px solid rgba(90,32,0,.28);pointer-events:none;z-index:5;}\r\nbody::after{content:\'\';position:fixed;inset:28px;border:1px solid rgba(90,32,0,.11);pointer-events:none;z-index:5;}\r\n.corner{position:fixed;width:52px;height:52px;pointer-events:none;z-index:6;}\r\n.c-tl{top:14px;left:14px;border-top:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}\r\n.c-tr{top:14px;right:14px;border-top:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}\r\n.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}\r\n.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}\r\n.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}\r\n.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.25);}\r\n.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 2.2rem;text-align:center;}\r\n.loss{font-family:\'EB Garamond\',Georgia,serif;font-style:italic;font-size:.98rem;color:#1a0a04;line-height:1.75;margin-bottom:1.1rem;}\r\n.rule{width:50%;height:1px;margin:0 auto .9rem;background:linear-gradient(to right,transparent,rgba(90,40,0,.4),transparent);}\r\n.verse{font-family:\'EB Garamond\',Georgia,serif;font-style:italic;font-size:1.02rem;color:#1a0a04;line-height:1.8;}\r\n.verse-ref{font-family:\'Cinzel\',serif;font-size:.5rem;color:rgba(90,40,0,.7);letter-spacing:.15em;margin-top:5px;}\r\n.copy{font-family:\'Cinzel\',serif;font-size:.72rem;font-weight:700;color:rgba(240,200,130,.8);margin-top:1rem;letter-spacing:.12em;}'
);

// Add corner divs + fix book div → a in HTML
b3 = b3.replace(
  '<body>\r\n<div class="book">\r\n  <img src="../../../Bibel-Rueckseite-Michele.png" alt="R\u00fcckseite">',
  '<body>\r\n<div class="corner c-tl"></div><div class="corner c-tr"></div>\r\n<div class="corner c-bl"></div><div class="corner c-br"></div>\r\n<a class="book" href="cover.html">\r\n  <img src="../../../Bibel-Rueckseite-Michele.png" alt="R\u00fcckseite">'
);
// close </div>→</a> after overlay + remove btn
b3 = b3.replace(
  '    <div class="verse-ref">Matth\u00e4us 11,28</div>\r\n\r\n  </div>\r\n</div>\r\n<div class="btn-wrap">\r\n  <a class="btn" href="cover.html">\u271d Zum Cover</a>\r\n</div>\r\n</body>',
  '    <div class="verse-ref">Matth\u00e4us 11,28</div>\r\n  </div>\r\n</a>\r\n</body>'
);

fs.writeFileSync('Geschenke/Bibel-Deutsch/build3.js', b3);
console.log('b3 backcover <a>:', b3.includes('class="book" href="cover.html"'));
console.log('b3 corners:', b3.includes('body::before') && b3.includes('c-tl'));
console.log('b3 btn-wrap count:', (b3.match(/btn-wrap/g)||[]).length);
