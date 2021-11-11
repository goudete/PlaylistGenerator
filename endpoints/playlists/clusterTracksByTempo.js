'use strict';

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const NUMBER_OF_PLAYLISTS = 10;
const DESCRIPTIONS = [
    'zen mode',
    'chill vibes',
    'cruisin\'',
    'groovy',
    'funky',
    'the zone',
    'upbeat',
    'hyperfreak',
    'let\'s get crazy',
    'throw shit off the porch'
]

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;
    
    try {
        const savedTracks = await postgres('track').where({ user_id: userId });
        const tempos = savedTracks.map((track) => track.tempo);
        const minTempo = Math.min(...tempos);
        const maxTempo = Math.max(...tempos);
        const bucketRange = (maxTempo - minTempo) / NUMBER_OF_PLAYLISTS;
        
        let bucketLimits = [minTempo];
        for (let i = 1; i < NUMBER_OF_PLAYLISTS + 1; i++) {
            const currentRange = bucketLimits[i-1] + bucketRange;
            bucketLimits.push(currentRange);
        }

        let buckets = [];
        for (let i = 1; i < bucketLimits.length; i++) {
            if (i === 1) {
                const bucket = {
                    start: Math.floor(bucketLimits[i-1]),
                    end: Math.ceil(bucketLimits[i]),
                }
                buckets.push(bucket);
            } else {
                const bucket = {
                    start: Math.ceil(bucketLimits[i-1]) + 0.0001,
                    end: Math.ceil(bucketLimits[i]),
                }
                buckets.push(bucket);
            }
        }

        for (let i = 0; i < buckets.length; i++) {
            let bucket = {
                ...buckets[i],
                description: DESCRIPTIONS[i]
            }
            buckets[i] = bucket
        }
        
        const playlists = buckets.map((bucket) => ({
            name: `${Math.ceil(bucket.start)} - ${bucket.end}`,
            description: bucket.description,
            user_id: userId,
            range_start: bucket.start,
            range_end: bucket.end
        }));
        const insert = await postgres('playlist').insert(playlists);

        const savedPlaylists = await postgres('playlist').where({ user_id: userId });


        const assignPlaylistToTrack = await Promise.all(
            savedTracks.map((track) => {
                const playlistId = getPlaylistId(savedPlaylists, track);
                return postgres('track').where({id: track.id}).update({ playlist_id: playlistId })
            })
        );

        req.info = {
            savedTracks,
            minTempo,
            maxTempo,
            tempos,
            bucketLimits,
            buckets,
            playlists,
            savedPlaylists,
            assignPlaylistToTrack
        }

        showResults(req, res);

    } catch (err) {
        next(err);
    }

}

function getPlaylistId(playlists, track) {
    const playlist = playlists.find(playlist => playlist.range_start <= track.tempo && track.tempo <= playlist.range_end);
    return playlist?.id;
}