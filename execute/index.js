'use strict';

const express = require('express');
const router = express.Router();

router.use('/refreshToken', require('./endpoints/refreshToken'));
router.use('/getTracks', require('./endpoints/getTracks'));
    
module.exports = router;