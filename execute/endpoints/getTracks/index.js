'use strict';

const express = require('express');
const router = express.Router();

const { getTracks } = require('./steps.js');
const { showResults } = require('../../middleware/show_results')


router.use(getTracks);
router.use(showResults);
    
module.exports = router;