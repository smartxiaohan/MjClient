var common = require("./common.js");
var net = require("net")

cc.Class({
    extends: cc.Component,

    properties: {
        label_tablenum: {
            default: null,
            type: cc.Label
        },

        label_username: {
            default: null,
            type: cc.Label
        },
       
    },

    // use this for initialization
    onLoad: function () {
        if(common.tablenum && common.tablenum != ""){
            this.label_tablenum.string = "房号 " + common.tablenum; 
        }

        if(common.username && common.username != ""){
            this.label_username.string = common.username; 
        }

        this.initView();
       
        this.freshPlayers();
        
        var self = this;

        if (common.socket)
        {
            common.socket.onmessage = function (event) {
                self.onmessage(event, self)
            };
        }
        
    },

    initView: function() {
        for(var i=2; i<=4; i++) {
            var player = this.node.getChildByName("player"+i.toString());
            if(player) {
                player.active = false
            }
        }

        var card_layer = this.node.getChildByName("card_layer");
        if(card_layer) {
            var hand1 = card_layer.getChildByName("hand1");
            if(hand1) {
                for(var i=0; i<14; i++) {
                    var node = hand1.getChildByName("node"+(i+1).toString());
                    if(node) {
                        node.active = false;
                    }
                }
            }
        }

       
    },

    onmessage: function (event,self) {
        var datastr = event.data;
        var data = JSON.parse(datastr);
        var jsondata = JSON.parse(data.data);
 
        if(data.cmd_id == common.CMD_ID_JOIN_FKROOM)
        {
            self.onNotifyJoinRoom(jsondata);
        }
        else if(data.cmd_id == common.CMD_ID_READY)
        {
            self.onNotifyPlayerStart(jsondata);
        }
    },

    onNotifyJoinRoom: function(data) {
        common.tableplayers = data.players;

        this.freshPlayers();
    },

    onNotifyPlayerStart: function(data) {
        var chairno = data.chairno;
        
        if(chairno == common.chairno) {
            var node_start = this.node.getChildByName("node_start");
            if(node_start) {
                var btn_ready = node_start.getChildByName("button");
          
                if(btn_ready) {
                    btn_ready.active = false;
                }
            }
        }
        else {
            var drawIndex = this.getDrawIndexByChairNO(player.chairno);
            if(drawIndex >= 1 && drawIndex <=4) {
                var player = this.node.getChildByName("player"+drawIndex.toString());
                if(player) {
                    var text_ready = player.getChildByName("text_ready");
                    if(text_ready) {
                        text_read.active = true;
                    }
                } 
            }
        }


    },

    // called every frame
    update: function (dt) {

    },

    onBtnStart: function() {
        var startdata = {};
        startdata.uid = common.uid;
        startdata.tablenum = common.tablenum;
        var data = {"cmd_id":common.CMD_ID_READY, "data":JSON.stringify(startdata)};

        var senddata = JSON.stringify(data);

        net.check();
        if(common.socket && common.socket != null) {
            common.socket.send(senddata);
        }
    },

    onBtnQuit: function() {
        cc.director.loadScene("hall");
    },

    
    getNextChairNO: function(chair) {
        var totalChairs = 4;
        return (chair + 1 + totalChairs) % totalChairs
    },
 

    getNextDrawIndex: function(drawIndex) {
        var totalChairs = 4;
        var nextDrawIndex =(drawIndex + 1 + totalChairs) % totalChairs
        if(0 == nextDrawIndex) {
            nextDrawIndex = totalChairs
        }  
        return nextDrawIndex
    },

 
    getDrawIndexByChairNO(chairno) {
        var tmpIndex = 1;  //from mydrawindex
        var tmpChair = common.mychairno;
    
        for(var i = 1;i<=4;i++)  {
            if(tmpChair == chairno)
                break
            else {
                tmpIndex = this.getNextDrawIndex(tmpIndex)
                tmpChair = this.getNextChairNO(tmpChair)
            }
        }
           
        return tmpIndex
    },
 
    freshPlayers: function() {
        for(var i=0; i<common.tableplayers.length; i++) {
            var player = common.tableplayers[i];
            if(player.uid != common.uid) {
                var drawIndex = this.getDrawIndexByChairNO(player.chairno)
                var playernode = this.node.getChildByName("player"+drawIndex.toString())
                if(playernode) {
                    playernode.active = true;

                    var label_username = playernode.getChildByName("label_username");
                    if(label_username) {
                        label_username.getComponent(cc.Label).string = player.username;
                    }

                    var text_ready = playernode.getChildByName("text_ready");
                    if(text_ready) {
                        text_read.active = false;
                    }
                }
            }
        }
    }
});
