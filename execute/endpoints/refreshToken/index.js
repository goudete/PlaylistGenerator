'use strict';

const express = require('express');
const router = express.Router();

const { refreshToken } = require('./steps.js');
const { showResults } = require('../../middleware/showResults');


router.use(refreshToken);
router.use(showResults);
    
module.exports = router;