const config = require('../const');

const postgres = require('knex')({
    client: 'pg',
    connection: 'postgres://localhost/playlistgenerator'
  });

module.exports = postgres;