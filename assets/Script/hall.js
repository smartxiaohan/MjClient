var common = require("./common.js");

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
            common.socket.onmessage = function (event) 
            {
                //console.log("response text msg: " + event.data);
    
                var datastr = event.data;
                var data = JSON.parse(datastr);
                //self.label.string = data.data;
    
                var jsondata = JSON.parse(data.data);
    
               
                if(data.cmd_id == 1001 && jsondata.tablenum != null)
                {
                    self.onNotifyCreateRoom(jsondata.tablenum);
                }
            };
        }
        
    },

    // called every frame
    update: function (dt) {

    },
 
    onClickCreateRoom() {
        var createroom_data = {"uid":common.uid};
        var data = {"cmd_id":common.CMD_ID_CREATE_FKROOM, "data":JSON.stringify(createroom_data)};

        var senddata = JSON.stringify(data);
        if(common.socket && common.socket != null) {
            common.socket.send(senddata);
        }
        
    },

    onClickJoinRoom(){
        var tablenum = this.editbox_tablenum.string;
        var joinroom_data = {"uid":common.uid, "tablenum":tablenum};
        var data = {"cmd_id":common.CMD_ID_JOIN_FKROOM, "data":JSON.stringify(joinroom_data)};

        var senddata = JSON.stringify(data);
        if(common.socket && common.socket != null) {
            common.socket.send(senddata);
        }
    },

    onNotifyCreateRoom(tablenum) {
        this.labelRoomNum.string = tablenum.toString();
        common.tablenum = tablenum;
        cc.director.loadScene("game");
    }
});
