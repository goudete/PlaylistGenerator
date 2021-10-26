'use strict';

const express = require('express');

const execute = require('./execute');
const { handleError } = require('./execute/middleware/errorHandler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));

app.get('/login', require('./execute/endpoints/auth/login'));
app.get('/callback', require('./execute/endpoints/auth/callback'));
app.get('/user', require('./execute/endpoints/auth/user'));
app.post('/execute', require('./execute/endpoints/redirect'));

app.use('/execute', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);

