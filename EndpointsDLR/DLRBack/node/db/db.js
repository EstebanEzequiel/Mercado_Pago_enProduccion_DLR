var fs = require("fs");
var promise = require('bluebird');
var pgp = require('pg-promise')({ promiseLib: promise });
var conf = JSON.parse(fs.readFileSync('../node/srv-config.json'));

//PostgreSQL
var pgConnectionData = {
    host: conf.database.host,
    port: conf.database.port,
    database: conf.database.database,
    user: conf.database.user,
    password: conf.database.password
};
var pgDatabase = pgp(pgConnectionData);

module.exports = pgDatabase;