const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'big-black-gym-log.js');
const outPath = path.join(__dirname, 'big-black-gym-log-minified.js');

let code = fs.readFileSync(srcPath, 'utf8');

// Identify sections
const sec4Start = code.indexOf('[SECTION IV]');
const sec5Start = code.indexOf('[SECTION V]');

if (sec4Start === -1 || sec5Start === -1) {
    console.error("Could not find section boundaries");
    process.exit(1);
}

const sec4Idx = code.lastIndexOf('/**', sec4Start);
const sec5Idx = code.lastIndexOf('/**', sec5Start);

let preSec4 = code.substring(0, sec4Idx);
const sec4 = code.substring(sec4Idx, sec5Idx);
let postSec4 = code.substring(sec5Idx);

// Function to minify code while preserving line structure and squashing control blocks
function customMinifySafe(text) {
    // 1. Remove block comments EXCEPT section headers and UserScript header
    text = text.replace(/\/\*[\s\S]*?\*\//g, (match) => {
        if (match.includes('[SECTION') || match.includes('==UserScript==')) {
            return match;
        }
        return '';
    });

    // 2. Remove inline comments (safely avoiding URLs)
    text = text.replace(/(?<!https?:)\/\/.*$/gm, '');

    // 3. Control Flow Header Squashing (if, else, for, while, try, catch)
    // Combine headers with opening braces even if they were on separate lines
    text = text.replace(/(if|for|while|catch)\s*\(([^)]+)\)\s*\n\s*{/g, '$1 ($2) {');
    text = text.replace(/else\s*\n\s*{/g, 'else {');
    text = text.replace(/try\s*\n\s*{/g, 'try {');
    text = text.replace(/finally\s*\n\s*{/g, 'finally {');
    
    // Join } and else/else if
    text = text.replace(/}\s*\n\s*else/g, '} else');

    // 4. Process line by line for general whitespace cleanup
    const lines = text.split('\n');
    const processedLines = [];
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) continue;
        processedLines.push(line);
    }
    
    let result = processedLines.join('\n') + '\n';
    
    // 5. Final block squashing: collapse simple one-line blocks
    // This targets blocks like { \n statement \n } and turns them into { statement }
    // We capture the entire header (if (...), else, etc.) in $1 and the body in $2
    result = result.replace(/((?:if|for|while|catch|else\s+if)\s*\([^)]+\)|else|try|finally)\s*{\n([^{}\n]+)\n}/g, '$1 { $2 }');
    
    return result;
}



code = fs.readFileSync(srcPath, 'utf8');
const s4Start = code.indexOf('[SECTION IV]');
const s5Start = code.indexOf('[SECTION V]');
const s4Idx = code.lastIndexOf('/**', s4Start);
const s5Idx = code.lastIndexOf('/**', s5Start);

let newPre = customMinifySafe(code.substring(0, s4Idx));
const newS4 = code.substring(s4Idx, s5Idx); // Keep exactly as authored
let newPost = customMinifySafe(code.substring(s5Idx));

const newFinal = newPre + '\n' + newS4 + '\n' + newPost;

fs.writeFileSync(outPath, newFinal, 'utf8');

console.log(`Minified successfully. Size: ${newFinal.length} bytes`);
