var config = require("./config");

module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        distDir: "./dist",
        siteDistDir: "./dist/site",
        apiDistDir: "./dist/api",
        siteSrcDir: "../site",
        apiSrcDir: "../api",
        lint: {
            build: [
                "./grunt.js",
                "./tasks/*.js"
            ],
            site: [
                "<%= siteSrcDir %>/js/portfolio/**/*.js",
                "<%= siteSrcDir %>/js/cms/**/*.js"
            ],
            api: [
                "<%= apiSrcDir %>/*.js",
                "<%= apiSrcDir %>/db/**/*.js",
                "<%= apiSrcDir %>/api/**/*.js",
                "<%= apiSrcDir %>/utils/**/*.js"
            ]
        },
        jshint: {
            options: {
                browser: true,
                node: true,
                es5: true,
                strict: false
            },
            globals: {
                jQuery: true,
                console: true,
                define: true,
                require: true
            }
        },
        clean : {
            site: {
                src: ["<%= siteDistDir %>"]
            },
            api: {
                src: ["<%= apiDistDir %>"]
            }
        },
        rsync : {
            buildSite: {
                src: "<%= siteSrcDir %>/",
                dest: "<%= siteDistDir %>",
                recursive: true,
                exclude: [
                    "scss",
                    ".DS_Store",
                    ".idea",
                    ".git",
                    ".gitignore",
                    "config.js",
                    "config-prod.js"
                ]
            },
            buildAPI: {
                src: "<%= apiSrcDir %>/",
                dest: "<%= apiDistDir %>",
                recursive: true,
                exclude: [
                    ".DS_Store",
                    ".idea",
                    ".git",
                    ".gitignore",
                    "todo.txt",
                    "config.js",
                    "config-prod.js",
                    "node_modules"
                ],
                args: ["--links"]
            },
            deploySite: {
                src: "<%= siteDistDir %>/",
                dest: config.prodSiteLocation,
                recursive: true,
                syncDest: true,
                host: config.prodHost
            },
            deployAPI: {
                src: "<%= apiDistDir %>/",
                dest: config.prodAPILocation,
                recursive: true,
                syncDest: true,
                host: config.prodHost,
                args: ["--links"]
            }
        },
        mincss: {
            portfolio: {
                files: {
                    "<%= siteDistDir %>/css/portfolio.css": ["<%= siteDistDir %>/css/portfolio.css"]
                }
            },
            cms: {
                files: {
                    "<%= siteDistDir %>/css/cms.css": ["<%= siteDistDir %>/css/cms.css"]
                }
            }
        },
        requirejs: {
            portfolio: {
                options: {
                    baseUrl: "<%= siteDistDir %>/js",
                    mainConfigFile: "<%= siteDistDir %>/js/portfolio/index.js",
                    out: "<%= siteDistDir %>/js/portfolio/index.js",
                    name: "portfolio/index",
                    optimize: "none",
                    removeCombined: false
                }
            },
            cms: {
                options: {
                    baseUrl: "<%= siteDistDir %>/js",
                    mainConfigFile: "<%= siteDistDir %>/js/cms/index.js",
                    out: "<%= siteDistDir %>/js/cms/index.js",
                    name: "cms/index",
                    optimize: "none",
                    removeCombined: false
                }
            }
        },
        min: {
            portfolio: {
                src: ["<%= siteDistDir %>/js/portfolio/index.js"],
                dest: "<%= siteDistDir %>/js/portfolio/index.js"
            },
            cms: {
                src: ["<%= siteDistDir %>/js/cms/index.js"],
                dest: "<%= siteDistDir %>/js/cms/index.js"
            },
            requirejs: {
                src: ["<%= siteDistDir %>/js/lib/require.js"],
                dest: "<%= siteDistDir %>/js/lib/require.js"
            }
        },
        deldirs: {
            site: {
                dirs: ["<%= siteDistDir %>"]
            }
        },
        shell: {
            cpSiteProdConfigToDist: {
                command: "cp ../site/js/config-prod.js ./dist/site/js/config.js",
                stdout: true
            },
            cpAPIProdConfigToDist: {
                command: "cp ../api/config-prod.js ./dist/api/config.js",
                stdout: true
            },
            prodAPINPMInstallCMD: {
                command: config.prodAPINPMInstallCMD,
                stdout: true
            },
            prodAPIRestartCMD: {
                command: config.prodAPIRestartCMD,
                stdout: true
            }
        },
        vows: {
            api: {
                files: ["./tests/api/api-test.js"],
                reporter: "spec",
                verbose: false,
                silent: false,
                colors: false
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib");
    grunt.loadNpmTasks("grunt-rsync");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-vows");
    grunt.loadTasks("./tasks");

    grunt.registerTask("testSite","lint:build lint:site");
    grunt.registerTask("buildSite","testSite clean:site rsync:buildSite shell:cpSiteProdConfigToDist mincss:portfolio mincss:cms requirejs:portfolio requirejs:cms min deldirs:site");
    grunt.registerTask("deploySite","buildSite rsync:deploySite");

    grunt.registerTask("testAPI","lint:build lint:api vows:api");
    grunt.registerTask("buildAPI","testAPI clean:api rsync:buildAPI shell:cpAPIProdConfigToDist");
    grunt.registerTask("deployAPI","buildAPI rsync:deployAPI shell:prodAPINPMInstallCMD shell:prodAPIRestartCMD");
    grunt.registerTask("forceDeployAPI","clean:api rsync:buildAPI shell:cpAPIProdConfigToDist rsync:deployAPI shell:prodAPINPMInstallCMD shell:prodAPIRestartCMD");
};