'use strict';

const axios = require('axios');

const config = require('../../../const');
const postgres = require('../../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = '';

module.exports = (req, res, next) => {

    const userId = req.body.user_id;
    const spotifyUri = req.body.spotify_uri;

    try {

        // query to get a user's tracks

        // for each track, query spotify for track's audio features

        // update track with audio features
        
        return showResults(req, res)

    } catch (err) {
        next(err);
    }

}