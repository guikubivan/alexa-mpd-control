'use strict';

var mpd = require('mpd'),
    cmd = mpd.cmd
var client = mpd.connect({
  port: 6600,
  host: '192.168.0.50',
});



function MpdInterface() { }


MpdInterface.prototype.play = function() {
  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  return "Haha, keep it popping";
};

MpdInterface.prototype.playOnHomeTheater = function() {
  client.sendCommand(cmd("enableoutput", [0]), function(err, msg) {
    if (err){
      console.log(err);
      throw err;
     }
    console.log(msg);
  });

  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.playArtist = function(artist) {
  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  client.sendCommand(cmd("clear", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  client.sendCommand(cmd("searchadd", ["artist", artist]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  this.play();

  return "Playing " + artist;
};

MpdInterface.prototype.pause = function() {
  client.sendCommand(cmd("pause", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  return "Aww, no more popping.";
};

MpdInterface.prototype.stop = function() {
  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  return "Aww, no more popping.";
};

MpdInterface.prototype.next = function() {
  console.log('next');
  client.sendCommand(cmd("next", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.previous = function() {
  client.sendCommand(cmd("prev", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.loopOn = function() {
  client.sendCommand(cmd("repeat", [1]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  client.sendCommand(cmd("single", [1]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  client.sendCommand(cmd("consume", [0]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.loopOff = function() {
  client.sendCommand(cmd("repeat", [0]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  client.sendCommand(cmd("single", [0]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
  client.sendCommand(cmd("consume", [1]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.shuffleOn = function() {
  client.sendCommand(cmd("random", [1]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.shuffleOff = function() {
  client.sendCommand(cmd("random", [0]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

module.exports = MpdInterface;
