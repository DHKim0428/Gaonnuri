// JavaScript source code
var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
//app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received Message for user %d and page %d at %d with message: ", senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if(messageText){
        switch(messageText){
            case 'generic':
                sendGenericMessage(senderID);
                break;
            default:
                sendTextMessage(senderID, messageText);
        }
    }else if(messageAttachments){
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendGenericMessage(recipientId, messageText){

}

function sendTextMessage(recipientId, messageText){
    var messageData = {
        recipient:{
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData){
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAZAmb2fcdZBEBAKTv4xsZAZBBspH8y9vnVmZBzmogqHZAS4mTAd5p35Pzp0npXqYI9MyZAF9b60lE89RBh6axgKWfiOW4WB3ZC3FL1G1FpgBe5XCBO7Oh41WnM9SOZC1H8ztfxu9tmIpmlMZBDqSMltWFFRwgndipBY14ns2iNYztZBPa7ZAEcN1x4j'},
        method: 'POST',
        json: messageData
    }, function(error, response, body){
        if(!error && response.statusCode == 200){
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
        }else{
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

http.createServer(app).listen(process.env.PORT || 8080, function () {
   console.log('Server running at http://sugarcanesoft.iptime.org');
});