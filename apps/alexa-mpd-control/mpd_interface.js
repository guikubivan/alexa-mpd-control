'use strict';

var mpd = require('mpd'),
    cmd = mpd.cmd;

var client = mpd.connect({
  port: 6600,
  host: '127.0.0.1',
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
  });

  return "Haha, keep it popping";
};

MpdInterface.prototype.playOnHomeTheater = function() {
  var thisInterface = this;
  client.sendCommand(cmd("enableoutput", [0]), function(err, msg) {
    if (err){
      console.log(err);
      throw err;
     }
     
     // Home Theaters usually take a bit to turn on
     setTimeout(function() {
       thisInterface.play();
     }, 500);
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
MpdInterface.prototype.getRandomAlbum = function(){
  var thisInstance = this;
  var promise = new Promise(function(resolve, reject) {
    var albumIndex = Math.floor(Math.random() * (mpdInfo.stats.albumCount + 1)) + 1;
    client.sendCommand(cmd("list", ["album"]), function(err, msg) {
      if (err) throw err;
      var lines = msg.split("\n");
      var randAlbumLine = lines[albumIndex];
      if(randAlbumLine){
        var albumName = convertListToObject(randAlbumLine).Album;

        thisInstance.getAlbumArtist(albumName).then(function(albumArtist){
          resolve({
            name: albumName,
            artist: albumArtist
          });
        });
      }else{
        console.log('empty album?');
        resolve({});
      }
    });
  });

  return promise;
};

MpdInterface.prototype.getAlbumArtist = function(albumName){
  var promise = new Promise(
    function(resolve, reject) {
      client.sendCommand(cmd("search", ["album", albumName]), function(err, msg) {
        if (err) throw err;
        var tmp = convertListToObject(msg);

        resolve(tmp.Artist);
      });
    }
  );

  return promise;
};

MpdInterface.prototype.playRandomAlbum = function(albumInfo){
  this.stop();
  this.clearCurrentPlaylist();
  client.sendCommand(cmd("searchadd", ["album", albumInfo.name]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  this.play();
  var resp = "Playing album: " + albumInfo.name  + " by " + albumInfo.artist;

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
