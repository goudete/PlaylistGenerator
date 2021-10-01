'use strict';

const express = require('express');

const showResults = require('../../middleware/show_results')

const {
    getTracks
} = require('./steps.js');

const router = express.Router();
router.use(getTracks);

router.post(showResults);
    
module.exports = router;