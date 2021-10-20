'use strict';

const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');

const config = require('../../../const');

const SPOTIFY_URL = 'https://accounts.spotify.com/api/token';


const STATE_KEY = 'spotify_auth_state';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://0.0.0.0:3000/callback';
const SCOPE = 'user-read-private user-read-email user-library-read';

const login = async (req, res, next) => {
    try {

        const state = generateRandomString(16);

        res.cookie(STATE_KEY, state);
        
        return res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: RESPONSE_TYPE,
            client_id: config.CLIENT_ID,
            scope: SCOPE,
            redirect_uri: REDIRECT_URI,
            state: state
        }));
        
    } catch (err) {
        next(err);
    }

};

module.exports = {
    login,
};

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};