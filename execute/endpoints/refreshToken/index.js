'use strict';

const express = require('express');
const router = express.Router();

const { showResults } = require('../../middleware/show_results')
const { refreshToken } = require('./steps.js');

router.use(refreshToken);
router.post(showResults);
    
module.exports = router;