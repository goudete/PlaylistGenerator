
'use strict';

const showResults = (req, res) => {
    return res.json({
        status: 'ok',
        type: req.body.agent_type,
        info: req.externalAgent.info,
    });
}

module.exports = {
    showResults,
};