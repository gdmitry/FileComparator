
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

function readTextFile(file) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
        reader.onabort = function (e) {
            console.error('File read cancelled');
        };
        reader.readAsText(file);
    });
}

document.querySelector("#select").addEventListener('change', handleFileSelect, false);