'use strict';

const express = require('express');
const router = express.Router();

const { get, parse } = require('./steps.js');
const { showResults } = require('../../middleware/showResults')


router.use([get, parse]);
router.use(showResults);
    
module.exports = router;