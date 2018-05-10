module.exports = {
    username: null,
    uid:-1,
    chairno:-1,
  
	socket: null,
    tablenum: -1,
    tablehost:-1,
    tablestatus:-1,
    tableplayers:[],

    CMD_ID_LOGIN:1000,
    CMD_ID_CREATE_FKROOM:1001,
    CMD_ID_JOIN_FKROOM:1002,
    CMD_ID_READY:1003,
    CMD_ID_TABLEINFO:1004,

    CMD_ID_OUTCARD:2000,
};