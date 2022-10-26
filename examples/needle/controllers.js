var needle = require('needle');
const fs = require('fs-extra')

function streamFile(req, res, _url, stream_dir) {

    let writeStream;
    const uri = _url;

    writeStream = fs.createWriteStream(`${stream_dir}` + `file.jpeg`); // we all know they must be JPEG

    writeStream.on("ready", () => console.log({ msg: `STREAM::WRITE::READY::FILE` }));
    writeStream.on("open", () => console.log({ msg: `STREAM::WRITE::OPEN::FILE` }));
    writeStream.on("finish", () => console.log({ msg: `STREAM::WRITE::DONE::FILE` }));

    writeStream.on('close', () => res.redirect('/'));

    needle
        .get(uri, function (error, response) {
            if (response.bytes >= 1) {
                // you want to kill our servers
            }

            if (!error && response.statusCode == 200) {
                // good
            } else {
                // then we can retry later
            }
        })
        .pipe(writeStream)
        .on('done', function () {
            // needle 
        });
}

function streamFiles(req, res, _urls, stream_dir, index = 0) {
    if (index == 0) {
        // initial state
    }

    let writeStream;
    const uri = _urls[index];

    if (index == undefined) {
        index = 0;
        streamFiles(req, res, _urls, stream_dir, index);
    } else {

        writeStream = fs.createWriteStream(`${stream_dir}` + `${index}.jpeg`); // we all know they must be JPEG

        writeStream.on("ready", () => console.log({ msg: `STREAM::WRITE::READY::${index}` }));
        writeStream.on("open", () => console.log({ msg: `STREAM::WRITE::OPEN::${index}` }));
        writeStream.on("finish", () => console.log({ msg: `STREAM::WRITE::DONE::${index}` }));

        writeStream.on('close', () => {
            if (index >= _urls.length - 1) {
                res.redirect('/');
            } else {
                streamFiles(req, res, _urls, stream_dir, index + 1);
            }
        })

        needle
            .get(uri, function (error, response) {
                if (response.bytes >= 1) {
                    // you want to kill our servers
                }

                if (!error && response.statusCode == 200) {
                    // good
                } else {
                    // then we can retry later
                }
            })
            .pipe(writeStream)
            .on('done', function () {
                // needle 
            });
    }
}

module.exports = { streamFile, streamFiles }