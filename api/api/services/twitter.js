var https = require("https");
var twitreq = require("twitreq");
var config = require("../../config");

var cacheTime = 1000*60*5; // 5 mins
var cachedResponse;
var lastRequestTime;

/**
 * Returns a cached object literal with details about my most recent tweet to
 * the supplied callback function.
 */
module.exports = function (cb) {

    var nowTime = new Date().getTime();

    if ( cachedResponse && (lastRequestTime+cacheTime) > nowTime ) {
        cb(null,cachedResponse);
        return;
    }

    lastRequestTime = nowTime;

    var twitreqOptions = {
        queryParams: {
            screen_name: config.api.twitter.screenName,
            count: "1",
            exclude_replies: "true"
        },
        method: "GET",
        path: "/1.1/statuses/user_timeline.json",
        oAuthConsumerKey: config.api.twitter.oAuthConsumerKey,
        oAuthConsumerSecret: config.api.twitter.oAuthConsumerSecret,
        oAuthToken: config.api.twitter.oAuthToken,
        oAuthTokenSecret: config.api.twitter.oAuthTokenSecret
    };

    twitreq(twitreqOptions,function (err,reqOptions) {
        if ( err ) {
            cb(err);
        } else {
            var req = https.request(reqOptions,function (res) {
                res.setEncoding("utf8");
                res.on("error",function (err) {
                    cb(err);
                });
                var data = "";
                res.on("data", function (chunk) {
                    data += chunk;
                });
                res.on("end",function () {
                    var parsedData = JSON.parse(data);
                    if ( Array.isArray(parsedData) ) {
                        cachedResponse = {
                            text: parsedData[0].text,
                            date: new Date(parsedData[0].created_at).getTime(),
                            url: "https://twitter.com/"+config.api.twitter.screenName+"/status/"+parsedData[0].id_str
                        };
                        cb(null,cachedResponse);
                    } else {
                        cachedResponse = null;
                        cb(new Error("Twitter API error: "+parsedData.errors[0].message));
                    }
                });
            });
            req.end();
        }
    });
};