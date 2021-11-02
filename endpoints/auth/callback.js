
const config = require('../../../const');
const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');


module.exports = async (req, res, next) => {

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.headers.cookie ? req.headers.cookie.slice(19) : null;
  
    if (isInvalidState(state, storedState)) {
        helpers.redirect(res);
    }

    res.clearCookie(config.STATE_KEY);

    try {
        const { status, data: { access_token, refresh_token }} = await helpers.getTokens(code);

        return res.status(200).json({
            message: "ok",
            status,
            access_token,
            refresh_token
        })
    } catch (err) {
        next(err)
    }
};


function isInvalidState(state, storedState) {
    return state === null || state !== storedState;
}

const helpers = {
    redirect: (res) => {
        return res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    },
    getTokens: async (code) => {
        const requestBody = {
            code,
            redirect_uri: config.REDIRECT_URI,
            grant_type: 'authorization_code'
        }

        return axios({
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(requestBody),
            url: 'https://accounts.spotify.com/api/token',
        });
    },
}