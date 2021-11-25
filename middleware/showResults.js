'use strict';

const showResults = (req, res) => {
    return res.status(200).json({
        status: 'ok',
        info: req.info,
    });
}

module.exports = {
    showResults,
};