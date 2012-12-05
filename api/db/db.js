var mongoose = require("mongoose");
var events = require("events");
var config = require("../config");
var async = require("async");

module.exports = function () {

    "use strict";

    var conn, Project, Tag, User, Session;
    var emitter = new events.EventEmitter();

    function connect () {
        emit("info","using db path "+dbPath());
        conn = mongoose.createConnection(dbPath());
        conn.on("error",onConnOpenError);
        conn.on("open",onConnOpen);
    }

    function onConnOpen () {
        emit("info","db connected");
        setupModels();
        setupDatabase();
    }

    function setupModels () {
        Project = conn.model("Project",require("./schemas/project-schema"));
        Tag = conn.model("Tag",require("./schemas/tag-schema"));
        User = conn.model("User",require("./schemas/user-schema"));
        Session = conn.model("Session",require("./schemas/session-schema"));
    }

    function setupDatabase () {
        var tasks = [];

        if ( config.db.purge ) {
            tasks.push(function (cb) {
                Project.purge(cb);
            });
            tasks.push(function (cb) {
                Tag.purge(cb);
            });
            tasks.push(function (cb) {
                User.purge(cb);
            });
        }

        tasks.push(function (cb) {
            Session.purge(cb);
        });

        if ( config.db.populate ) {
            tasks.push(function (cb) {
                Project.populateDummyData(cb);
            });
            tasks.push(function (cb) {
                Tag.populateDummyData(cb);
            });
            tasks.push(function (cb) {
                Project.populateDummyTags(cb);
            });
        }

        tasks.push(function (cb) {
            User.setupDefaultAdminUser(cb);
        });

        async.series(tasks,onDBSetupComplete);
    }

    function onDBSetupComplete (err) {
        if ( err ) {
            emit("error",err);
        } else {
            emit("ready");
        }
    }

    function onConnOpenError () {
        emit("error",new Error("Database connection failed."));
    }

    function emit (name,message) {
        emitter.emit(name,message);
    }

    function dbPath() {
        return "mongodb://"+config.db.user+":"+config.db.pass+"@"+config.db.host+":"+config.db.port+"/"+config.db.name;
    }

    function getProjectModel () {
        return Project;
    }

    function getTagModel () {
        return Tag;
    }

    function getUserModel () {
        return User;
    }

    function getSessionModel () {
        return Session;
    }

    return {
        connect: connect,
        on: emitter.on.bind(emitter),
        getProjectModel: getProjectModel,
        getTagModel: getTagModel,
        getUserModel: getUserModel,
        getSessionModel: getSessionModel
    };
}();