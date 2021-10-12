'use strict';

const express = require('express');

const execute = require('./execute');
const { handleError } = require('./execute/middleware/error_handler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));

app.get('/callback', (req, res) => {
	// your application requests refresh and access tokens
  	// after checking the state parameter

	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
		querystring.stringify({
			error: 'state_mismatch'
		}));
	} else {
		res.clearCookie(stateKey);

		const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64'))
		},
		json: true
		};

		request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {

			const access_token = body.access_token,
				refresh_token = body.refresh_token;

			const options = {
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
});


app.post('/createConnection', (req, res) => {
	res.redirect(307, `/execute/${req.body.endpoint}`)
});

app.use('/execute', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);