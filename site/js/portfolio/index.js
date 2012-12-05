require.config({
    baseUrl: "/js",
    paths: {
        "jquery" : "lib/jquery",
        "underscore" : "lib/underscore",
        "backbone" : "lib/backbone"
    },
    shim : {
        underscore : {
            exports : "_"
        },
        backbone : {
            exports: "Backbone"
        }
    }
});

require([],function () {
    
});