require.config({
    baseUrl: "/js",
    paths: {
        "jquery": "lib/jquery",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "bootstrap": "lib/bootstrap",
        "mustache": "lib/mustache",
        "text": "lib/text",
        "json": "lib/json2",
        "base64": "lib/base64",
        "notes": "cms/notes",
        "cmsapp": "cms/cms-app"
    },
    shim: {
        cmsapp: {
            deps: ["bootstrap"]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            exports: "Backbone",
            deps: ["jquery","underscore","json"]
        },
        bootstrap: {
            deps: ["jquery"]
        },
        base64: {
            exports: "base64"
        }
    }
});

require(["jquery","cmsapp"],function ($,cmsApp) {
    $(function () {
        cmsApp.init($("#cms-app-container"));
    });
});