"use strict";

const testlib = require('./testlib.js');

let sequenceBuffer = '';
let globalOffset = 0;
let frequencyCounts = {};
let patterns = [];
let regexPatterns = [];
let reportedMatches = new Set(); // Track reported matches globally

const nucleotideMapping = { //mapping 
  'R': '[AG]', 'Y': '[CT]', 'K': '[GT]', 'M': '[AC]',
  'S': '[CG]', 'W': '[AT]', 'B': '[CGT]', 'D': '[AGT]',
  'H': '[ACT]', 'V': '[ACG]', 'N': '[ACGT]',
};

function convertToRegexPattern(sequence) {
  return sequence.split('').map(nucleotide => nucleotideMapping[nucleotide] || nucleotide).join('');
}

//ready function
testlib.on('ready', function(loadedPatterns) {
    patterns = loadedPatterns;
    regexPatterns = patterns.map(convertToRegexPattern);
    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
    testlib.runTests();
});

//data function
testlib.on('data', function(data) {
    sequenceBuffer += data;
    globalOffset += data.length;

    regexPatterns.forEach((regexPattern, index) => {
        let regex = new RegExp(regexPattern, 'g');
        let match;
        while ((match = regex.exec(sequenceBuffer)) !== null) {
            let matchOffset = globalOffset - sequenceBuffer.length + match.index;
            let matchKey = `${patterns[index]}@${matchOffset}`;
            if (!reportedMatches.has(matchKey)) {
                testlib.foundMatch(patterns[index], matchOffset);
                frequencyCounts[patterns[index]] += 1;
                reportedMatches.add(matchKey);
            }
        }
    });


    // last part for the frequence buffer 
    let maxLength = Math.max(...patterns.map(p => p.length));
    if (sequenceBuffer.length > maxLength) {
        sequenceBuffer = sequenceBuffer.slice(-maxLength);
    }
});

//resets sequence buffer function
testlib.on('reset', function() {
    testlib.frequencyTable(frequencyCounts);
    sequenceBuffer = '';
    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
    globalOffset = 0;
    reportedMatches.clear();
});

testlib.setup(3);
