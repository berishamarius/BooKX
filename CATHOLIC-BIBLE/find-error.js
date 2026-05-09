const fs = require('fs');
const src = fs.readFileSync('build4.js', 'utf8');

// Proper JS template literal state machine
// Tracks: JS code, template literals (backtick strings), ${} expressions inside templates
let state = 'JS';   // 'JS' | 'TMPL' | 'STR_D' | 'STR_S' | 'TEXPR'
let exprStack = []; // stack of brace depths for nested ${}
let braceDepth = 0;
let lineNum = 1;
let lastOpenTmpl = -1;
let lastOpenBrace = [];

for (let i = 0; i < src.length; i++) {
  const c = src[i];
  if (c === '\n') lineNum++;

  if (state === 'JS') {
    if (c === '`') {
      state = 'TMPL';
      lastOpenTmpl = lineNum;
    } else if (c === '"') {
      state = 'STR_D';
    } else if (c === "'") {
      state = 'STR_S';
    } else if (c === '/') {
      if (src[i+1] === '/') { // line comment
        while (i < src.length && src[i] !== '\n') i++;
        lineNum++;
      } else if (src[i+1] === '*') { // block comment
        i += 2;
        while (i < src.length && !(src[i] === '*' && src[i+1] === '/')) {
          if (src[i] === '\n') lineNum++;
          i++;
        }
        i++; // skip /
      }
    } else if (c === '{') {
      braceDepth++;
      lastOpenBrace.push(lineNum);
    } else if (c === '}') {
      braceDepth--;
      lastOpenBrace.pop();
    }
  } else if (state === 'TMPL') {
    if (c === '\\') {
      i++; // skip escaped char
    } else if (c === '`') {
      state = exprStack.length > 0 ? 'TEXPR' : 'JS';
      lastOpenTmpl = -1;
    } else if (c === '$' && src[i+1] === '{') {
      exprStack.push(1);
      state = 'TEXPR';
      i++; // skip {
    }
  } else if (state === 'TEXPR') {
    if (c === '`') {
      state = 'TMPL';
      lastOpenTmpl = lineNum;
    } else if (c === '{') {
      exprStack[exprStack.length - 1]++;
    } else if (c === '}') {
      exprStack[exprStack.length - 1]--;
      if (exprStack[exprStack.length - 1] === 0) {
        exprStack.pop();
        state = exprStack.length > 0 ? 'TEXPR' : (lastOpenTmpl > 0 ? 'TMPL' : 'JS');
        // Actually: after closing a ${}, we go back into TMPL if we were in one
        state = 'TMPL'; // always back to TMPL after ${}
      }
    } else if (c === '"') {
      state = 'STR_D_IN_TEXPR'; // simplified - just skip
    } else if (c === "'") {
      state = 'STR_S_IN_TEXPR';
    } else if (c === '/') {
      if (src[i+1] === '/') {
        while (i < src.length && src[i] !== '\n') i++;
      } else if (src[i+1] === '*') {
        i += 2;
        while (i < src.length && !(src[i] === '*' && src[i+1] === '/')) i++;
        i++;
      }
    }
  } else if (state === 'STR_D') {
    if (c === '\\') i++;
    else if (c === '"') state = 'JS';
  } else if (state === 'STR_S') {
    if (c === '\\') i++;
    else if (c === "'") state = 'JS';
  } else if (state === 'STR_D_IN_TEXPR') {
    if (c === '\\') i++;
    else if (c === '"') state = 'TEXPR';
  } else if (state === 'STR_S_IN_TEXPR') {
    if (c === '\\') i++;
    else if (c === "'") state = 'TEXPR';
  }
}

console.log('Final state:', state);
console.log('Brace depth:', braceDepth);
if (lastOpenTmpl > 0) console.log('Unclosed template literal opened at line:', lastOpenTmpl);
if (braceDepth > 0) console.log('Unclosed brace from lines:', lastOpenBrace.slice(-3));
if (exprStack.length > 0) console.log('Unclosed ${} expr stack:', exprStack);
if (state === 'JS' && braceDepth === 0) console.log('=> File looks syntactically balanced');
