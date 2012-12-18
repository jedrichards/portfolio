require.config({
    baseUrl: "/js",
    paths: {
        "jquery": "lib/jquery",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "mustache": "lib/mustache",
        "text": "lib/text",
        "json": "lib/json2",
        "portfolioapp": "portfolio/portfolio-app"
    },
    shim : {
        portfolioapp: {
            deps: ["backbone"]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            exports: "Backbone",
            deps: ["jquery","underscore","json"]
        }
    }
});

require(["jquery","portfolioapp"],function ($,portfolioApp) {
    $(function () {
        portfolioApp.init($("#container"));
    });
});