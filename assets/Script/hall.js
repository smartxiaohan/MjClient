var common = require("./common.js");
var net = require("net")

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        labelRoomNum: {
            default: null,
            type: cc.Label
        },

        editbox_tablenum: {
            default: null,
            type: cc.EditBox
        },
        
        text: ''
    },

    // use this for initialization
    onLoad: function () {
        if(common.username && common.username != ""){
            this.label.string = common.username + common.uid; 
        }
        

        var self = this;
 
        if (common.socket)
        {
            common.socket.onmessage = function (event) {
                self.onmessage(event, self)
            };
        }
        
    },

    onmessage: function (event,self) {
        var datastr = event.data;
        var data = JSON.parse(datastr);
        var jsondata = JSON.parse(data.data);
 
        if(data.cmd_id == common.CMD_ID_CREATE_FKROOM)
        {
            self.onNotifyCreateRoom(jsondata);
        }

        if(data.cmd_id == common.CMD_ID_JOIN_FKROOM)
        {
            self.onNotifyJoinRoom(jsondata);
        }
    },

    // called every frame
    update: function (dt) {

    },
 
    onClickCreateRoom() {
        var createroom_data = {"uid":common.uid, "username": common.username};
        var data = {"cmd_id":common.CMD_ID_CREATE_FKROOM, "data":JSON.stringify(createroom_data)};

        var senddata = JSON.stringify(data);

        net.check();
        if(common.socket && common.socket != null) {
            common.socket.send(senddata);
        }
        
    },

    onClickJoinRoom(){
        var tablenum = this.editbox_tablenum.string;
        var joinroom_data = {"uid":common.uid, "username": common.username, "tablenum":tablenum};
        var data = {"cmd_id":common.CMD_ID_JOIN_FKROOM, "data":JSON.stringify(joinroom_data)};

        var senddata = JSON.stringify(data);
        var self = this;

        net.check();
        if(common.socket && common.socket != null) {
            common.socket.onmessage = function (event) {
                self.onmessage(event, self)
            };
            common.socket.send(senddata);
        }
    },

    onNotifyCreateRoom(data) {
        common.tablenum = data.tablenum;
        common.tablehost = data.host;
        common.tablestatus = data.status;

        common.tableplayers = data.players;
         //确定mychairno  
         for(var i=0; i<common.tableplayers.length; i++) {
            var player = common.tableplayers[i];
            if(player && player.uid == common.uid) {
                common.mychairno = player.chairno;
            }
        }

        this.labelRoomNum.string = data.tablenum;

        cc.director.loadScene("game");
    },

    onNotifyJoinRoom: function(data) {
        common.tablenum = data.tablenum;
        common.tablehost = data.host;
        common.tablestatus = data.status;

        common.tableplayers = data.players;

        //确定mychairno  
        for(var i=0; i<common.tableplayers.length; i++) {
            var player = common.tableplayers[i];
            if(player && player.uid == common.uid) {
                common.mychairno = player.chairno;
            }
        }

        cc.director.loadScene("game");
    }
});
