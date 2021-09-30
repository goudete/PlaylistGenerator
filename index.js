'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const execute = require('./execute');
const { handleError } = require('./execute/middleware/error_handler');


const app = express();

app.use(bodyParser.json({ limit: '5mb' }));

app.post('/run', run, (req, res) => {
  res.redirect(307, `/run-agent/${req.body.agent_type}/${req.body.id}`)
});


app.use('/run-agent', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);




//  var request = require('request'); // "Request" library



//   const generateRandomString = function(length) {
//    var text = '';
//    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
//    for (var i = 0; i < length; i++) {
//      text += possible.charAt(Math.floor(Math.random() * possible.length));
//    }
//    return text;
//  };
 
 
//  app.get('/login', function(req, res) {
 
//    var state = generateRandomString(16);
//    res.cookie(stateKey, state);
 
//    // your application requests authorization
//    var scope = 'user-read-private user-read-email';
//    res.redirect('https://accounts.spotify.com/authorize?' +
//      querystring.stringify({
//        response_type: 'code',
//        client_id: client_id,
//        scope: scope,
//        redirect_uri: redirect_uri,
//        state: state
//      }));
//  });
 
//  app.get('/callback', function(req, res) {
 
//    // your application requests refresh and access tokens
//    // after checking the state parameter
 
//    var code = req.query.code || null;
//    var state = req.query.state || null;
//    var storedState = req.cookies ? req.cookies[stateKey] : null;
 
//    if (state === null || state !== storedState) {
//      res.redirect('/#' +
//        querystring.stringify({
//          error: 'state_mismatch'
//        }));
//    } else {
//      res.clearCookie(stateKey);
//      var authOptions = {
//        url: 'https://accounts.spotify.com/api/token',
//        form: {
//          code: code,
//          redirect_uri: redirect_uri,
//          grant_type: 'authorization_code'
//        },
//        headers: {
//          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//        },
//        json: true
//      };
 
//      request.post(authOptions, function(error, response, body) {
//        if (!error && response.statusCode === 200) {
 
//          var access_token = body.access_token,
//              refresh_token = body.refresh_token;
 
//         console.log('ACCESS TOKEN BITCH:', access_token)
//         console.log('REFRESH TOKEN:', refresh_token)
//          var options = {
//            url: 'https://api.spotify.com/v1/me',
//            headers: { 'Authorization': 'Bearer ' + access_token },
//            json: true
//          };
 
//          // use the access token to access the Spotify Web API
//          request.get(options, function(error, response, body) {
//            console.log(body);
//          });
 
//          // we can also pass the token to the browser to make requests from there
//          res.redirect('/#' +
//            querystring.stringify({
//              access_token: access_token,
//              refresh_token: refresh_token
//            }));
//        } else {
//          res.redirect('/#' +
//            querystring.stringify({
//              error: 'invalid_token'
//            }));
//        }
//      });
//    }
//  });
 
//  app.get('/refresh_token', function(req, res) {
 
//    // requesting access token from refresh token
//   //  var refresh_token = req.query.refresh_token;
//    var authOptions = {
//      url: 'https://accounts.spotify.com/api/token',
//      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//      form: {
//        grant_type: 'refresh_token',
//        refresh_token: 'AQD1PvZF4pWJvx3JnWgFttFTOWhxgg6bRbGbYHiNRGYu83EILWQQD5vApybMGPPysnPKjY1mj57eEE3hmBXb1UHEqU174rB-3gofE1ys5xJHk4Ngjy6OmrTc94tGw2ZVEwg'
//      },
//      json: true
//    };
 
//    request.post(authOptions, function(error, response, body) {
//      if (!error && response.statusCode === 200) {
//        var access_token = body.access_token;
//        console.log('ACCESS TOKEN:', access_token)
//        res.send({
//          'access_token': access_token
//        });
//      }
//    });
//  });
 