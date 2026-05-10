const fs = require('fs');
const path = require('path');

const DIR = 'dist-diebibel/german/bücher';

function cleanVerseDesign(content) {
  let result = content;
  
  // Remove repeating gradient gitter - just dark red background
  result = result.replace(
    /\.bhead\{\s*background:\s*repeating-linear-gradient[^}]*linear-gradient[^;]*;/s,
    `.bhead{
  background:#1A0407;`
  );
  
  // Fix header border to be more subtle
  result = result.replace(/border-bottom:4px solid #B8962E;/g, 'border-bottom:3px solid #B8962E;');
  
  // Remove ::before border
  result = result.replace(
    /\.bhead::before\{[^}]*border:1px solid rgba\(200,160,48,\.22\);/,
    `.bhead::before{
  content:'';position:absolute;inset:14px;
  border:none;`
  );
  
  // Remove ::after border
  result = result.replace(
    /\.bhead::after\{[^}]*border:1px solid rgba\(200,160,48,\.08\);/,
    `.bhead::after{
  content:'';position:absolute;inset:22px;
  border:none;`
  );
  
  // Fix btestament colors - more subtle
  result = result.replace(
    /\.btestament\{[^}]*border:1px solid rgba\(200,160,48,\.32\);[^}]*color:rgba\(200,160,48,\.52\);/,
    `.btestament{
  display:inline-block;
  border:1px solid rgba(200,160,48,.35);
  color:rgba(200,160,48,.65);`
  );
  
  // Fix btrans color - lighter gold
  result = result.replace(
    /\.btrans\{[^}]*color:#C8A030;/,
    `.btrans{
  font-family:'Cinzel',serif;
  font-size:.88rem;
  color:#E8C547;`
  );
  
  // Fix blatin color - lighter gold
  result = result.replace(
    /\.blatin\{[^}]*color:#EDD882;/,
    `.blatin{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(1.9rem,7vw,3.4rem);
  color:#F0E68C;`
  );
  
  // Fix bmeta color
  result = result.replace(
    /\.bmeta\{[^}]*color:rgba\(200,160,48,\.4\);/,
    `.bmeta{
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(200,160,48,.5);`
  );
  
  // Clean content - no gradients, just dark background
  result = result.replace(
    /\.content\{[^}]*background:#1a0407;[^}]*background-image:[^;]*;[^}]*radial-gradient[^;]*;[^}]*radial-gradient[^;]*;/,
    `.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#1a0407;`
  );
  
  // Fix content shadows - less aggressive
  result = result.replace(
    /box-shadow:0 8px 80px rgba\(0,0,0,\.75\),0 2px 12px rgba\(0,0,0,\.5\),inset 0 0 0 1px rgba\(200,160,48,\.15\);/,
    `box-shadow:0 8px 80px rgba(0,0,0,.65),0 2px 12px rgba(0,0,0,.4),inset 0 0 0 1px rgba(200,160,48,.12);`
  );
  
  // Remove content ::before border
  result = result.replace(
    /\.content::before\{[^}]*border:1px solid rgba\(200,160,48,\.08\);/,
    `.content::before{
  content:'';
  position:absolute;
  inset:12px;
  border:none;`
  );
  
  // Fix body text to lighter gold
  result = result.replace(/color:#EDD882;/g, 'color:#E8C547;');
  
  // Fix .tra color (translations) - golden
  result = result.replace(
    /\.tra\{[^}]*color:#1E2848;/,
    `.tra{
  font-family:'EB Garamond',serif;
  font-size:.93rem;
  font-style:italic;
  line-height:1.95;
  color:#E8C547;`
  );
  
  // Fix .base color (verses) - lighter
  result = result.replace(
    /\.base\{[^}]*color:#3D1A08;/,
    `.base{
  font-family:'EB Garamond',serif;
  font-size:1.2rem;
  font-weight:500;
  line-height:2.1;
  color:#E8D5B7;`
  );
  
  // Fix .vn (verse numbers) - golden
  result = result.replace(
    /\.vn\{[^}]*color:rgba\(184,150,46,\.52\);/,
    `.vn{
  flex-shrink:0;
  width:38px;
  padding-top:4px;
  font-family:'Cinzel',serif;font-size:.56rem;
  color:#E8C547;text-align:right;`
  );
  
  return result;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
console.log(`Cleaning ${files.length} verse files - removing gitter/effekte from header...`);

files.forEach(file => {
  const filePath = path.join(DIR, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = cleanVerseDesign(content);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log('Done! Header is now clean without gitter/effekte!');
