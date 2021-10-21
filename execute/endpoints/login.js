
const config = require('../../const');
const querystring = require('querystring');
const { generateRandomString } = require('../../utils/generateRandomString');

const STATE = generateRandomString(16);
const SCOPE = `
				user-read-private 
				user-library-read 
				playlist-read-private 
				playlist-modify-private 
				playlist-modify-public

			`;

const RESPONSE_TYPE = 'code';



module.exports = (req, res, next) => {
	try {

        res.cookie(config.STATE_KEY, STATE);
        
        return res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: config.CLIENT_ID,
                scope: SCOPE,
                redirect_uri: config.REDIRECT_URI,
                state: STATE
            }));
        
    } catch (err) {
        next(err);
    }
};