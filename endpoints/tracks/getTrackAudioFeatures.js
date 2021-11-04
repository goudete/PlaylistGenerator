'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/audio-features';

module.exports = async (req, res, next) => {

    const userId = req.body.user_id;

    try {
        const savedTracks = await postgres('track').where({user_id: userId});

        const audioFeaturesPromises = await Promise.all(
            savedTracks.map((track) => {
                return axios({
                    url: `${SPOTIFY_URL}/${track.spotify_id}`,
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
            trackUpdates
        }
        
        return showResults(req, res);

    } catch (err) {
        next(err);
    }

}