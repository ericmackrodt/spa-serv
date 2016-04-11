var io = require("socket.io-client");
var socket = io.connect("http://localhost:" + window.spaServPort);
socket.on("spa-serv:refresh", function (data) {
    console.log(data.filename + ' changed');
    location.reload();
});