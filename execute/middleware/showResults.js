
'use strict';

const showResults = (req, res) => {
    return res.status(200).json({
        status: 'ok',
        endpoint: req.body.endpoint,
        info: req.info,
    });
}

module.exports = {
    showResults,
};