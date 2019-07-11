/**
 * Created by 
 */
// Load required packages

var mongoose = require('mongoose');
var multiparty = require('multiparty');
var fs = require('fs');
module.exports = {

    /* File upload to mongodb database , on success sending preview file array */
    fileUpload: function (req, res) {
        try {
            return new Promise(function (resolve, reject) {
                (new multiparty.Form()).parse(req, function (err, fields, files) {
                    if (!err) {
                        var fileArry = [];
                        var previewArray = [];
                        if (files.uploads != undefined) {
                            files.uploads.forEach(element => {
                                var img = fs.readFileSync(element.path);
                                var encode_image = img.toString('base64');
                                var finalImg = {
                                    contentType: element.headers['content-type'],
                                    image: new Buffer(encode_image, 'base64')
                                };
                                var finalPrevArray = {
                                    contentType: element.headers['content-type'],
                                    image: 'data:image/jpeg;base64,' + encode_image
                                }
                                fileArry.push(finalImg)
                                previewArray.push(finalPrevArray)
                            });
                            mongoose.connection.db.collection('test').insertMany(fileArry, (err, result) => {
                                if (err) reject(err)
                                resolve(previewArray)
                            })
                        } else {
                            res.status(400).send("No files found in request");
                        }
                    }
                })
            }).then((previewArray) => {
                res.status(200).send(previewArray);
            }).catch((err) => {
                res.status(500).send(err);
            })
        } catch (error) {
            res.status(500).send(error);
        }
    },

    /* get all uploaded files from database */
    getFiles: function (req, res) {
        return new Promise(function (resolve, reject) {
            mongoose.connection.db.collection('test').find({}).toArray(function (err, data) {
                if (err) {
                    reject(err);
                } else {                   
                    resolve(data);
                }
            })
        }).then((data) => {
            res.send({ result: data });
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
    },

    /* remove document by requested id of document */
    removeFile: function (req, res) {
        try {
            return new Promise(function (resolve, reject) {
                mongoose.connection.db.collection('test').remove({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, data) {
                    if (!err) {
                        resolve()
                    } else {
                        reject();
                    }
                })
            }).then((id) => {
                res.status(200).send({ result: 'success' })
            }).catch((err) => {
                res.status(500).send(err)
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

};

