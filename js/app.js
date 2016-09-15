var initial = ["Some", "Simple", "Text", "File"];
var modified = ["Another", "Text", "File", "With", "Additional", "Lines"];

//var matchInfo = findLongestSubsequence(initial, modified);
diff(initial, modified);

function readTextFile(file) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
        reader.onload = function (e) {
            var lines = e.target.result.split('\n');
            resolve(lines);
        }
        reader.onabort = function (e) {
            console.error('File read cancelled');
            reject(e);
        };
        reader.readAsText(file);
    });
}

function diff(initial, modified) {
    var matchModified = findLongestSubsequence(initial, modified);
    var matchInitial = checkSequence(matchModified.sequence, initial);

    var initialBefore = initial.slice(0, matchInitial.start);
    var initialAfter = initial.slice(matchInitial.end + 1, initial.length);

    var modifiedBefore = modified.slice(0, matchModified.start);
    var modifiedAfter = modified.slice(matchModified.end + 1, modified.length);

    //console.log(initialBefore, initialAfter, modifiedBefore, modifiedAfter);
    //runDiff(initialBefore, modifiedBefore);
    runDiff(initialAfter, modifiedAfter);
}

function runDiff(initial, modified) {
    var maxLength = Math.max(initial.length, modified.length);
    var initialLength = initial.length;
    var modifiedLength = modified.length;
    var i;

    console.log(initial, modified);

    for (i = 0; i < maxLength + 1; i++) {
        if (i < initialLength && i < modifiedLength) {
            if (initial[i] === modified[i]) {
                console.log("No changes");
            } else {
                console.log("modified");
            }
        }

        if (i > initialLength) {
            console.log("inserted");
        }
        if (i > modifiedLength) {
            console.log("deleted");
        }
    }
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