'use strict';

const express = require('express');

const execute = require('./execute');
const { handleError } = require('./execute/middleware/error_handler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));

app.post((req, res) => {
  res.redirect(307, `/createConnection/refreshToken`)
});

app.use('/createConnection', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);