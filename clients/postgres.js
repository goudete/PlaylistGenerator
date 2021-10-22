const config = require('../const');

const postgres = require('knex')({
    client: 'pg',
    connection: {
        host: config.POSTGRES_HOST,
        user: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        database: config.DB,
    },
});

module.exports = postgres;