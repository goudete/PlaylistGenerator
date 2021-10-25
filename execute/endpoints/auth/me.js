'use strict';

const axios = require('axios');
const moment = require('moment')

const config = require('../../../const');
const postgres = require('../../../clients/postgres');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me';

module.exports = async (req, res, next) => {
    try {
        const { data } = await helpers.getMe();
        const me = helpers.createMe(data);

        // this line is acting out, related to postgres config
        // const insert = await postgres('users').insert([me]);

        return res.json({
            message: 'ok',
            me
        });

    } catch (err) {
        next(err);
    }
}

const helpers = {
    getMe: async () => {
        return await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            params: {
                json: true
            },
            headers: {
                'Authorization': `Bearer ${config.TOKEN}`
            }
        })
    },
    createMe: (data) => {
        const displayName = data.display_name;
        const country = data.country;
        const timestamp = moment().unix();

        return {
            display_name: displayName,
            country_code: country,
            created_at: timestamp
        };
    },
}