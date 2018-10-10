var AlexaAppServer = require('alexa-app-server');



var MpdInterface = require('./apps/alexa-mpd-control/mpd_interface');
var mpd = new MpdInterface();
var config = require('config');

AlexaAppServer.start({
  port: config.get('port'),
  server_root:__dirname,     // Path to root
//    public_html:"public_html", // Static content
  app_dir:"apps",            // Where alexa-app modules are stored
//    app_root:"/alexa/",        // Service root
  preRequest: function(json,req,res) {
    console.log("preRequest fired", json.request.intent && json.request.intent.name);
    json.userDetails = { "name":"Bob Smith" };

    var retPromise = new Promise(function(resolve, reject){
      if(json.request.intent && json.request.intent.name === "randalbum"){
        mpd.getRandomAlbum().then(function(albumInfo){
           json[json.request.intent.name] = albumInfo;
          resolve(json);
        });
      }else{
        resolve(json);
      }
    });
    return retPromise;
  },
  // Add a dummy attribute to the response
  postRequest: function(json, req, res) {
    json.dummy = "text";
  },
  httpsPort:443,
  httpsEnabled:true,
  privateKey:'private-key.pem',
  certificate:'certificate.pem'
});
