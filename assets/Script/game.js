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

        for(var i=2; i<=4; i++) {
            var player = this.node.getChildByName("player"+i.toString())
            if(player) {
                player.active = false
            }
        }

        this.freshPlayers();
        

        var self = this;
 
        if (common.socket)
        {
            common.socket.onmessage = function (event) 
            {
                var datastr = event.data;
                var data = JSON.parse(datastr);
 
                var jsondata = JSON.parse(data.data);
    
     
            };
        }
        
    },

    // called every frame
    update: function (dt) {

    },

    
    getNextChairNO: function(chair) {
        var totalChairs = 4;
        return (chair - 1 + totalChairs) % totalChairs
    },
 

    getNextDrawIndex: function(drawIndex) {
        var totalChairs = 4;
        var nextDrawIndex =(drawIndex - 1 + totalChairs) % totalChairs
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
                }
            }
        }
    }
});
