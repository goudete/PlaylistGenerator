'use strict';

const axios = require('axios');
const moment = require('moment')

const config = require('../../../const');
const postgres = require('../../../clients/postgres');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me';

module.exports = async (req, res, next) => {
    try {
        const { data } = await helpers.getUser();
        const user = helpers.createUser(data);
        const isExistingUser = await postgres('users').where({spotify_uri: user.spotify_uri});
        
        if (isExistingUser.length) {
            return res.json({
                message: 'user already exists',
                isExistingUser
            });
        } else {
            const insert = await postgres('users').insert([user]);
            return res.json({
                message: 'user already exists',
                user
            });
        }
    } catch (err) {
        next(err);
    }
}

const helpers = {
    getUser: async () => {
        return await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            params: {
                json: true
            },
            headers: {
                'Authorization': `Bearer ${config.ACCESS_TOKEN}`
            }
        })
    },
    createUser: (data) => {
        const displayName = data.display_name;
        const country = data.country;
        const spotifyUri = data.uri;
        const timestamp = moment().unix();

        return {
            display_name: displayName,
            country_code: country,
            created_at: timestamp,
            spotify_uri: spotifyUri
        };
    },
}