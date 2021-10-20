


const { generateRandomString } = require('./utils/generateRandomString');

const STATE = generateRandomString(16);
const SCOPE = `
				user-read-private 
			   	user-read-email 
				user-library-read 
				playlist-read-private 
				playlist-modify-private 
				playlist-modify-public

			`;

const RESPONSE_TYPE = 'code';



modules.export = (req, res) => {
	try {

        res.cookie(config.STATE_KEY, STATE);
        
        return res.redirect('https://accounts.spotify.com/authorize?' +
            JSON.stringify({
            response_type: RESPONSE_TYPE,
            client_id: config.CLIENT_ID,
            scope: SCOPE,
            redirect_uri: config.REDIRECT_URI,
            state: STATE
        }));
        
    } catch (err) {
        next(err);
    }
}