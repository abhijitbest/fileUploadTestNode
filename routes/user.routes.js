module.exports = function(app) {
var User=require('../controllers/user.controller');

/* File upload through directive api */
app.post('/upload',User.fileUpload);

/* Get All uploaded files list */
app.get('/getFiles',User.getFiles);

/* Remove file with id */
app.delete('/removeFile/:id',User.removeFile)
}