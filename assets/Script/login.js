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

        testSp: {
            default: null,
            type: cc.Sprite
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
            else if(data.cmd_id == common.CMD_ID_TABLEINFO) {
                var jjj = 0;
            }
        };

        net.connect();
        if(common.socket) {
            common.socket.onmessage = onmessage;
        }

        cc.director.setDisplayStats(false);

        cc.loader.loadResDir("card", function (err, assets) {
            self.onLoadComplete(self, assets);
        });     
    },

    onLoadComplete: function(self, assets) {
        console.log("load res complete");

        //var sp = assets[0];
        //var sp1 = assets[1];
        var realUrl = cc.url.raw("resources/card/flower/16.png");
        var texture = cc.textureCache.addImage(realUrl);
        self.testSp.getComponent(cc.Sprite).spriteFrame.setTexture(texture);
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
