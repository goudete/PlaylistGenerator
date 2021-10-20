'use strict';

const express = require('express');
const router = express.Router();

const { login } = require('./steps.js');
const { showResults } = require('../../middleware/show_results');


router.use(login);
router.use(showResults);
    
module.exports = router;