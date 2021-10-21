'use strict';

const axios = require('axios');

const config = require('../../../const');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me/tracks';


const getTracks = async (req, res, next) => {
    try {
        const spotifyResponse = await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            params: {
                limit: 10,
                offset: 0,
            },
            headers: {
                'Authorization': `Bearer ${config.TOKEN}`
            }
        });

        req.info = {
            ...spotifyResponse.data,
        };
        next();

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTracks,
};