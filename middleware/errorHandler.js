'use strict';


const handleError = async (error, req, res, next) => {
    const status = 'error';
    const message = `Error: ${error}`;
    const stack = error.stack;

    res.status(500).json({
        status,
        stack,
        message,
    });
};

module.exports = {
    handleError,
};