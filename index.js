'use strict';

module.change_code = 1;

// var _ = require('lodash');

var Alexa = require('alexa-app');

var app = new Alexa.app('mpdcontrol');

var MpdInterface = require('./mpd_interface');
var mpd = new MpdInterface();


app.launch(function(req, res) {
  console.log('launch');
  mpd.play();
  var prompt = 'Haha, keep it popping!';
  res.say(prompt).reprompt(prompt).shouldEndSession(true);
});


// app.sessionEnded(function(req, res) {
//   console.log('sessionedned', req);
//     // Clean up the user's server-side stuff, if necessary
//     mpd.stop();
//     // logout( request.userId );
//     // No response necessary
//     res.say("Awww");
// });

app.intent('playmusic', {
	  'utterances': ['play{| music}']
	},
  function(req, res) {
    console.log('playmusic');
    mpd.play();
    res.say("Haha, keep it popping.");
  }
);

app.intent('playmusiconreceiver', {
	  'utterances': ['play{| music} on receiver']
	},
  function(req, res) {
    console.log('playmusiconreceiver');
    mpd.playOnHomeTheater();
    res.say("Meesa play on big sound.");
  }
);


app.intent('AMAZON.StopIntent', {},
  function(req, res) {
    console.log('stop');
    mpd.stop();
    res.say("Awwwww, no more popping.");
  }
);

app.intent('AMAZON.PauseIntent', {},
  function(req, res) {
    console.log('pause');
    mpd.pause();
  }
);

app.intent('AMAZON.ResumeIntent', {},
  function(req, res) {
    console.log('resume');
    mpd.play();
  }
);

module.exports = app;
