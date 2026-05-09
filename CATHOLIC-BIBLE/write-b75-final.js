// Final: tmp_b75_d.json -> data-orthodox/german/075.json + cleanup
const fs = require('fs');
const path = require('path');

const d = JSON.parse(fs.readFileSync(__dirname+'/tmp_b75_d.json','utf8'));
const outPath = path.join(__dirname,'data-orthodox','german','075.json');
fs.writeFileSync(outPath, JSON.stringify(d), 'utf8');

// Count total verses
let total = 0;
for(const cn of Object.keys(d.chapters)){
  total += Object.keys(d.chapters[cn].verses).length;
}

// Cleanup tmp files
['a','b','c','d'].forEach(x => {
  const f = __dirname+'/tmp_b75_'+x+'.json';
  if(fs.existsSync(f)) fs.unlinkSync(f);
});

console.log('075.json fertig: '+total+' Verse in '+Object.keys(d.chapters).length+' Kapiteln');
