#! /usr/bin/env node
"use strict";

var SpaServ = require('./server/spa-serv');
var logger = require('./server/logger');
var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, '/default-config.json'), 'utf8'));

try {
    config = JSON.parse(fs.readFileSync('./spa-serv-config.json'), 'utf8');
    logger.info("Using user configuration...");    
} catch (ex) {
    logger.info("Using default configuration...");
}

var server = new SpaServ(config);
server.start(true);