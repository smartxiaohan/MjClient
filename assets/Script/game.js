var common = require("./common.js");

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
        

        var self = this;
 
        if (common.socket)
        {
            common.socket.onmessage = function (event) 
            {
                
            };
        }
        
    },

    // called every frame
    update: function (dt) {

    },
  
 
});
