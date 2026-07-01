const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

// JavaScript to add to each book page to control text layer visibility
const layerControlJS = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Read active layers from localStorage (set by index.html picker)
  const activeLayersKey = 'activeLayers';
  const activeLayers = JSON.parse(localStorage.getItem(activeLayersKey) || '["latin", "german", "greek"]');
  
  // Hide/show text layers based on settings
  const style = document.createElement('style');
  const rules = [];
  
  if (!activeLayers.includes('latin')) {
    rules.push('.base-c { display: none !important; }');
  }
  if (!activeLayers.includes('german')) {
    rules.push('.base-p { display: none !important; }');
  }
  if (!activeLayers.includes('greek')) {
    rules.push('.base-o { display: none !important; }');
  }
  
  style.textContent = rules.join('\\n');
  document.head.appendChild(style);
  
  // Listen for localStorage changes from other tabs/pages
  window.addEventListener('storage', (e) => {
    if (e.key === activeLayersKey) {
      location.reload();
    }
  });
});
</script>`;

let updatedCount = 0;

for (const lang of LANGUAGES) {
  const booksDir = path.join('dist-diebibel', lang, 'bücher');
  
  if (!fs.existsSync(booksDir)) {
    console.log(`⚠️  Skipping ${lang} - books directory not found`);
    continue;
  }
  
  const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const filePath = path.join(booksDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Remove existing layer control script if present
    html = html.replace(/<script>[\s\S]*?activeLayers[\s\S]*?<\/script>/g, '');
    
    // Add layer control script before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${layerControlJS}\n</body>`);
      fs.writeFileSync(filePath, html, 'utf8');
      updatedCount++;
    }
  }
  
  console.log(`✓ Updated ${files.length} books in ${lang}`);
}

console.log(`\n✅ Added layer control JS to ${updatedCount} book files!`);
