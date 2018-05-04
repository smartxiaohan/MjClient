var common = require("./common.js");
var net = {};

net.connect = function() {
    var ws = new WebSocket("ws://192.168.17.8:8001");

    common.socket = ws;
    ws.onopen = function (event) {
        console.log("Send Text WS was opened.");
    };
    ws.onmessage = function (event) {
        console.log("response text msg: " + event.data);
    };
    ws.onerror = function (event) {
        console.log("Send Text fired an error");
    };
    ws.onclose = function (event) {
        console.log("WebSocket instance closed.");
    };
}

net.check =  function() {
    if(common.socket == null) {
        net.connect();
    }
}

module.exports = net;