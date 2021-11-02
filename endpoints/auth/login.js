
const config = require('../../../const');
const { generateRandomString } = require('../../../utils/generateRandomString');
const querystring = require('querystring');

const RESPONSE_TYPE = 'code';

module.exports = (req, res, next) => {
    try {
        const state = generateRandomString(16);
        res.cookie(config.STATE_KEY, state);
        
        return res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: RESPONSE_TYPE,
                client_id: config.CLIENT_ID,
                scope: config.SCOPE,
                redirect_uri: config.REDIRECT_URI,
                state: state
            }));
        
    } catch (err) {
        next(err);
    }
};