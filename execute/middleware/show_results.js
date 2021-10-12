
'use strict';

const showResults = (req, res) => {
    return res.json({
        status: 'ok',
        endpoint: req.body.endpoint,
        info: req.info,
    });
}

module.exports = {
    showResults,
};