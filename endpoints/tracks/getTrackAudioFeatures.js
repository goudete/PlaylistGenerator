'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = '';

module.exports = async (req, res, next) => {

    const userId = req.body.user_id;

    try {
        const savedTracks = await postgres('track').where({user_id: userId});

        // for each track, query spotify for track's audio features
            // here we run into the question; what is better, 800 separate 
            // api calls and inserts OR one big api call with one big insert ?

        // update track with audio features

        return res.json({
            message: 'ok',
            savedTracks
        })
        req.info = {
            savedTracks
        }
        
        // return showResults(req, res)

    } catch (err) {
        next(err);
    }

}