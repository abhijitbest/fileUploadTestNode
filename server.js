var http=require('http');
var express=require('express');
var app = express();
var server = http.createServer(app);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');

/* enable cors */
var cors = require('./services/cors');
app.use(cors);

server.listen(config.PORT);
app.set('server', server);
app.use(bodyParser.json({
    limit: '20mb'
}));
  
app.use(bodyParser.urlencoded({
     extended: true
    , limit: '20mb'
}));

/* Database connection using mongoose package */
mongoose.connect(config.DB_URL,function(err,conn){
    if(!err){
        console.log("Database connected");
    }else{
        console.log("Not connected to db");
    }
});

/* sending req to routes */
require('./routes/user.routes')(app);


