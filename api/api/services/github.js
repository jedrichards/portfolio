var https = require("https");
var config = require("../../config");

var cacheTime = 1000*60*5; // 5mins
var cachedResponse;
var lastRequestTime;

/**
 * Returns a cached object literal with details about my most recent GitHub
 * activity to the supplied callback function.
 */
module.exports = function (cb) {

    var nowTime = new Date().getTime();

    if ( cachedResponse && (lastRequestTime+cacheTime) > nowTime ) {
        cb(null,cachedResponse);
        return;
    }

    lastRequestTime = nowTime;

    var req = https.request({
        method: "GET",
        path: "/users/"+config.api.github.user+"/events",
        hostname: "api.github.com"
    },function (res) {
        res.setEncoding("utf8");
        res.on("error",function (err) {
            cb(err);
        });
        var data = "";
        res.on("data",function (chunk) {
            data += chunk;
        });
        res.on("end",function () {
            var parsedData = JSON.parse(data);
            for ( var i=0; i<parsedData.length; i++ ) {
                var event = parsedData[i];
                if ( event.type === "PushEvent" ) {
                    cachedResponse = {
                        date: new Date(event.created_at).getTime(),
                        repo: event.repo.name,
                        sha: event.payload.commits[0].sha,
                        url: "https://github.com/"+event.repo.name+"/commit/"+event.payload.commits[0].sha
                    };
                    break;
                }
            }
            cb(null,cachedResponse);
        })
    });
    req.end();
};