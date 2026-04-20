
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
let openBraces = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let prev = openBraces;
    for (let char of line) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
    }
    if (openBraces < 0) {
        console.log(`NEGATIVE BRACES at line ${i + 1}: ${line}`);
        openBraces = 0;
    }
    // We expect openBraces to be 0 at the end of every top-level component.
    // Let's print the line when it hits 0 from something else.
    if (prev !== 0 && openBraces === 0) {
        console.log(`Block closed at line ${i+1}`);
    }
}
console.log(`Final open braces: ${openBraces}`);
