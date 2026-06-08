// generate-quran-pdfs.js
// Creates complete PDF-ready HTML files for Meliha & Karim Quran editions
const fs = require('fs');
const path = require('path');

const SUREN_LIST = [
  'Al-Fatihah', 'Al-Baqarah', 'Ali--Imran', 'An-Nisa', 'Al-Ma-idah', 'Al-An-am',
  'Al-A-raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Ra-d', 'Ibrahim',
  'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Taha', 'Al-Anbya', 'Al-Hajj',
  'Al-Mu-minun', 'An-Nur', 'Al-Furqan', 'Ash-Shu-ara', 'An-Naml', 'Al-Qasas',
  'Al--Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin',
  'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir', 'Fussilat', 'Ash-Shuraa', 'Az-Zukhruf',
  'Ad-Dukhan', 'Al-Jathiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqi-ah', 'Al-Hadid',
  'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahanah', 'As-Saf', 'Al-Jumu-ah', 'Al-Munafiqun',
  'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma-arij',
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah', 'Al-Insan',
  'Al-Mursalat', 'An-Naba', 'An-Nazi-at', '-Abasa', 'At-Takwir', 'Al-Infitar',
  'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A-la', 'Al-Ghashiyah',
  'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl', 'Ad-Duhaa', 'Ash-Sharh', 'At-Tin',
  'Al--Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al--Adiyat', 'Al-Qari-ah',
  'At-Takathur', 'Al--Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh', 'Al-Ma-un', 'Al-Kawthar',
  'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
];

const PDF_CSS = `
<style type="text/css" media="print">
/* PDF OPTIMIZATIONS */
@page {
  size: A4;
  margin: 2cm 1.5cm;
}

body {
  font-size: 11pt !important;
  line-height: 1.6 !important;
}

/* Hide navigation and footers for PDF */
nav, footer, .topbar, .bnav, .ft-geo, .ft-in, .kx-copy {
  display: none !important;
}

/* Ensure content takes full width */
.content, main, .list {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
  border: none !important;
  background: white !important;
}

/* Page breaks */
.chap, .suren-content {
  page-break-before: always;
}

.chap:first-child, .suren-content:first-child {
  page-break-before: avoid;
}

.vb, .verse {
  page-break-inside: avoid;
  orphans: 3;
  widows: 3;
}

/* Headers */
.bhead, .sh-head {
  page-break-after: avoid;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Arabic text */
.ar, .ra, .bismi-txt {
  font-size: 14pt !important;
  line-height: 2 !important;
}

/* German translation */
.tr, .base {
  font-size: 10pt !important;
  line-height: 1.7 !important;
  color: #333 !important;
}

/* Verse numbers */
.vnum, .rn {
  color: #666 !important;
  font-size: 8pt !important;
}

/* Remove backgrounds */
* {
  background: white !important;
  color: black !important;
}

.ar, .ra {
  color: #000 !important;
}

/* Table of contents */
.list-rows, .index-body {
  page-break-inside: auto;
}

.row, .toc-item {
  page-break-inside: avoid;
  border-bottom: 1px solid #ddd !important;
}
</style>
`;

function extractBodyContent(html) {
  // Extract content between <body> and </body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  
  let content = bodyMatch[1];
  
  // Remove navigation
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  
  // Remove footer
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  
  // Remove copy/share buttons
  content = content.replace(/<span class="verse-tools"[\s\S]*?<\/span>/gi, '');
  
  // Remove scripts
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  return content;
}

function generateCompletePDF(edition, outputFile) {
  console.log(`\n📖 Generating ${edition} Quran PDF...`);
  
  const baseDir = `dist-${edition}/Übersetzungen/Deutsch`;
  const surenDir = path.join(baseDir, 'suren');
  
  if (!fs.existsSync(surenDir)) {
    console.log(`⚠ ${surenDir} nicht gefunden`);
    return false;
  }
  
  // Read cover/intro files
  let coverHTML = '';
  let introHTML = '';
  let tocHTML = '';
  
  const coverFile = path.join(baseDir, 'cover.html');
  const introFile = path.join(baseDir, 'intro.html');
  const indexFile = path.join(baseDir, 'index.html');
  
  if (fs.existsSync(coverFile)) {
    const cover = fs.readFileSync(coverFile, 'utf8');
    coverHTML = extractBodyContent(cover);
  }
  
  if (fs.existsSync(introFile)) {
    const intro = fs.readFileSync(introFile, 'utf8');
    introHTML = extractBodyContent(intro);
  }
  
  if (fs.existsSync(indexFile)) {
    const index = fs.readFileSync(indexFile, 'utf8');
    tocHTML = extractBodyContent(index);
  }
  
  // Read first surah to get CSS
  const firstSurah = path.join(surenDir, `001-${SUREN_LIST[0]}.html`);
  const firstHTML = fs.readFileSync(firstSurah, 'utf8');
  
  // Extract head content (meta, styles, fonts)
  const headMatch = firstHTML.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';
  
  // Start building complete HTML
  let completeHTML = `<!DOCTYPE html>
<html lang="de">
<head>
${headContent}
${PDF_CSS}
<title>القرآن الكريم - ${edition === 'meliha' ? 'Meliha Edition' : 'Karim Edition'} - Vollständige Ausgabe</title>
</head>
<body>
`;
  
  // Add cover
  if (coverHTML) {
    completeHTML += `<div class="pdf-cover">${coverHTML}</div>\n`;
  }
  
  // Add TOC
  if (tocHTML) {
    completeHTML += `<div class="pdf-toc" style="page-break-after:always;">${tocHTML}</div>\n`;
  }
  
  // Add intro
  if (introHTML) {
    completeHTML += `<div class="pdf-intro" style="page-break-after:always;">${introHTML}</div>\n`;
  }
  
  // Add all 114 surahs
  for (let i = 0; i < 114; i++) {
    const num = String(i + 1).padStart(3, '0');
    const fileName = `${num}-${SUREN_LIST[i]}.html`;
    const filePath = path.join(surenDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ Missing: ${fileName}`);
      continue;
    }
    
    const html = fs.readFileSync(filePath, 'utf8');
    const content = extractBodyContent(html);
    
    completeHTML += `<div class="suren-content">${content}</div>\n`;
    
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`\r  Progress: ${i + 1}/114 surahs`);
    }
  }
  
  console.log(`\r  Progress: 114/114 surahs ✓`);
  
  // Close HTML
  completeHTML += `</body>\n</html>`;
  
  // Write output
  fs.writeFileSync(outputFile, completeHTML, 'utf8');
  
  const sizeMB = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Generated: ${outputFile} (${sizeMB} MB)`);
  
  return true;
}

// Create output directory
if (!fs.existsSync('pdf-output')) {
  fs.mkdirSync('pdf-output');
}

console.log('🖨 KX Quran PDF Generator');
console.log('═══════════════════════════════════════\n');

// Generate Meliha PDF
generateCompletePDF('meliha', 'pdf-output/AL-QURAN-Meliha-Edition-Complete.html');

// Generate Karim PDF
generateCompletePDF('karim', 'pdf-output/AL-QURAN-Karim-Edition-Complete.html');

console.log('\n═══════════════════════════════════════');
console.log('✅ PDF-ready HTML files generated!');
console.log('\n📝 Next steps:');
console.log('1. Open each HTML file in Chrome/Edge');
console.log('2. Press Ctrl+P (Print)');
console.log('3. Select "Save as PDF"');
console.log('4. Ensure "Background graphics" is enabled');
console.log('5. Save the PDF');
console.log('\nOr use: wkhtmltopdf, Prince XML, or similar');
