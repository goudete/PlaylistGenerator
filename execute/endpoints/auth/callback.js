
const config = require('../../../const');
const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');


module.exports = async (req, res, next) => {

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.headers.cookie ? req.headers.cookie.slice(19) : null;
  
    if (isInvalidState(state, storedState)) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
        return;
    }

    res.clearCookie(config.STATE_KEY);

    const requestBody = {
        code,
        redirect_uri: config.REDIRECT_URI,
        grant_type: 'authorization_code'
    }

    try {
        const { status, data: { access_token, refresh_token }} = await axios({
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(requestBody),
            url: 'https://accounts.spotify.com/api/token',
        });

        console.log({
            message: "ok",
            status,
            access_token,
            refresh_token
        });

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