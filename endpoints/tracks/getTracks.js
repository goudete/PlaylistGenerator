'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/me/tracks';

let items = [];
let totalSongs = 0;
let offset = 0;
const limit = 10;

module.exports = async (req, res, next) => {

    const userId = req.body.user_id;

    try {
        while (offset <= totalSongs) {
            const { data } = await axios({
                url: SPOTIFY_URL,
                method: 'GET',
                params: {
                    limit,
                    offset
                },
                headers: {
                    'Authorization': `Bearer ${config.ACCESS_TOKEN}`
                }
            });

            totalSongs = data.total;
            items.push(...data.items);

            offset += limit
        }

        const tracksToInsert = items.map((item) => ({ spotify_id: item.track.id, user_id: userId, name: item.track.name }));
        // const insert = await postgres('track').insert(tracksToInsert);

        req.info = {
            totalSongs,
            items,
            tracksToInsert,
            // insert
        }
        
        return showResults(req, res);

    } catch (err) {
        next(err);
    }
};