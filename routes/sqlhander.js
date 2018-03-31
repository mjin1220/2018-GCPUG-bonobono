var mysql = require('mysql');
var dbconf = require('../config/db_conf.js');
var connection = new mysql(dbconf);

module.exports = connection;