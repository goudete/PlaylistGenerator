'use strict';

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const NUMBER_OF_PLAYLISTS = 10;

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;
    
    try {
        // get tracks
        const savedTracks = await postgres('track').where({ user_id: userId });
        const tempos = savedTracks.map((track) => track.tempo);
        const minTempo = Math.min(...tempos);
        const maxTempo = Math.max(...tempos);

        // create buckets (playlists)
        // 67.616 , 82.2332, 96.8504, 111.4676, 126.0848, 140.702 ,155.3192, 169.9364, 184.5536, 199.1708, 213.788
        const bucketRange = (maxTempo - minTempo) / NUMBER_OF_PLAYLISTS;
        
        let bucketLimits = [minTempo];
        
        for (let i = 1; i < NUMBER_OF_PLAYLISTS + 1; i++) {
            const currentRange = bucketLimits[i-1] + bucketRange;
            bucketLimits.push(currentRange);
        }

        // create actual buckets
        let buckets = [
            {start: 67, end: 83},
            {start: 84, end: 97}
        ]

        // cluster by tempo

        // save

        req.info = {
            minTempo,
            maxTempo,
            tempos,
            bucketLimits
        }

        showResults(req, res);

    } catch (err) {
        next(err);
    }

}