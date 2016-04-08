var logger = require("./logger");
var express = require("express");
var morgan = require("morgan");
var openurl = require("openurl");

var server = module.exports = function spaServ(config) {
    var self = this;
    var app = express();
    
    function cors() {
        if (!config.CORS) return;
        
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', config.CORS.allowOrigin);
            res.header('Access-Control-Allow-Methods', config.CORS.allowMethods);
            res.header('Access-Control-Allow-Headers', config.CORS.allowHeaders);
            
            if ('OPTIONS' == req.method) {
                res.sendStatus(200);
            }
            else {
                next();
            }
        });
        
        logger.info('CORS enabled...');
        logger.keyValue('CORS Allowed Origin', config.CORS.allowOrigin);
        logger.keyValue('CORS Allowed Methods', config.CORS.allowMethods);
        logger.keyValue('CORS Allowed Headers', config.CORS.allowHeaders);
    }
    
    var logStream = {
        write: function (message, encoding) {
            console.log(message);
        }
    };
    
    function setup() {
        cors();        
        app.use(morgan(logger.response(':date[web]', ':status', ':method', ':url'), { "stream": logStream }));
        app.use('/', express.static(config.rootFolder));
    }
    
    self.start = function (launchBrowser) {
        setup();
        app.listen(config.port, function() {
            logger.keyValue('Server started on port', config.port);
        });
        
        if (launchBrowser) {
            openurl.open("http://localhost:" + config.port);
        }
    };
};


