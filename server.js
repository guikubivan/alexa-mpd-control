var AlexaAppServer = require('alexa-app-server');



var MpdInterface = require('./apps/alexa-mpd-control/mpd_interface');
var mpd = new MpdInterface();


AlexaAppServer.start({
//    server_root:__dirname,     // Path to root
//    public_html:"public_html", // Static content
//    app_dir:"apps",            // Where alexa-app modules are stored
//    app_root:"/alexa/",        // Service root
  preRequest: function(json,req,res) {
    console.log("preRequest fired", json.request.intent && json.request.intent.name);
    json.userDetails = { "name":"Bob Smith" };

    var retPromise = new Promise(function(resolve, reject){
      if(json.request.intent && json.request.intent.name === "randalbum"){
        mpd.getRandomAlbumName().then(function(albumInfo){
           json[json.request.intent.name] = albumInfo;
          resolve(json);
        });
      }else{
        resolve(json);
      }
    });
    return retPromise;
  },
  port:8092,                 // What port to use, duh
  httpsPort:443,
  httpsEnabled:true,
  privateKey:'private-key.pem',
  certificate:'certificate.pem'
});
