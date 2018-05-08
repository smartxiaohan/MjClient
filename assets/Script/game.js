var common = require("./common.js");
var net = require("net")

cc.Class({
    extends: cc.Component,

    properties: {
        label_tablenum: {
            default: null,
            type: cc.Label
        },

        textureURL: {
            default: "",
            url: cc.Texture2D
        },
       
    },

    // use this for initialization
    onLoad: function () {
        if(common.tablenum && common.tablenum != ""){
            this.label_tablenum.string = "房号 " + common.tablenum; 
        }

        // if(common.username && common.username != ""){
        //     this.label_username.string = common.username; 
        // }

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
        for(var i=1; i<=4; i++) {
            var player = this.node.getChildByName("player"+i.toString());
            if(player) {
                player.active = false
            }
        }

        var card_layer = this.node.getChildByName("card_layer");
        if(card_layer) {
            for(var i=1; i<=4; i++) 
            {
                var hand = card_layer.getChildByName("hand"+i.toString());
                if(hand) {
                    for(var j=0; j<14; j++) {
                        var node = hand.getChildByName("node"+(j+1).toString());
                        if(node) {
                            node.active = false;
                        }
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
        else if(data.cmd_id == common.CMD_ID_TABLEINFO) {
            self.onNotifyTableinfo(jsondata);
        }
    },

    onNotifyJoinRoom: function(data) {
        common.tableplayers = data.players;

        this.freshPlayers();
    },

    onNotifyTableinfo: function(data) {
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

        var drawIndex = this.getDrawIndexByChairNO(chairno);
        if(drawIndex >= 1 && drawIndex <=4) {
            var player = this.node.getChildByName("player"+drawIndex.toString());
            if(player) {
                var text_ready = player.getChildByName("text_ready");
                if(text_ready) {
                    text_ready.active = true;
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

 
    getDrawIndexByChairNO: function(chairno) {
        var tmpIndex = 1;  //from mydrawindex
        var tmpChair = common.chairno;
    
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
        
            var drawIndex = this.getDrawIndexByChairNO(player.chairno)

            if(player.chairno == common.chairno) {
                var node_start = this.node.getChildByName("node_start");
                if(node_start) {
                    var btn_ready = node_start.getChildByName("button");
            
                    if(btn_ready) {
                        if(player.ready == true) {
                            btn_ready.active = false;
                        }
                        else
                        {
                            btn_ready.active = true;
                        }
                    }
                } 

                var handcards = player.handcards;
                if(handcards && handcards.length > 0) {
                    //self handcard
                    var card_layer = this.node.getChildByName("card_layer");
                    if(card_layer) {
                         
                        var selfhand = card_layer.getChildByName("hand1");
                        if(selfhand) {
                            for(var j=0; j<handcards.length; j++) {
                                var node = selfhand.getChildByName("node"+(j+1).toString());
                                if(node) {
                                    node.active = true;

                                    var node_handcard1 = node.getChildByName("node_handcard1");
                                    if(node_handcard1) {
                                        var flower = node_handcard1.getChildByName("flower");
                                        var back = node_handcard1.getChildByName("back");
                                        var joker = node_handcard1.getChildByName("joker");
                                        var mask = node_handcard1.getChildByName("mask");

                                        if(flower) {
                                            //flower.getComponent(cc.Sprite).("Texure/card/flower/0.png");
                                            var spf = flower.getComponent(cc.Sprite).spriteFrame;
                                            //spf.setTexture(this.textureURL); //("res/raw-assets/Texture/card/flower/0.png");
                                        }
                                    }
                                }
                            }
                        }
                         
                    }
                }
            }

            var playernode = this.node.getChildByName("player"+drawIndex.toString())
            if(playernode) {
                playernode.active = true;

                var label_username = playernode.getChildByName("label_username");
                if(label_username) {
                    label_username.getComponent(cc.Label).string = player.username;
                }

                var text_ready = playernode.getChildByName("text_ready");
                if(text_ready) {
                    if(player.ready == true) {
                        text_ready.active = true;
                    }
                    else {
                        text_ready.active = false;
                    }
                    
                }
            }
             
        }
    }
});
