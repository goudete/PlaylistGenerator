'use strict';

const express = require('express');

const { handleError } = require('./middleware/errorHandler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));

app.get('/login', require('./endpoints/auth/login'));
app.get('/callback', require('./endpoints/auth/callback'));
app.get('/refreshToken', require('./endpoints/auth/refreshToken'));
app.get('/user', require('./endpoints/auth/user'));

app.post('/getTracks', require('./endpoints/tracks/getTracks'));
app.post('/getTrackAudioFeatures', require('./endpoints/tracks/getTrackAudioFeatures'));

app.post('/clusterTracksByTempo', require('./endpoints/playlists/clusterTracksByTempo'));

app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Listening on http://${consts.HOST}:${consts.PORT}`);

