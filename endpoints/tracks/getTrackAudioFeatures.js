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

        // for each track, query spotify for track's audio features
            // here we run into the question; what is better, 800 separate 
            // api calls and inserts OR one big api call with one big insert ?

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

        // update track with audio features

        req.info = {
            savedTracks,
            audioFeatures
        }
        
        return showResults(req, res)

    } catch (err) {
        next(err);
    }

}