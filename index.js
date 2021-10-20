'use strict';

const express = require('express');



const execute = require('./execute');
const { handleError } = require('./execute/middleware/error_handler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));


app.get('/login', require('./middleware/login'));
app.get('/callback', require('./middleware/callback'));
app.post('/createConnection', require('./middleware/redirect'));

app.use('/execute', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);

