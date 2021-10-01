'use strict';

const express = require('express');

const showResults = require('../../middleware/show_results')

const {
    refreshToken
} = require('./steps.js');

const router = express.Router();
router.use(refreshToken);

router.post(showResults);
    
module.exports = router;