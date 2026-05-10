const fs = require('fs');
const path = require('path');

const DIR = 'dist-diebibel/german/bücher';

function fixVerseColors(content) {
  let result = content;
  
  // Fix header background with repeating gradient
  result = result.replace(
    /\.bhead\{\s*background:#2C0810;/,
    `.bhead{
  background:
    repeating-linear-gradient( 45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    repeating-linear-gradient(-45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    linear-gradient(162deg,#1A0407 0%,#2C0810 45%,#4A1020 65%,#2C0810 85%,#1A0407 100%);`
  );
  
  // Fix header border
  result = result.replace(/border-bottom:3px solid #B8962E;/g, 'border-bottom:4px solid #B8962E;');
  
  // Fix header ::before borders
  result = result.replace(
    /\.bhead::before\{\s*content:'';position:absolute;inset:14px;\s*border:1px solid rgba\(140,100,20,\.2\);/,
    `.bhead::before{
  content:'';position:absolute;inset:14px;
  border:1px solid rgba(200,160,48,.22);`
  );
  
  // Fix header ::after borders
  result = result.replace(
    /\.bhead::after\{\s*content:'';position:absolute;inset:22px;\s*border:0\.5px solid rgba\(140,100,20,\.08\);/,
    `.bhead::after{
  content:'';position:absolute;inset:22px;
  border:1px solid rgba(200,160,48,.08);`
  );
  
  // Fix btestament colors
  result = result.replace(
    /border:1px solid rgba\(100,60,20,\.28\);\s*color:rgba\(42,0,8,\.45\);/,
    `border:1px solid rgba(200,160,48,.32);
  color:rgba(200,160,48,.52);`
  );
  
  // Fix content background - dark instead of light
  result = result.replace(
    /\.content\{\s*max-width:960px;[^}]*background:#FAF5E8;/,
    `.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#1a0407;`
  );
  
  // Fix content gradients
  result = result.replace(
    /radial-gradient\(ellipse at top left,rgba\(184,150,46,\.06\) 0%,transparent 55%\),\s*radial-gradient\(ellipse at bottom right,rgba\(184,150,46,\.05\) 0%,transparent 55%\);/,
    `radial-gradient(ellipse at top left,rgba(200,160,48,.04) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(200,160,48,.03) 0%,transparent 55%);`
  );
  
  // Fix content box-shadow and borders
  result = result.replace(
    /box-shadow:0 8px 80px rgba\(0,0,0,\.55\),0 2px 12px rgba\(0,0,0,\.35\),inset 0 0 0 1px rgba\(184,150,46,\.18\);/,
    `box-shadow:0 8px 80px rgba(0,0,0,.75),0 2px 12px rgba(0,0,0,.5),inset 0 0 0 1px rgba(200,160,48,.15);`
  );
  
  // Fix content borders
  result = result.replace(
    /border-top:2px solid rgba\(184,150,46,\.4\);\s*border-bottom:2px solid rgba\(184,150,48,\.4\);/,
    `border-top:2px solid rgba(200,160,48,.3);
  border-bottom:2px solid rgba(200,160,48,.3);`
  );
  
  // Fix content ::before
  result = result.replace(
    /\.content::before\{\s*content:'';[^}]*border:1px solid rgba\(184,150,46,\.08\);/,
    `.content::before{
  content:'';
  position:absolute;
  inset:12px;
  border:1px solid rgba(200,160,48,.08);`
  );
  
  // Fix body text color
  result = result.replace(/color:#1A0E06;/g, 'color:#EDD882;');
  
  // Fix bmeta color
  result = result.replace(
    /\.bmeta\{\s*font-family:'Cinzel',serif;font-size:\.62rem;\s*color:rgba\(42,0,8,\.35\);/,
    `.bmeta{
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(200,160,48,.4);`
  );
  
  return result;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
console.log(`Fixing ${files.length} verse files with correct colors and effects...`);

files.forEach(file => {
  const filePath = path.join(DIR, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = fixVerseColors(content);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log('Done!');
