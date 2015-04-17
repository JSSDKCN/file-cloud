var base = null;
var dir = null;

var uploader = {
    config: function(config) {
        base = config.base;
        dir = config.dir;
    },
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
    upload: function(filename, next) {
        uploader.toHash(filename, function(hash) {
            var fs = require("fs");
            var path = require("path");
            var newFilename = hash + path.extname(filename);
            var realPath = newFilename;
            if (dir) {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                realPath = dir + "/" + newFilename;
            }
            fs.rename(filename, realPath, function(error) {
                if (error) {
                    next({
                        error: true
                    });
                } else {
                    next({
                        error: false,
                        url: base + "/" + newFilename
                    });
                }
            });
        });
    }
}

module.exports = uploader;