'use strict';

const axios = require('axios');
const _ = require('lodash');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/audio-features';
const MAX_CHARACTERS_FOR_IDS_IN_QUERY = 1500;
const TRACK_ID_LENGTH = 22;

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;

    try {
        const savedTracks = await postgres('track').where({ user_id: userId });
        const totalTracks = savedTracks.length;

        const idGroupings = helpers.createIdGroupings(savedTracks, totalTracks);

        const audioFeaturesPromises = await Promise.all(
            idGroupings.map((grouping) => {
                return axios({
                    url: `${SPOTIFY_URL}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${config.ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        ids: grouping
                    }
                })
            })
        );

        const audioFeatures = audioFeaturesPromises.map((audio) => audio.data.audio_features)
        const flattenedAudioFeatures = _.flatten(audioFeatures);

        const trackUpdates = await Promise.all(
            flattenedAudioFeatures.map((track) => {
                return postgres('track').where({spotify_id: track.id}).update({tempo: track.tempo, danceability: track.danceability, energy: track.energy})
            })
        );

        req.info = {
            totalTracks,
            flattenedAudioFeatures,
            idGroupings
        }
        
        return showResults(req, res);

    } catch (err) {
        next(err);
    }

}

const helpers = {
    createIdGroupings: (savedTracks, totalTracks) => {
        const totalIdsPerGrouping = Math.ceil(MAX_CHARACTERS_FOR_IDS_IN_QUERY / TRACK_ID_LENGTH);
        const totalGroupings = Math.ceil(totalTracks / totalIdsPerGrouping);
        let idGroupings = [];
        let currentTrackIndex = 0;

        for (let i = 0; i < totalGroupings; i++) {
            let currentGrouping = [];
            for (let j = 0; j < totalIdsPerGrouping; j++)  {
                if (currentTrackIndex >= totalTracks) break;
                currentGrouping.push(savedTracks[currentTrackIndex].spotify_id);
                currentTrackIndex += 1;
            }
            idGroupings.push(currentGrouping.join(','));
        }

        return idGroupings
    },
}