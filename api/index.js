"use strict";

var db = require("./db/db");
var util = require("util");
var api = require("./api/api");
var config = require("./config");

log("[INFO] starting up");

log("[INFO] using config:\n",config);

db.on("ready",function () {
    log("[INFO] %s","db ready");
    api.start();
});

db.on("info",function (message) {
    log("[INFO] %s",message);
});

db.on("error",function (message) {
    log("[ERR]: %s",message);
});

api.on("ready",function (){
    changeProcessOwnership();
    log("[INFO] %s","api server ready");
});

api.on("info",function (message){
    log("[INFO] %s",message);
});

api.on("error",function (message){
    log("[ERR] %s",message);
});

api.on("access",function (message){
    log("[ACCESS] %s",message);
});

api.on("alert",function (message){
    log("[ALERT] %s",message);
});

process.on("SIGTERM",function(a) {
    log("[INFO] shutting down");
});

db.connect();

function changeProcessOwnership () {
    try {
        process.setuid(config.user);
        process.setgid(config.group);
        log("[INFO] process now owned by %s:%s",config.user,config.group);
    } catch (error) {
        log("[ERR] unable to change process ownership to %s:%s",config.user,config.group);
    }
}

function log(item) {
    var output = new Date().toISOString()+" "+util.format.apply(null,arguments);
    util.puts(output);
}