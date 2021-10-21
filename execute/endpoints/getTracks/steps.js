'use strict';

const axios = require('axios');

const config = require('../../../const');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me/tracks';


const get = async (req, res, next) => {
    try {
        const { data } = await axios({
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
            spotifyData: data
        };
        next();

    } catch (err) {
        next(err);
    }
};

const parse = async (req, res, next) => {
    try {
        const tracks = req.info.spotifyData.items;
        const trackIds = tracks.map((item) => item.track.id)

        req.info = {
            ...req.info,
            trackIds
        }
        next();
        
    } catch (err) {
        next(err);
    }
};

// const save = async (req, res, next) => {
//     try {
//         // send TRACK IDs to db

//     } catch (err) {
//         next(err);
//     }
// };

module.exports = {
    get,
    parse,
    // save
};