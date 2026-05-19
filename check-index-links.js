// check-index-links.js
'use strict';
const fs = require('fs');

const langs = ['albanian','croatian','czech','dutch','french','hungarian','italian','kjv','polish','portuguese','romanian','russian','spanish','swedish','tagalog','ukrainian'];

langs.forEach(lang => {
  try {
    const c = fs.readFileSync(`dist-diebibel/${lang}/index.html`, 'utf8');
    const m = c.match(/href="(b[^"]+\.html)"/);
    if (m) console.log(lang + '  →  ' + m[1]);
    else {
      // find first .html href
      const m2 = c.match(/href="([^"]+\.html)"/);
      if (m2) console.log(lang + '  (first href)→  ' + m2[1]);
    }
  } catch(e) {}
});
