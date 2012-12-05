/**
 * Mongoose schema for the Tag collection.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sanitizer = require("sanitizer");
var db = require("../db");
var async = require("async");
var lodash = require("lodash");

var schema =  new Schema({
    name: {type:String,unique:true}
});

/**
 * Pre save hook. Escapes any HTML tags in the name field.
 */
schema.pre("save",function (next) {
    this.name = sanitizer.escape(this.name);
    next();
});

schema.static("getTags",function (cb) {
    this.find({},cb);
});

schema.static("getTag",function (id,cb) {
    this.findOne({_id:id},cb);
});

schema.static("getTagByName",function (name,cb) {
    this.find({name:name},cb);
});

schema.static("getTagProjects ",function (id,cb) {
    var Project = db.getProjectModel();
    Project
        .find({tags:id})
        .populate("tags")
        .exec(cb);
});

schema.static("createTag",function (tag,cb) {
    this.create(tag,cb);
});

schema.static("deleteTag",function (id,cb) {
    var self = this;
    var Project = db.getProjectModel();
    Project
        .update({},{$pull:{tags:id}})
        .exec(function (err,doc) {
            if ( err ) {
                cb(err);
            } else {
                self.remove({"_id":id},cb);
            }
        });
});

schema.static("updateTag",function (id,update,cb) {
    var self = this;
    delete update._id;
    delete update.__v;
    this.findById(id,function (err,doc) {
        if ( err || !doc ) {
            cb(err,doc);
        } else {
            lodash.extend(doc,update);
            doc.save(function (err,doc) {
                if ( err || !doc ) {
                    cb(err,doc);
                } else {
                    self.getTag(id,cb);
                }
            });
        }
    });
});

schema.static("purge",function (cb) {
    this.remove({},cb);
});

schema.static("populateDummyData",function (cb) {
    var tasks = [];
    var tags = ["NodeJS","Flash","HTML","CSS","JavaScript","Unix","JSFL"];
    var self = this;
    function createTagClosure(tag) {
        return function (cb) {
            self.createTag(tag,cb);
        };
    }
    for ( var i=0; i<tags.length; i++ ) {
        tasks.push(createTagClosure({name:tags[i]}));
    }
    async.parallel(tasks,cb);
});

module.exports = schema;