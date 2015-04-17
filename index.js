var fileCloud = {
    toHash: function (filename, next) {
        var fs = require('fs');
        var crypto = require('crypto');
        var hash = crypto.createHash('sha1');
        var fd = fs.createReadStream(filename);
        hash.setEncoding('hex');
        fd.on('end', function () {
            hash.end();
            next(hash.read())
        });
        // read all file and pipe it (write it) to the hash object
        fd.pipe(hash);
    },
    upload: function(uploader, filename, next) {
        uploader.upload(filename, next);
    },
    save: function(files, uploader, next) {

        var async = require('async');

        async.mapSeries(files, function (file, cb) {
            fileCloud.toHash(file.fd, function(hash) {
                uploader.upload(file.fd, function(result) {
                    if (!result.error) {
                        cb(null, {
                            success: true,
                            url: result.url,
                            hash: hash,
                            path: result.path
                        })
                    } else {
                        cb(null, {
                            success: false,
                            url: null,
                            hash: hash,
                            path: result.path
                        })
                    }
                });
            });

        }, function (err, results) {
            next(err, results);
        });
    }
}

module.exports.cloud = fileCloud;
module.exports.uploader = require("./uploader");
