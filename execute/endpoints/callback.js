
const config = require('../../const');
const querystring = require('querystring');
var request = require('request');


module.exports = (req, res) => {

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.headers.cookie ? req.headers.cookie.slice(19) : null;
  
	if (state === null || state !== storedState) {
	  res.redirect('/#' +
		querystring.stringify({
			error: 'state_mismatch'
		}));
	} else {
	  	res.clearCookie(config.STATE_KEY);
	  	var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: config.REDIRECT_URI,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64'))
			},
			json: true
	  	};
  
	  request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
  
			var access_token = body.access_token,
				refresh_token = body.refresh_token;
	
			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
	
			// use the access token to access the Spotify Web API
			request.get(options, function(error, response, body) {
				console.log(body);
			});
	
			// we can also pass the token to the browser to make requests from there
			res.redirect('/#' +
				querystring.stringify({
				access_token: access_token,
				refresh_token: refresh_token
				}));
		} else {
		  res.redirect('/#' +
			querystring.stringify({
				error: 'invalid_token'
			}));
		}
	  });
	}
};