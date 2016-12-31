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


MpdInterface.prototype.pause = function() {

  client.sendCommand(cmd("pause", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.pause = function() {

  client.sendCommand(cmd("pause", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

MpdInterface.prototype.stop = function() {

  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

module.exports = MpdInterface;
