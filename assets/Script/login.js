var common = require("common");
var hall = require("hall")
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
        this.label.string = "666666";//this.text;

        var self = this;

        var ws = new WebSocket("ws://localhost:8001");

        this.ws = ws;
        ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        ws.onmessage = function (event) {
            //console.log("response text msg: " + event.data);

            var datastr = event.data;
            var data = JSON.parse(datastr);
            //self.label.string = data.data;

            var jsondata = JSON.parse(data.data);

            if(data.cmd_id == 1000 && jsondata.name != null && jsondata.name != "")
            {
                common.username = jsondata.name;
                common.uid = jsondata.uid;
                cc.director.loadScene("hall");
            }
        };
        ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
       
        setTimeout(function () {
            if (ws.readyState === WebSocket.OPEN) {
                common.socket = ws;
            }
            else {
                console.log("WebSocket instance wasn't ready...");
            }
        }, 1);

    },

    // called every frame
    update: function (dt) {

    },

    onClickLogin() {
        var str = this.nameInput.string;
        var login_data = {"name":str, "password":123456};
        var data = {"cmd_id":common.CMD_ID_LOGIN, "data":JSON.stringify(login_data)};

        var senddata = JSON.stringify(data);
        this.ws.send(senddata);
    }
 
});
