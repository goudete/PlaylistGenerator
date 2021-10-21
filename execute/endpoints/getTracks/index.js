'use strict';

const express = require('express');
const router = express.Router();

const { get, parse, save } = require('./steps.js');
const { showResults } = require('../../middleware/show_results')


router.use(get, parse, save);
router.use(showResults);
    
module.exports = router;