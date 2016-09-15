// Mocks
//var initial = ["Some", "Simple", "Text", "File"];
//var modified = ["Another", "Text", "File", "With", "Additional", "Lines"];

readFiles("C:\\Users\\Dima\\Documents\\Github\\FileComparator\\original.txt",
    "C:\Users\\Dima\\Documents\\Github\\FileComparator\\modified.txt");

function readFiles(originalUrl, modifiedUrl) {
    Promise.all([
        httpRequest(originalUrl, 'GET'),
        httpRequest(modifiedUrl, 'GET')
    ]).then(function (files) {    
        var originalSplitted = removeEmptyStrings(files[0].replace(/ /g,'').split("\n"));
        var modifiedSplitted = removeEmptyStrings(files[1].replace(/ /g,'').split("\n"));
       diff(originalSplitted, modifiedSplitted);
    });
}

function diff(initial, modified) {
    var matchModified = findLongestSubsequence(initial, modified);
    var matchInitial = checkSequence(matchModified.sequence, initial);

    var initialBefore = initial.slice(0, matchInitial.start);
    var initialAfter = initial.slice(matchInitial.end + 1, initial.length);

    var modifiedBefore = modified.slice(0, matchModified.start);
    var modifiedAfter = modified.slice(matchModified.end + 1, modified.length);

    var diffBefore = runDiff(initialBefore, modifiedBefore);
    var diffCommon = runSebsequence(matchModified.sequence);
    var diffAfter = runDiff(initialAfter, modifiedAfter);

    var diff = diffBefore.concat(diffCommon, diffAfter);

    printOverallResult(diff);
}

function removeEmptyStrings(array) {
    return array.filter(function(line) {
        return line.length;
    });
}

function runDiff(initial, modified) {
    var maxLength = Math.max(initial.length, modified.length);
    var initialLength = initial.length;
    var modifiedLength = modified.length;
    var i, result, diffs = [];

    for (i = 0; i < maxLength; i++) {
        if ((i < initialLength) && (i < modifiedLength)) {
            if (initial[i] === modified[i]) {
                result = " " + initial[i];
            } else {
                result = " * " + initial[i] + " | " + modified[i];
            }
        }
        if ((i + 1) > initialLength) {
            result = " + " + modified[i];
        }
        if ((i + 1) > modifiedLength) {
            result = " - " + initial[i];
        }
        diffs.push(result);
    }
    return diffs;
}

function printOverallResult(diff) {
    var length = diff.length;
    var i;

    for (i = 0; i < length; i++) {
        console.log(i + 1 + diff[i]);
    }
}

function runSebsequence(subsequence) {
    var length = subsequence.length;
    var i, result, diffs = [];

    for (i = 0; i < length; i++) {
        result = "  " + subsequence[i];
        diffs.push(result);
    }
    return diffs;
}

function findLongestSubsequence(initial, modified) {
    var len = initial.length;
    var sequence, i, j, currentMatchInfo, matchInfoSequence = new MatchInfo([], 0, 0);

    for (i = 0; i < len; i++) {
        for (j = len; j > i; j--) {
            sequence = initial.slice(i, j);
            currentMatchInfo = checkSequence(sequence, modified);
            if (currentMatchInfo.sequence.length > matchInfoSequence.sequence.length) {
                matchInfoSequence = currentMatchInfo;
            }
        }
    }
    return matchInfoSequence;
}

function MatchInfo(sequence, start, end) {
    this.sequence = sequence;
    this.start = start;
    this.end = end;
}

function checkSequence(sequence, lines) {
    var sequenceLength = sequence.length;
    var linesLength = lines.length;
    var emptyMatch = new MatchInfo([], 0, 0);
    var i, chunk;

    if (sequenceLength > linesLength) {
        return emptyMatch;
    }

    for (i = 0; i <= linesLength - sequenceLength; i++) {
        chunk = lines.slice(i, i + sequenceLength);
        if (compareArrays(chunk, sequence)) {
            return new MatchInfo(sequence, i, i + sequenceLength - 1);
        }
    }

    return emptyMatch;
}

function compareArrays(arr1, arr2) {
    var i = 0;
    while (i < arr1.length) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
        i++;
    }
    return true;
}