
var handleFileSelect = function (e) {
    var files = e.target.files;
    var fl = files.length;
    var i, f;

    for (i = 0, f; f = files[i]; i++) {
        var isText = f.type.match('image.*');
        /* if (!isText) {
             continue;
         }*/
        readTextFile(f)
            .then(function (file) {
                console.log(file);
            });
    }
}

function Pattern(list, start, end) {
    this.list = list;
    this.start = start;
    this.end = end;
}
var original  = ["Some", "Simple", "Text", "File"];
function splitOnPatterns(list) {
    var len = list.length;
    var arr, i, j, pattern, maxLen = 0, temp;
    var modified = ["Another", "Text", "File", "With", "Additional", "Lines"];
    for (i = 0; i < len; i++) {
        for (j = len; j > i; j--) {
            arr = list.slice(i, j);
            //  console.log('=====================');
            // console.log(arr);
            temp = findPattern(arr, modified);
            if (temp.list.length > maxLen) {
                pattern = temp;
                maxLen = temp.list.length;
            }
        }
    }
    console.log("Pattern!!", findPattern(pattern.list, original));
}

splitOnPatterns(original);

function findPattern(pattern, original) {
    var patternLen = pattern.length;
    var originalLen = original.length;
    var i, result;
    var empty = new Pattern([], 0, 0);

    if (patternLen > originalLen) {
        return empty;
    }

    for (i = 0; i <= originalLen - patternLen; i++) {
        result = compare(original.slice(i, i + patternLen), pattern);
        if (result) {
            return new Pattern(pattern, i, i + patternLen - 1);
        }
    }
    return empty;
}

function compare(arr1, arr2) {
    var i = 0;
    while (i < arr1.length) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
        i++;
    }
    return true;
}

function readTextFile(file) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
        reader.onload = function (e) {
            var lines = e.target.result.split('\n');
            resolve(lines);
        }
        reader.onabort = function (e) {
            console.error('File read cancelled');
        };
        reader.readAsText(file);
    });
}

document.querySelector("#select").addEventListener('change', handleFileSelect, false);