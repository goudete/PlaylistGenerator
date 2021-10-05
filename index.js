'use strict';

const express = require('express');

const execute = require('./execute');
const { handleError } = require('./execute/middleware/error_handler');
const consts = require('./const.js');


const app = express();
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb'}));

app.post('/createConnection', (req, res) => {
  console.log('*** IN MAIN INDEX ABOUT TO REDIRECT ***')
  res.redirect(307, `/execute/${req.body.endpoint}`)
});

app.use('/execute', execute);
app.use(handleError);


const server = app.listen(consts.PORT, consts.HOST);
console.log(`Running on http://${consts.HOST}:${consts.PORT}`);