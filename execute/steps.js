'use strict';

const axios = require('axios');

const config = require('../const');


const SPOTIFY_URL = 'https://api.spotify.com/v1/me/tracks';
const AGENT_TIMEOUT = 65000;


const getTracks = async (req, res, next) => {
    
    try {

        const { data: { response }, request: { path } } = await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            timeout: AGENT_TIMEOUT,
            params: {
                limit: 10,
                offset: 0,
            },
            headers: {
                'Authorization': `Bearer ${config.TOKEN}`
            }
        });
        const { Error } = response;
        if (Error && Error.ErrorCode) {
            next(`${Error.ErrorMsg}, Error Code ${Error.ErrorCode}`);
        } else {
            req.tracks = {
                response,
            };
            next();
        }

    } catch (err) {
        next(err);
    }

};

module.exports = {
    getTracks,
};