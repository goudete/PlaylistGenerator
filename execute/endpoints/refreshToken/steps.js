'use strict';

const axios = require('axios');

const config = require('../../../const');


const SPOTIFY_URL = 'https://accounts.spotify.com/api/token';
const AGENT_TIMEOUT = 65000;


const refreshToken = async (req, res, next) => {
    try {

        const { data: { response }, request: { path } } = await axios({
            url: SPOTIFY_URL,
            method: 'POST',
            timeout: AGENT_TIMEOUT,
            form: {
                grant_type: 'refresh_token',
                refresh_token: 'AQD1PvZF4pWJvx3JnWgFttFTOWhxgg6bRbGbYHiNRGYu83EILWQQD5vApybMGPPysnPKjY1mj57eEE3hmBXb1UHEqU174rB-3gofE1ys5xJHk4Ngjy6OmrTc94tGw2ZVEwg'
            },
            headers: {'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64')) },
        });
        const { Error } = response;
        if (Error && Error.ErrorCode) {
            next(`${Error.ErrorMsg}, Error Code ${Error.ErrorCode}`);
        } else {
            req.token = {
                response,
            };
            next();
        }

    } catch (err) {
        next(err);
    }

};

module.exports = {
    refreshToken,
};