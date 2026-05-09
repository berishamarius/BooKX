const fs = require('fs');
['CATHOLIC-BIBLE/build4.js', 'Geschenke/Bibel-Deutsch/build3.js'].forEach(f => {
  const b = fs.readFileSync(f, 'utf8');
  let idx = 0, n = 0;
  console.log('\n===', f, '===');
  while(true) {
    const i = b.indexOf('\uFFFD', idx);
    if (i < 0) break;
    n++;
    console.log(`  [${n}] pos ${i}: ...${JSON.stringify(b.slice(Math.max(0,i-15), i+15))}...`);
    idx = i + 1;
  }
  console.log(`  Total: ${n}`);
});
