var logger = require("./logger");
var express = require("express");
var morgan = require("morgan");
var openurl = require("openurl");
var path = require("path");
var http = require("http");
var socket = require("socket.io");
var watch = require("node-watch");
var cheerio = require("cheerio");
var interceptor = require("express-interceptor");
var compress = require("compression");

var server = module.exports = function spaServ(config) {
    var self = this;
    var app = express();
    var server = http.createServer(app);
    var io = socket(server);
    var currentEnd;
    
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
    
    function ignoreFilter(pattern, fn) {
        return function(filename) {
            if (!pattern) fn(filename);
            
            var reg = new RegExp(pattern);
            if (!reg.test(filename)) {
                fn(filename);
            }
        };
    }
    
    function setupWatch() {
        watch(config.rootFolder, ignoreFilter(config.ignoreFiles, function(filename) {
           logger.fileChanged(filename);
           io.emit('spa-serv:refresh', { filename: filename });
        }));
    }
    
    function injectClient(req, res) {
        return {
            isInterceptable: function() {
                return (req._parsedUrl.pathname === "/" || req._parsedUrl.pathname === "index.html") && /text\/html/.test(res.get('Content-Type')); 
            },
            intercept: function (body, send) {
                var $document = cheerio.load(body);
                var address = config.address || "localhost";
                $document('body').append('<script type="text/javascript">window.spaServAddress = "' + address + ":" + config.port + '"</script>');
                $document('body').append('<script type="text/javascript" src="/spa-serv/spa-serv-client.js"></script>');
                send($document.html());
            }
        };
    }
    
    function setup() {
        cors();
        if (config.enableCompression === true) {
            app.use(compress());
        }
        setupWatch();
        app.use(interceptor(injectClient));
        app.use(morgan('combined', logger.morgan()));
        app.use('/spa-serv', express.static(path.join(__dirname, './../public')));        
        app.use('/', express.static(config.rootFolder));
    }
    
    self.start = function (launchBrowser) {
        setup();
        var address = config.address || "localhost";
        server.listen(config.port, address, 511, function() {
            logger.keyValue('Server started on', address + ":" + config.port);
        });
        
        if (launchBrowser) {
            openurl.open("http://" + address + ":" + config.port);
        }
    };
};


