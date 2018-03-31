var mysqld = require('sync-mysql');
var dbconf = require('../config/db_conf.js');
var connection = new mysqld(dbconf);

module.exports = connection;