'use strict';

const axios = require('axios');
const moment = require('moment')

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me';

module.exports = async (req, res, next) => {
    try {
        const access_token = req.body.access_token;
        const { data } = await helpers.getUser(access_token);
        const user = helpers.createUser(data, access_token);
        const isExistingUser = await postgres('users').where({ spotify_id: user.spotify_id });
        
        if (isExistingUser.length) {
            await postgres('users').where({ id: isExistingUser[0].id }).update({ access_token: access_token });
            return res.json({
                status: 'ok',
                message: 'user already exists',
                info: {
                    user: isExistingUser[0]
                }
            });
        } else {
            const insert = await postgres('users').insert([user]);
            
            req.info = {
                user
            }
            
            return showResults(req, res)
        }
    } catch (err) {
        next(err);
    }
}

const helpers = {
    getUser: async (access_token) => {
        return await axios({
            url: SPOTIFY_URL,
            method: 'GET',
            params: {
                json: true
            },
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
    },
    createUser: (data, access_token) => {
        const displayName = data.display_name;
        const country = data.country;
        const spotifyUri = data.uri;
        const spotifyId = data.id;
        const timestamp = moment().unix();
        const accessToken = access_token;

        return {
            display_name: displayName,
            country_code: country,
            created_at: timestamp,
            spotify_uri: spotifyUri,
            spotify_id: spotifyId,
            access_token: accessToken
        };
    },
}