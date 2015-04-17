var assert = require("assert");
describe('file-cloud', function () {
    describe('#toHash()', function () {
        it("should be able to hash a file", function (done) {
            var fs = require('fs');
            var imageManager = require("./../index");
            imageManager.cloud.toHash("./test/testfile", function (hash) {
                assert(true, hash === 'dccb0dc10fffeae9facdc448d6ad5ce3e8caaf93');
                done();
            });
        });
    });

    describe('#save()', function () {

        var fs = require('fs');
        var crypto = require('crypto');
        var fileCloud = require("./../index");

        /*
        it("should be able to upload a file", function (done) {
            var cloudinary = require('cloudinary');

            cloudinary.config({
                cloud_name: 'www-t1bao-com',
                api_key: '113187556849673',
                api_secret: '7Z3oC5a8o4Ii55djpwGu_ZfGS38'
            });
            var fs = require('fs');
            var validator = require("validator");
            imageManager.save([{
                fd: '7.png'
            }], cloudinary.uploader, function (error, results) {
                console.log(error);
                console.log(results);
                assert(true, error == true);
                assert(true, results.length == 1);
                assert(true, results[0].success === true);
                assert(true, validator.isEmail(results[0].url));

                assert(true, results[0].hash === '990dedf3b21ec4ba321b8a92aab0bce8bcff87ce');
                done();
            });
        });
        */

        it("should be able to upload a file to local file system", function (done) {

            var uploader = require("./../uploader");
            uploader.config({
                base: "http://soudld.com",
                dir: 'test/upload'
            });
            var dest = "test/upload/990dedf3b21ec4ba321b8a92aab0bce8bcff87ce.png";
            var file = 'test/7.png';
            var fs = require("fs");
            if (fs.existsSync(dest)) {
                fs.renameSync(dest, file);
             }
            fileCloud.cloud.save([{
                fd: file
            }], uploader, function (error, results) {
                var validator = require("validator");
                assert(true, error == true);
                assert(true, results.length == 1);
                assert(true, results[0].success === true);
                assert(true, validator.isURL(results[0].url));
                assert(true, results[0].hash === '990dedf3b21ec4ba321b8a92aab0bce8bcff87ce');
                done();
            });
        });
    });
});