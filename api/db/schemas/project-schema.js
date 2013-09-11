"use strict";

var slugs = require("slugs");
var sanitizer = require("sanitizer");
var mongoose = require("mongoose");
var async = require("async");
var db = require("../db");
var arrayUtils = require("../../utils/array-utils");
var mathUtils = require("../../utils/math-utils");
var lodash = require("lodash");

var schema = new mongoose.Schema({
    name: {type:String,required:true,unique:true},
    description: String,
    image: String,
    date: Date,
    link: String,
    linkTitle: String,
    tags: [{type:mongoose.Schema.Types.ObjectId,ref:"Tag"}],
    slug: {type:String,unique:true}
});

schema.pre("save",function (next) {
    this.name = sanitizer.escape(this.name);
    //this.description = sanitizer.escape(this.description||"");
    this.slug = slugs(this.name);
    next();
});

schema.static("getProjects",function (cb) {
    this
        .find({})
        .sort("-date")
        .populate("tags")
        .exec(cb);
});

schema.static("getProject",function (id,cb) {
    this
        .findById(id)
        .populate("tags")
        .exec(cb);
});

schema.static("getProjectTags",function (id,cb) {
    this.findById(id)
        .populate("tags")
        .select("tags")
        .exec(function (error,doc) {
            if ( error || !doc ) {
                cb(error,doc);
            } else {
                cb(null,doc.tags);
            }
        });
});

schema.static("createProject",function (project,cb) {
    this.create(project,cb);
});

schema.static("updateProject",function (id,update,cb) {
    var self = this;
    delete update._id;
    delete update.slug;
    delete update.__v;
    for ( var i=0; i<update.tags.length; i++ ) {
        if ( update.tags[i]._id ) {
            update.tags[i] = update.tags[i]._id;
        }
    }
    var dateParts = update.date.toString().split("/");
    if ( dateParts.length === 3 ) {
        update.date = new Date(dateParts[2],dateParts[1]-1,dateParts[0]);
    }
    this.findById(id,function (error,doc) {
        if ( error || !doc ) {
            cb(error,doc);
        } else {
            lodash.extend(doc,update);
            doc.save(function (error,doc) {
                if ( error || !doc ) {
                    cb(error,doc);
                } else {
                    self.getProject(id,cb);
                }
            });
        }
    });
});

schema.static("setProjectTags",function (id,update,cb) {
    var self = this;
    this.findById(id,function (error,doc) {
        if ( error || !doc ) {
            cb(error,doc);
        } else {
            doc.tags = update;
            doc.save(function (error,doc) {
                if ( error || !doc ) {
                    cb(error,doc);
                } else {
                    self.getProject(id,cb);
                }
            });
        }
    });
});

schema.static("deleteProject",function (id,cb) {
    this.remove({"_id":id},cb);
});

schema.static("purge",function (cb) {
    this.remove({},cb);
});

schema.static("populateDummyData",function (cb) {
    var tasks = [];
    var self = this;
    function createProjectClosure(project) {
        return function (cb) {
            self.createProject(project,cb);
        };
    }
    for ( var i=0; i<10; i++ ) {
        var project = {
            name: "Project "+(i+1),
            link: "http://www.whatevs.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            image: "/img/dummy-project-image.jpg",
            date: new Date(),
            linkTitle: "Link title"
        };
        tasks.push(createProjectClosure(project));
    }
    async.parallel(tasks,cb);
});

schema.static("populateDummyTags",function (cb) {
    var self = this;
    var tasks = [];
    var Tag = db.getTagModel();
    function setProjectTagsClosure(id,tagArray) {
        return function (cb) {
            self.setProjectTags(id,tagArray,cb);
        };
    }
    Tag.getTags(function (err,tags) {
        self.getProjects(function (err,projects) {
            projects.forEach(function (project) {
                arrayUtils.shuffle(tags);
                var numTags = mathUtils.randomInt(1,tags.length);
                var tagArray = [];
                for ( var i=0; i<numTags; i++ ) {
                    tagArray.push(tags[i]._id);
                }
                tasks.push(setProjectTagsClosure(project._id,tagArray));
            });

            async.parallel(tasks,cb);
        });
    });
});

module.exports = schema;