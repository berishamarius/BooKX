const fs = require('fs');

const itPath = 'dist-diebibel/italian/b\u00FCcher/001-gen.html';
const dePath = 'dist-diebibel/german/b\u00FCcher/001-gen.html';

const it = fs.readFileSync(itPath, 'utf8');
const de = fs.readFileSync(dePath, 'utf8');

const itSt = it.match(/<style>([\s\S]*?)<\/style>/)[1];
const deSt = de.match(/<style>([\s\S]*?)<\/style>/)[1];

// Comment balance
const itOpens = ((itSt.match(/\/\*/g)) || []).length;
const itCloses = ((itSt.match(/\*\//g)) || []).length;
console.log('Italian comments balanced:', itOpens === itCloses, '(' + itOpens + '/' + itCloses + ')');

// Header HTML
const itHead = it.match(/<header class="bhead">([\s\S]*?)<\/header>/);
const deHead = de.match(/<header class="bhead">([\s\S]*?)<\/header>/);
console.log('\nItalian header:');
console.log(itHead ? itHead[0] : 'NOT FOUND');
console.log('\nGerman header:');
console.log(deHead ? deHead[0] : 'NOT FOUND');

// blatin CSS active?
const blatinIdx = itSt.indexOf('.blatin{');
const commentBeforeBlatin = itSt.lastIndexOf('/*', blatinIdx);
const commentCloseBeforeBlatin = itSt.lastIndexOf('*/', blatinIdx);
console.log('\n.blatin CSS position:', blatinIdx);
console.log('Last /* before blatin:', commentBeforeBlatin);
console.log('Last */ before blatin:', commentCloseBeforeBlatin);
console.log('CSS active (last */ > last /*):', commentCloseBeforeBlatin > commentBeforeBlatin);

// Conf script position
const confIdx = it.indexOf('biblia_conf');
const headEnd = it.indexOf('</head>');
console.log('\nConf script in <head>:', confIdx < headEnd);
console.log('Conf script pos:', confIdx, ' head ends at:', headEnd);
