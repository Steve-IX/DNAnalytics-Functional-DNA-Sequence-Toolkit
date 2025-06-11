"use strict";

const testlib = require('./testlib.js');

let sequenceBuffer = '';
let globalOffset = 0; // Track the position 
let frequencyCounts = {};
let patterns = []; 

testlib.on('ready', function(loadedPatterns) {
    // Store patterns s
    patterns = loadedPatterns;
    // frequnecy counting 
    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
    testlib.runTests();
});

let lastProcessed = 0; // New variable 

testlib.on('data', function(data) {
    sequenceBuffer += data;
    globalOffset += data.length; 


    patterns.forEach(pattern => {
        let regex = new RegExp(pattern, 'g');
        let match;
        while ((match = regex.exec(sequenceBuffer)) !== null) {
            let matchOffset = globalOffset - sequenceBuffer.length + match.index;
            if (matchOffset + pattern.length <= globalOffset && match.index >= lastProcessed) {
                testlib.foundMatch(pattern, matchOffset);
            }
        }
    });

    lastProcessed = sequenceBuffer.length;

    // Trims the buffer
    let maxLength = Math.max(...patterns.map(p => p.length));
    if (sequenceBuffer.length > maxLength) {
        sequenceBuffer = sequenceBuffer.slice(-maxLength);
        lastProcessed -= maxLength; // Adjusts
    }
});

testlib.on('reset', function() {
    // Report the frequency counts
    testlib.frequencyTable(frequencyCounts);
    // Reset
    sequenceBuffer = '';
    
    patterns.forEach(pattern => frequencyCounts[pattern] = 0);
    globalOffset = 0;
});

testlib.setup(2); 
//task 2 
