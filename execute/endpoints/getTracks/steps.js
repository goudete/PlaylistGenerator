'use strict';

const axios = require('axios');

const config = require('../../../const');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me/tracks';
const LIMIT = 0;
const OFFSET = 0;

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
                'Authorization': `Bearer ${config.ACCESS_TOKEN}`
            }
        });

        req.info = {
            apiResponse: data
        };
        next();

    } catch (err) {
        next(err);
    }
};

const parse = async (req, res, next) => {
    try {
        const tracks = req.info.apiResponse.items;
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

const save = async (req, res, next) => {
    try {
        // send TRACK IDs to db
        // how to know which user is logged in?
        const track = {
            spotify_id,
            user_id,
        }

    } catch (err) {
        next(err);
    }
};

module.exports = {
    get,
    parse,
    // save
};