const fs = require('fs');
const f = 'C:/Users/beris_xrgc50t/KX KroniX/BooKX/CATHOLIC-BIBLE/build3.js';
let c = fs.readFileSync(f, 'utf8');

c = c.split('A L T E S &nbsp; T E S T A M E N T &nbsp;\xb7&nbsp; ${booksVT.length} B \xdc C H E R')
     .join('V E T E R I S &nbsp; T E S T A M E N T I &nbsp;\xb7&nbsp; ${booksVT.length} &nbsp; L I B R I');

c = c.split('N E U E S &nbsp; T E S T A M E N T &nbsp;\xb7&nbsp; ${booksNT.length} B \xdc C H E R')
     .join('N O V I &nbsp; T E S T A M E N T I &nbsp;\xb7&nbsp; ${booksNT.length} &nbsp; L I B R I');

c = c.split('D E U T E R O K A N O N I S C H E &nbsp; B \xdc C H E R &nbsp;\xb7&nbsp; ${booksDK.length} B \xdc C H E R')
     .join('L I B R I &nbsp; D E U T E R O C A N O N I C I &nbsp;\xb7&nbsp; ${booksDK.length} &nbsp; L I B R I');

fs.writeFileSync(f, c, 'utf8');
const check = c.split('\n').filter(l => l.includes('sec-s'));
check.forEach(l => console.log(l.trim()));

