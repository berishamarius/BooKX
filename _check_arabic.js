const fs = require('fs');
const data = fs.readFileSync('C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX\\Geschenke\\Koran-Deutsch-1\\Übersetzungen\\Deutsch\\suren\\004-An-Nisa.html','utf8');
const i = data.indexOf('id="v42"');
console.log('Found at:', i);
if(i>=0){
  const seg = data.slice(i, i+800);
  // Extract .ra content
  const ra = seg.match(/class="ra"[^>]*>([^<]+)</);
  if(ra) {
    const arText = ra[1];
    console.log('Arabic text:', arText.slice(0,200));
    for(let j=0;j<arText.length;j++){
      const cp = arText.codePointAt(j);
      if(cp > 0x0600){
        console.log('  ['+j+'] U+'+cp.toString(16).toUpperCase().padStart(4,'0'), JSON.stringify(arText[j]));
      }
    }
  }
  console.log('\nRaw HTML segment:');
  console.log(seg.slice(0,400));
}
