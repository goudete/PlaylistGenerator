'use strict';

const axios = require('axios');
const qs = require('qs');

const config = require('../../../const');

const SPOTIFY_URL = 'https://accounts.spotify.com/api/token';


const refreshToken = async (req, res, next) => {
    try {
        const bodyData = {
            'grant_type': 'refresh_token',
            'refresh_token': config.REFRESH_TOKEN
        }
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(bodyData),
            url: SPOTIFY_URL,
        };
        const spotifyResponse = await axios(options);

        req.info = {
            ...spotifyResponse.data,
        };
        next();
        
    } catch (err) {
        next(err);
    }

};

module.exports = {
    refreshToken,
};

