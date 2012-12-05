var path = require("path");
var fs = require("fs");
var util = require("util");
var _ = require("grunt/node_modules/underscore");

module.exports = function(grunt) {

    "use strict";

    grunt.registerMultiTask("deldirs","Deletes empty directories",function () {

        var dirs = grunt.file.expand(this.data.dirs+"/**");

        _.map(dirs,function (path) {
            if ( fs.statSync(path).isDirectory() ) {
                if ( fs.readdirSync(path).length === 0 ) {
                    grunt.log.write("Deleting empty dir '"+path+"' ... ");
                    try {
                        fs.rmdirSync(path);
                        grunt.log.writeln("done".green);
                    } catch (e) {
                        grunt.log.writeln("fail".red);
                        grunt.log.error(e.toString());
                    }
                }
            }
        });
    });
};