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
    var matchInitial = checkSequence(seqMatchInfo.sequense, initial);

    console.log(matchModified, matchInitial);

}

function findLongestSubsequence(initial, modified) {
    var len = initial.length;
    var sequence, i, j, currentMatchInfo, matchInfoSequence = new MatchInfo([], 0, 0);

    for (i = 0; i < len; i++) {
        for (j = len; j > i; j--) {
            sequence = initial.slice(i, j);
            currentMatchInfo = checkSequence(sequence, modified);
            if (currentMatchInfo.sequense.length > matchInfoSequence.sequense.length) {
                matchInfoSequence = currentMatchInfo;
            }
        }
    }
    console.log("Pattern!!", checkSequence(matchInfoSequence.sequense, initial));
    return matchInfoSequence;
}

function MatchInfo(sequense, start, end) {
    this.sequense = sequense;
    this.start = start;
    this.end = end;
}

function checkSequence(sequence, lines) {
    var sequenseLength = sequence.length;
    var linesLength = lines.length;
    var emptyMatch = new MatchInfo([], 0, 0);
    var i, chunk;

    if (sequenseLength > linesLength) {
        return emptyMatch;
    }

    for (i = 0; i <= linesLength - sequenseLength; i++) {
        chunk = lines.slice(i, i + sequenseLength);
        if (compareArrays(chunk, sequence)) {
            return new MatchInfo(sequence, i, i + sequenseLength - 1);
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