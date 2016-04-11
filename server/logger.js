var colors = require('colors');
var moment = require('moment');

var logger = module.exports = {};

function statusColor(statusCode) {
    var status = statusCode.toString();
    var firstNum = status.substring(0, 1);
    switch (firstNum) {
        case "2":
            return status.green;
        case "3":
            return status.yellow;
        case "4":
        case "5":
            return status.red;
        default:
            return status.white;
    }   
}

function currentFormatedDate() {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}

logger.morgan = function () {
    return { 'skip': function (req, res) {
         console.log(currentFormatedDate() + ' - ['.white + req.method.cyan + '] ['.white + statusColor(res.statusCode) + '] - '.white + req.url);
         return true;
    }};
};

logger.info = function (text) {
    console.log(text.cyan);  
};

logger.keyValue = function (key, value) {
    console.log((key + ':').green + ' ' + value.toString().white);
};

logger.fileChanged = function (file) {
    console.log((file).green + ' changed.'.white);
};

logger.error = function (text) {
    console.log(text.red);
};