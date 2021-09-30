'use strict';

const axios = require('axios');

const config = require('@root/const');


const SPOTIFY_URL = 'https://api.spotify.com/v1/tracks';
const AGENT_TIMEOUT = 65000;


const getTracks = async (req, res, next) => {
    
    try {
        // add HEADER Bearer Token
        const { data: { response }, request: { path } } = await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            timeout: AGENT_TIMEOUT,
            params: {
                ids: req.externalAgent.info.cleanQuery, // TRACK ID
            },
        });
        const { Error } = response;
        if (Error && Error.ErrorCode) {
            next(`${Error.ErrorMsg}, Error Code ${Error.ErrorCode}`);
        } else {
            req.externalAgent.info = {
                ...req.externalAgent.info,
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