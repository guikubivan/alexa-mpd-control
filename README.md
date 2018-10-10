# alexa-mpd-control
Alexa app skill for mpd control: "Alexa, start Jukebox".

Includes intents for "play", "pause", "play [group]", "what is playing", "play random album", "what's playing", 'shuffle on/off', "loop on/off", and "play on receiver" (set output in config).

Note trigger word is set when setting up skill in amazon's Alexa developer console.

## Config

For production (or any other env), just create a new production.json (or env.json) file in config/ with the port to use and the appropriate mpd info. Config values will cascade down from default.json if not set.

## Launching

Just make sure to set the NODE_ENV variable:

`NODE_ENV=[environment] node server.js`

## SSL config
If you're using some kind of proxy server like NGINX, you probably don't need to configure SSL certificates. If you use node server directly, copy your certificate files to the `sslcert` folder as follows:

```
sslcert/
-- private-key.pem
-- certificate.pem
```
