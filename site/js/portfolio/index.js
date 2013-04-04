require.config({
    baseUrl: "/js",
    paths: {
        "jquery": "lib/jquery",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "mustache": "lib/mustache",
        "text": "lib/text",
        "json": "lib/json2",
        "moment": "lib/moment"
    },
    shim : {
        underscore: {
            exports: "_"
        },
        backbone: {
            exports: "Backbone",
            deps: ["jquery","underscore","json"]
        }
    }
});

require(["jquery","portfolio/portfolio-app"],function ($,app) {
    $(function () {
        app.init();
    });
});