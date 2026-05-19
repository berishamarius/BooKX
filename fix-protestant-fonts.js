// fix-protestant-fonts.js
// Adds 2 missing Protestant CSS rules to all non-German Bible chapters
const fs=require('fs');
const path=require('path');

const LANGS=fs.readdirSync('dist-diebibel').filter(l=>{
  const full='dist-diebibel/'+l;
  return fs.statSync(full).isDirectory() && l!=='german';
});

const INSERT_CSS=
  "[data-conf=\"protestant\"] .vb.first .base-p::first-letter{font-family:'UnifrakturMaguntia',cursive;font-size:4em;float:left;line-height:.7;padding-right:.08em;margin-top:.07em;color:#B8962E;text-shadow:1px 2px 6px rgba(0,0,0,.12);}\n"+
  "[data-conf=\"protestant\"] .base-p{font-family:'UnifrakturMaguntia',cursive;font-size:1.08rem;letter-spacing:.01em;}\n";

let total=0, skipped=0;

for(const lang of LANGS){
  const dir='dist-diebibel/'+lang+'/bücher';
  if(!fs.existsSync(dir)) continue;
  const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));
  for(const f of files){
    const fp=path.join(dir,f);
    let html=fs.readFileSync(fp,'utf8');
    if(html.includes('[data-conf="protestant"] .vb.first .base-p::first-letter')){
      skipped++;
      continue; // already has it
    }
    // Insert before first </style>
    const si=html.indexOf('</style>');
    if(si===-1){ console.log('WARNING: no </style> in',fp); continue; }
    html=html.slice(0,si)+INSERT_CSS+html.slice(si);
    fs.writeFileSync(fp,html,'utf8');
    total++;
  }
}
console.log('Protestant fonts added to',total,'files,',skipped,'already had it');
