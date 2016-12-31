'use strict';

module.change_code = 1;

// var _ = require('lodash');

var Alexa = require('alexa-app');

var app = new Alexa.app('mpdcontrol');

var MpdInterface = require('./mpd_interface');
var mpd = new MpdInterface();


function getMpdTriggerFunction(funcName) {
  return function(req, res){
    console.log("Triggered built-in intent: ", funcName);
    var say = mpd[funcName]();
    if(say){
      res.say(say);
    }
  }
}

var builtInIntents = [
  { name: "AMAZON.PauseIntent", func: getMpdTriggerFunction('pause') },
  { name: "AMAZON.ResumeIntent", func: getMpdTriggerFunction('play') },
  { name: "AMAZON.NextIntent", func: getMpdTriggerFunction('next') },
  { name: "AMAZON.PreviousIntent", func: getMpdTriggerFunction('previous') },
  { name: "AMAZON.LoopOnIntent", func: getMpdTriggerFunction('loopOn') },
  { name: "AMAZON.LoopOffIntent", func: getMpdTriggerFunction('loopOff') },
  { name: "AMAZON.ShuffleOnIntent", func: getMpdTriggerFunction('shuffleOn') },
  { name: "AMAZON.ShuffleOffIntent", func: getMpdTriggerFunction('shuffleOff') }
];


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

app.intent('stopmusic', {
	  'utterances': ['stop{| music}']
	},
  function(req, res) {
    console.log('stopmusic');
    var say = mpd.stop();
    if(say) res.say(say);
  }
);

app.intent('playmusicgroup', {
	  'slots': {
	    'MUSICGROUP': 'AMAZON.MusicGroup'
	  },
	  'utterances': ['{play|listen|listen to}{| some} {-|MUSICGROUP}']
  },
  function(req, res){
    console.log('playgorup', req);
    var artist = req.slot('MUSICGROUP');
    console.log(artist);

    res.say(mpd.playArtist(artist));
  }
);

for(var i=0; i < builtInIntents.length; ++i) {
  app.intent(builtInIntents[i].name, {}, builtInIntents[i].func);
}


module.exports = app;
