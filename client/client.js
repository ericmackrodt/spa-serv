var io = require("socket.io-client");
var popup = require("./popup");
var socket = io.connect("http://localhost:" + window.spaServPort);
socket.on('connect', function (socket) {
    console.log('Spa-serv client connected');
    popup.show('Connected to SPA-SERV');
});

socket.on("spa-serv:refresh", function (data) {
    console.log(data.filename + ' changed');
    location.reload();
});