'use strict';

const express = require('express');

const router = express.Router();

// guards middleware would go here

router.use('/login', require('./endpoints/login'));
router.use('/refreshToken', require('./endpoints/refreshToken'));
router.use('/getTracks', require('./endpoints/getTracks'))
    
module.exports = router;