const fs = require('fs');

// Back-cover structure
const bc = fs.readFileSync('dist-diebibel/albanian/back-cover.html', 'utf8');
const bookStart = bc.indexOf('class="book"');
console.log('back-cover .book area:\n', bc.substring(bookStart, bookStart + 800));

// Italian index
const idx = fs.readFileSync('dist-diebibel/italian/index.html', 'utf8');
console.log('\nItalian index first 2000 chars:\n', idx.substring(0, 2000));
