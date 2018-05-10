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

        // cc.loader.loadResDir("card", function (err, assets) {
        //     self.onLoadComplete(self, assets);
        // });    
        
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
                    for(var j=0; j<=14; j++) {
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
        if(data.curplayer) {
            common.curplayerchairno = data.curplayer;
        }

        
        this.freshPlayers();
    },

    onNotifyTableinfo: function(data) {
        common.tableplayers = data.players;

        if(data.curplayer) {
            common.curplayerchairno = data.curplayer;
        }

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

    onClickCard: function(event) {
        var event = event;

        if(event.target.parent.y == 0) {
            event.target.parent.y = 15;
        }
        else
        {
            var node = event.target.parent;
            node.y = 0;

            net.check();
            if(node.cardid && common.socket != null) {
                if(common.socket) {
                    var outcarddata = {};
                    outcarddata.chairno = common.chairno;
                    outcarddata.tablenum = common.tablenum;
                    outcarddata.cardid = node.cardid;
                    var data = {"cmd_id":common.CMD_ID_OUTCARD, "data":JSON.stringify(outcarddata)};
            
                    var senddata = JSON.stringify(data);
                    common.socket.send(senddata);
                }
            }
        }
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

    getFlowerTexture: function(cardid) {
        var idx = this.getCardResIndex(cardid);
        var urlstr = "resources/card/flower/" + idx.toString() + ".png";
        //var  realUrl = cc.url.raw("resources/card/flower/20.png");
        //return realUrl;
        //var texture = cc.textureCache.addImage(urlstr);
        return cc.url.raw(urlstr);
    },

    
 
    calculateCardShape: function(cardID) {
        if(0 < cardID && 36 >= cardID)
            return 1   
        else if(36 < cardID  && 72 >= cardID)
            return 2    
        else if(72 < cardID && 108 >= cardID)
            return 3    
        else if(108 < cardID && 124 >= cardID)
            return 4     
        else if(124 < cardID && 136 >= cardID)
            return 5     
        else if(136 < cardID && 140 >= cardID)
            return 6     
        else if(140 < cardID && 144 >= cardID)
            return 7     
        else if(144 < cardID && 152 >= cardID)
            return 8    
        else
            return 0
    },
 
 
    calculateCardValue: function(cardID) {
        if(0 < cardID && 108 >= cardID)
            return (cardID - 1) % 9 + 1
        else if(108 < cardID && 124 >= cardID)
            return (cardID - 108 - 1) % 4 + 1
        else if(124 < cardID && 136 >= cardID)
            return (cardID - 124 - 1) % 3 + 1
        else if(136 < cardID && 140 >= cardID)
            return (cardID - 136) 
        else if(140 < cardID && 144 >= cardID)
            return (cardID - 140) 
        else if(144 < cardID && 152 >= cardID)
            return (cardID - 144)
        else
            return 0
    },
 
    getCardResIndex: function(cardID){
        var cardShape = this.calculateCardShape(cardID);
        var cardValue = this.calculateCardValue(cardID);
        var resIndex = -1
        if(1 == cardShape)  
            resIndex = cardValue - 1
        else if(2 == cardShape)
            resIndex = 8 + cardValue
        else if(3 == cardShape)
            resIndex = 17 + cardValue
        else if(4 == cardShape)
            resIndex = 26 + cardValue
        else if(5 == cardShape)
            resIndex = 30 + cardValue
        else if(6 == cardShape)
            resIndex = 33 + cardValue
        else if(7 == cardShape)
            resIndex = 37 + cardValue
        else if(8 == cardShape)
            resIndex = 41 + cardValue
        if(resIndex > 46)
            resIndex = 46
             
        return resIndex
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
                            var startidx = 2;
                            if(common.curplayerchairno == common.chairno) {
                                startidx = 1;
                            }
                            for(var j=1; j<=handcards.length; j++) {
                                var nodeidx = startidx + j - 1;
                                var node = selfhand.getChildByName("node"+nodeidx.toString());
                                var cardid = handcards[j-1];
                                if(node) {
                                    node.active = true;

                                    var node_handcard1 = node.getChildByName("node_handcard1");
                                    if(node_handcard1) {
                                        node_handcard1.cardid = cardid;
                                        var flower = node_handcard1.getChildByName("flower");
                                        //var back = node_handcard1.getChildByName("back");
                                        var joker = node_handcard1.getChildByName("joker");
                                        var mask = node_handcard1.getChildByName("mask");

                                        if(flower) {
                                            //flower.getComponent(cc.Sprite).("Texure/card/flower/0.png");
                                            var spf = flower.getComponent(cc.Sprite);
                                            var texture = this.getFlowerTexture(cardid);
                                            //spf.setTexture(texture);

                                            var spriteFrame = new cc.SpriteFrame(texture);
                                            spf.spriteFrame = spriteFrame
                                            //spf.spriteFrame =  new cc.SpriteFrame(cc.url.raw('resources/card/flower/20.png'));  
                                            //var iiii = 0;
                                            //spf.setTexture(this.textureURL); //("res/raw-assets/Texture/card/flower/0.png");
                                        }

                                        if(joker && mask) {
                                            joker.active = false;
                                            mask.active = false;
                                        }
                                    }
                                }
                            }
                        }
                         
                    }
                }
            }
            else
            {
                var handcards = player.handcards;
                if(handcards && handcards.length > 0) {
                    var card_layer = this.node.getChildByName("card_layer");
                    if(card_layer) {
                        var hand = card_layer.getChildByName("hand"+drawIndex.toString());
                        if(hand) {
                            var startidx = 2;
                            if(common.curplayerchairno == player.chairno) {
                                startidx = 1;
                            }
                            for(var j=1; j<=handcards.length; j++) {
                                var nodeidx = startidx + j - 1;
                                var node = hand.getChildByName("node"+nodeidx.toString());
                                if(node) {
                                    node.active = true;
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
