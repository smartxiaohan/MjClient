var common = require("common");

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        
        text: ''
    },

    // use this for initialization
    onLoad: function () {
        if(common.username && common.username != ""){
            this.label.string = common.username; 
        }
        

        var self = this;
 
    },

    // called every frame
    update: function (dt) {

    },
 
    onClickCreateRoom() {

    },

    onClickJoinRoom(){

    }
});
