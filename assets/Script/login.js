var common = require("common");
var hall = require("hall")
var net = require("net")

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        nameInput: {
            default: null,
            type: cc.EditBox
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello!'
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        var onmessage = function (event) {
            var datastr = event.data;
            var data = JSON.parse(datastr);
            var jsondata = JSON.parse(data.data);

            if(data.cmd_id == 1000 && jsondata.name != null && jsondata.name != "")
            {
                common.username = jsondata.name;
                common.uid = jsondata.uid;
                cc.director.loadScene("hall");
            }
        };

        net.connect();
        if(common.socket) {
            common.socket.onmessage = onmessage;
        }

        // var ws = new WebSocket("ws://localhost:8001");

        // this.ws = ws;
        // ws.onopen = function (event) {
        //     console.log("Send Text WS was opened.");
        // };
        // ws.onmessage = function (event) {
        //     var datastr = event.data;
        //     var data = JSON.parse(datastr);
        //     var jsondata = JSON.parse(data.data);

        //     if(data.cmd_id == 1000 && jsondata.name != null && jsondata.name != "")
        //     {
        //         common.username = jsondata.name;
        //         common.uid = jsondata.uid;
        //         cc.director.loadScene("hall");
        //     }
        // };
        // ws.onerror = function (event) {
        //     console.log("Send Text fired an error");
        // };
        // ws.onclose = function (event) {
        //     console.log("WebSocket instance closed.");
        // };
       
        // setTimeout(function () {
        //     if (ws.readyState === WebSocket.OPEN) {
        //         common.socket = ws;
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 1);

    },

    // called every frame
    update: function (dt) {

    },

    onClickLogin() {
        var str = this.nameInput.string;
        var login_data = {"name":str, "password":123456};
        var data = {"cmd_id":common.CMD_ID_LOGIN, "data":JSON.stringify(login_data)};

        var senddata = JSON.stringify(data);

        net.check();
        if(common.socket) {
            common.socket.send(senddata);
        }
    }
 
});
