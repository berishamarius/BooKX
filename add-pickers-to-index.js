const fs = require('fs');
const path = require('path');

const ALL_LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

// Picker HTML with proper styling
const pickerHTML = `
<div class="pickers-container">
  <div class="canon-picker">
    <button class="picker-btn catholic active" data-canon="catholic">
      <span class="cross">✟</span>
      <span class="label">Catholic</span>
      <span class="count">73 Books</span>
    </button>
    <button class="picker-btn protestant" data-canon="protestant">
      <span class="cross">†</span>
      <span class="label">Protestant</span>
      <span class="count">66 Books</span>
    </button>
  </div>

  <div class="text-layer-picker">
    <button class="layer-btn latin active" data-layer="latin">
      <span class="layer-icon">L</span>
      <span>Latin</span>
    </button>
    <button class="layer-btn german active" data-layer="german">
      <span class="layer-icon">D</span>
      <span>Deutsch</span>
    </button>
    <button class="layer-btn greek active" data-layer="greek">
      <span class="layer-icon">Ω</span>
      <span>Greek</span>
    </button>
  </div>
</div>

<style>
.pickers-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px auto;
  max-width: 900px;
  padding: 0 20px;
}

.canon-picker, .text-layer-picker {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.picker-btn, .layer-btn {
  background: linear-gradient(135deg, #1A0407 0%, #2C0810 100%);
  border: 1.5px solid rgba(200, 160, 48, 0.3);
  border-radius: 6px;
  padding: 10px 18px;
  color: rgba(237, 216, 130, 0.75);
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.05em;
}

.picker-btn {
  flex-direction: column;
  gap: 4px;
  min-width: 110px;
}

.picker-btn .cross {
  font-size: 1.4rem;
  opacity: 0.6;
}

.picker-btn .label {
  font-size: 0.9rem;
  font-weight: 500;
}

.picker-btn .count {
  font-size: 0.7rem;
  opacity: 0.5;
  letter-spacing: 0.08em;
}

.layer-btn {
  min-width: 100px;
  justify-content: center;
}

.layer-icon {
  font-size: 1.1rem;
  opacity: 0.7;
  font-weight: 600;
}

.picker-btn:hover, .layer-btn:hover {
  border-color: rgba(200, 160, 48, 0.6);
  background: linear-gradient(135deg, #2C0810 0%, #4A1020 100%);
  color: #EDD882;
}

.picker-btn.active, .layer-btn.active {
  background: linear-gradient(135deg, #4A1020 0%, #5C1828 100%);
  border-color: #B8962E;
  color: #EDD882;
  box-shadow: 0 0 12px rgba(184, 150, 46, 0.2);
}

.picker-btn.active .cross,
.layer-btn.active .layer-icon {
  opacity: 1;
  color: #C8A030;
}

@media (max-width: 768px) {
  .pickers-container {
    gap: 12px;
    margin: 16px auto;
  }
  
  .picker-btn, .layer-btn {
    padding: 8px 14px;
    font-size: 0.75rem;
    min-width: 90px;
  }
  
  .picker-btn .cross {
    font-size: 1.2rem;
  }
  
  .layer-icon {
    font-size: 1rem;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // Canon picker logic
  const canonBtns = document.querySelectorAll('.picker-btn');
  const bookLinks = document.querySelectorAll('.book-tile');
  
  canonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const canon = btn.dataset.canon;
      
      canonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      bookLinks.forEach(link => {
        const href = link.getAttribute('href');
        const bookNum = parseInt(href.match(/\\d+/)[0]);
        
        if (canon === 'protestant') {
          // Hide all deuterocanonical books (67-79)
          if (bookNum >= 67 && bookNum <= 79) {
            link.style.display = 'none';
          } else {
            link.style.display = '';
          }
        } else if (canon === 'catholic') {
          // Show all books (including deuterocanonical)
          link.style.display = '';
        }
      });
    });
  });
  
  // Text layer picker logic
  const layerBtns = document.querySelectorAll('.layer-btn');
  
  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.dataset.layer;
      btn.classList.toggle('active');
      
      // Store state in localStorage
      const activeLayersKey = 'activeLayers';
      let activeLayers = JSON.parse(localStorage.getItem(activeLayersKey) || '["latin", "german", "greek"]');
      
      if (btn.classList.contains('active')) {
        if (!activeLayers.includes(layer)) {
          activeLayers.push(layer);
        }
      } else {
        activeLayers = activeLayers.filter(l => l !== layer);
      }
      
      localStorage.setItem(activeLayersKey, JSON.stringify(activeLayers));
    });
  });
  
  // Restore layer state from localStorage
  const activeLayersKey = 'activeLayers';
  const activeLayers = JSON.parse(localStorage.getItem(activeLayersKey) || '["latin", "german", "greek"]');
  
  layerBtns.forEach(btn => {
    const layer = btn.dataset.layer;
    if (!activeLayers.includes(layer)) {
      btn.classList.remove('active');
    }
  });
});
</script>
`;

let updatedCount = 0;

for (const lang of ALL_LANGUAGES) {
  const indexPath = path.join('dist-diebibel', lang, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${lang} - index.html not found`);
    continue;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove existing pickers if present
  html = html.replace(/<div class="pickers-container">[\s\S]*?<\/script>/g, '');
  
  // Insert picker after header but before books list
  if (html.includes('</header>')) {
    html = html.replace(
      /<\/header>/,
      `</header>\n${pickerHTML}`
    );
    
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`✓ Added pickers to ${lang}/index.html`);
    updatedCount++;
  } else {
    console.log(`⚠️  Could not find </header> in ${lang}/index.html`);
  }
}

console.log(`\n✅ Updated ${updatedCount}/${ALL_LANGUAGES.length} index files with pickers!`);
