'use strict';

const axios = require('axios');
const qs = require('qs');

const config = require('../../../const');

const SPOTIFY_URL = 'https://accounts.spotify.com/api/token';


const refreshToken = async (req, res, next) => {
    try {

        const bodyData = {
            // 'grant_type': 'refresh_token',
            'refresh_token': 'AQD1PvZF4pWJvx3JnWgFttFTOWhxgg6bRbGbYHiNRGYu83EILWQQD5vApybMGPPysnPKjY1mj57eEE3hmBXb1UHEqU174rB-3gofE1ys5xJHk4Ngjy6OmrTc94tGw2ZVEwg'
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer('90df0c14062c4846944107803c60cd4a' + ':' + '3d1ca02a3b2746b49e58899142e81d53').toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(bodyData),
            url: SPOTIFY_URL,
        };

        const data = await axios(options);
        console.log('data:', data)

        // req.token = {
        //     response,
        // };
        // next();
        

    } catch (err) {
        next(err);
    }

};

module.exports = {
    refreshToken,
};

