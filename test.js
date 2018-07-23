var express = require("express");
var app = express();
var http = require('http').Server(app);
var port = process.env.port || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var Client = require('mongodb').MongoClient;



Client.connect('mongodb://192.168.0.24:27017/', function(error, db) {
    if(error) {
        console.log(error);
    }else {
        var member = new Array();
        console.log("good"+db);
        var dbo = db.db("chat");

        dbo.collection("member").find({}).toArray(function(err, result) {
            if(err) throw err;
            console.log(result);
            member = result;
        });
        
        http.listen(port, function() {
            console.log("Server Started port : "+port);
        });

        app.get('/', function(req,res) {
            res.sendFile('view/main.html', {
                root:__dirname
            });
        });

        app.post('/go', function(req,res) {
            console.log(req.body.ids);
            console.log(member);

            var getMemberId = String(req.body.ids);
            var getMemberPassword = String(req.body.password);
            for(var i=0; i < member.length; i++) {
                if((member[i].id) == getMemberId && member[i].password == getMemberPassword) {
                    res.sendFile('view/okgo.html', {
                        root:__dirname
                    });
                } else {
                    res.sendFile('view/main.html', {
                        root:__dirname
                    });
                }
            }
        });

        app.get('/test', function(req,res) {
            res.sendFile('Event.js', {
                root:__dirname
            });
        });

        db.close();
    }
});
