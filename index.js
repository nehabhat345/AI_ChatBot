'use strict';

require('dotenv').config()

//Neha Bhat
//From Dialog Flow Google Website

const APIAI_TOKEN = '4bf4f9c9a491491c88a08084799c2b41';
//const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
//var session = require('express-session');

var crypto = require('crypto');

var generate_key = function() {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(16).toString('base64');
};
//

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
 console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
 console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
 res.sendFile('index.html');
});

io.on('connection', function(socket) {
 socket.on('chat message', (text) => {
  console.log('Message: ' + text);

  // Get a reply from API.ai

  /*let apiaiReq = apiai.textRequest(text, {
    sessionId: APIAI_SESSION_ID
  });*/

  //
  // add & configure middleware
  //Functionality to get session id
  
  /*app.use(session({
   genid: function(req) {},
   secret: 'keyboard cat'
  }))*/

  //const APIAI_SESSION_ID = genuuid();
  
  var APIAI_SESSION_ID=generate_key();
  console.log("Hi Neha, your session id is::" + APIAI_SESSION_ID);
  var apiaiReq = apiai.textRequest(text, {
   sessionId: APIAI_SESSION_ID
  });

  apiaiReq.on('response', (response) => {
   let aiText = response.result.fulfillment.speech;
   console.log('Bot reply: ' + aiText);
   socket.emit('bot reply', aiText);
  });

  apiaiReq.on('error', (error) => {
   console.log(error);
  });

  apiaiReq.end();
 });
});