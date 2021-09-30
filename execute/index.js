'use strict';

const express = require('express');

const {
    getTracks
} = require('./steps.js');

const router = express.Router();
router.use(getTracks);

router.route('/:id')
    .post(showResults);
    
module.exports = router;