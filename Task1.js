"use strict";

const testlib = require('./testlib.js');

let sequenceBuffer = '';
let frequencyCounts = {};
let patterns = []; //patetrns become accessible in the global scope of the script

testlib.on('ready', function(loadedPatterns) {
    // Store the loaded patterns 
    patterns = loadedPatterns;
    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
    testlib.runTests();
});

testlib.on('data', function(data) {
    sequenceBuffer += data;
    
    //finds overlapping occurrences
    patterns.forEach(pattern => {
        let regex = new RegExp(`(?=${pattern})`, 'g');
        let matches = sequenceBuffer.match(regex);
        if (matches) {
            frequencyCounts[pattern] += matches.length;
        }
    });

    // last part for the sequence buffer 
    let maxLength = Math.max(...patterns.map(p => p.length));
    if (sequenceBuffer.length > maxLength) {
        sequenceBuffer = sequenceBuffer.slice(-maxLength);
    }
});

testlib.on('reset', function() {
    // Report the frequency counts
    testlib.frequencyTable(frequencyCounts);
    // Reset
    sequenceBuffer = '';

    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
});

testlib.setup(1); // Runs for task 1 
