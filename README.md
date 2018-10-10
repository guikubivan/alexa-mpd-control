# alexa-mpd-control
Alexa app skill for mpd control: "Alexa, start My Player"

## Trigger word
Trigger word is set when setting up skill in amazon's Alexa developer console.

## Config

For production (or any other env), just create a new production.json (or env.json) file in config/ with the appropriate mpd info.

## Launching

Just make sure to set the PORT and NODE_ENV variables:

`PORT=[port] NODE_ENV=[environment] node server.js`

## SSL config
If you're using some kind of proxy server like NGINX, you probably don't need to configure SSL certificates. If you use node server directly, you just need to copy your certificate files to the `sslcert` folder as follows:

```
sslcert/
-- private-key.pem
-- certificate.pem
```
