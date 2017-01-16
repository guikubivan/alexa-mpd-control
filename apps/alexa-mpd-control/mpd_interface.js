'use strict';

var mpd = require('mpd'),
    cmd = mpd.cmd;

var client = mpd.connect({
  port: 6600,
  host: '192.168.0.50',
});

var mpdInfo = {
  stats: {}
};

client.on('ready', function() {
  client.sendCommand(cmd("stats", []), function(err, msg) {
    if (err) throw err;
    var tmp = convertListToObject(msg);
    mpdInfo.stats.artistCount = parseInt(tmp.artists);
    mpdInfo.stats.albumCount = parseInt(tmp.albums);
    mpdInfo.stats.songCount = parseInt(tmp.songs);
  });
});


var retrieveStatusInterval = setInterval(function() {
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    var tmp = convertListToObject(msg);
    mpdInfo.volume = parseInt(tmp.volume);
  });
}, 1000);


var retrieveSongInfoInterval = setInterval(function() {
  client.sendCommand(cmd("currentsong", []), function(err, msg) {
    if (err) throw err;
    var tmp = convertListToObject(msg);
    mpdInfo.artist = tmp.Artist;
    mpdInfo.title = tmp.Title;
  });
}, 1000);


function convertListToObject(myString){
  var lines = myString.split("\n");
  var newObject = {};

  for(var i=0; i<lines.length; ++i){
    if(lines[i]){
      var tmp = lines[i].split(/^([^:]+):\s*(.*)\s*$/)
      newObject[tmp[1]] = tmp[2];
    }
  }
  return newObject;
}


// clearInterval(interval);

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
  this.stop();
  this.clearCurrentPlaylist();

  client.sendCommand(cmd("searchadd", ["artist", artist]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  this.play();

  return "Playing " + artist;
};

MpdInterface.prototype.clearCurrentPlaylist = function(artist) {
  client.sendCommand(cmd("clear", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};


MpdInterface.prototype.whatIsPlaying = function() {
  return "Playing " + mpdInfo.title + " by " + mpdInfo.artist;
};

/* Returns a promise */
MpdInterface.prototype.getRandomAlbumName = function(){
  var promise = new Promise(
    function(resolve, reject) {
      var albumIndex = Math.floor(Math.random() * (mpdInfo.stats.albumCount + 1)) + 1;
      client.sendCommand(cmd("list", ["album"]), function(err, msg) {
        if (err) throw err;
        var lines = msg.split("\n");
        var albumName = convertListToObject(lines[albumIndex]).Album;
        resolve(albumName);
      });
    }
  );

  return promise;
};

MpdInterface.prototype.playRandomAlbum = function(albumName){
  this.stop();
  this.clearCurrentPlaylist();
  client.sendCommand(cmd("searchadd", ["album", albumName]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  this.play();
  var resp = "Playing album: " + albumName;

  return resp;
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