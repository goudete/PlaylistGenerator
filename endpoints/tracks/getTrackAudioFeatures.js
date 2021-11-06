'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/audio-features';
const MAX_CHARACTERS_FOR_IDS_IN_QUERY = 1500;
const TRACK_ID_LENGTH = 22;

module.exports = async (req, res, next) => {

    const userId = req.body.user_id;

    try {
        const savedTracks = await postgres('track').where({user_id: userId});

        const totalTracks = savedTracks.length;
        const totalIdsPerGrouping = Math.ceil(MAX_CHARACTERS_FOR_IDS_IN_QUERY / TRACK_ID_LENGTH); // 69
        const totalGroupings = Math.ceil(totalTracks / totalIdsPerGrouping); // 13

        let idGroupings = [];

        // create idGroupings
        for (let i = 0; i < totalGroupings; i++) {
            let currentGrouping = [];
            for (let j = 0; j < totalIdsPerGrouping; j++)  {
                currentGrouping.push(savedTracks[(i*totalGroupings)+j].spotify_id); // figure out indexing issue here, almost there
            }
            idGroupings.push(currentGrouping.join(','));
        }

        // greatly decrease number of calls, getting a 429
        const audioFeaturesPromises = await Promise.all(
            idGroupings.map((grouping) => {
                return axios({
                    url: `${SPOTIFY_URL}/${grouping}`,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.ACCESS_TOKEN}`,
                    }
                })
            })
        );

        const audioFeatures = audioFeaturesPromises.map((audio) => audio.data)

        const trackUpdates = await Promise.all(
            audioFeatures.map((feature) => {
                return postgres('track').where({spotify_id: feature.id}).update({tempo: feature.tempo, danceability: feature.danceability, energy: feature.energy})
            })
        );

        req.info = {
            savedTracks,
            audioFeatures,
            trackUpdates,
            idGroupings
        }
        
        return showResults(req, res);

    } catch (err) {
        next(err);
    }

}