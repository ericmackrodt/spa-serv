var colors = require('colors');

var logger = module.exports = {};

logger.response = function (dateTime, status, method, url) {
      return dateTime.white + ' - ' + ('[' + status + ']').cyan + (' [' + method + ']').green + ' - ' + url;
};

logger.info = function (text) {
    console.log(text.cyan);  
};

logger.keyValue = function (key, value) {
    console.log((key + ':').green + ' ' + value.toString().white);
};

logger.error = function (text) {
    console.log(text.red);
};