// JavaScript source code
var http = require('http');
var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
    //res.redirect('TntWkDiRn.html');
    res.send("<h1>HELLO HEROKU</h1>");
})

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&req.query['hub.verify_token'] === 'MYAPPSTRO_TOKEN') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }
});

app.post('/webhook', function(req, res){
    var data = req.body;
    console.log(data);
    if(data.object === 'page'){
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function(event){
                if(event.message){
                    receivedMessage(event);
                }else{
                    console.log("Webhook received unknown event: ", event);
                }
            })
        });
    }
    res.sendStatus(200);
})

function receivedMessage(event){
    console.log
}

http.createServer(app).listen(process.env.PORT || 8080, function () {
   console.log('Server running at http://sugarcanesoft.iptime.org');
});