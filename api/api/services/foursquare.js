var https = require("https");
var config = require("../../config");

var cacheTime = 1000*60*5; // 5mins
var cachedResponse;
var lastRequestTime;

/**
 * Returns a cached object literal with details about my most recent Foursquare
 * checkin to the supplied callback function.
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
        path: "/v2/users/self/checkins?oauth_token="+config.api.foursquare.oAuthToken+"&limit=1",
        hostname: "api.foursquare.com"
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
            var checkin = parsedData.response.checkins.items[0];
            cachedResponse = {
                venue: checkin.venue.name,
                date: parseInt(checkin.createdAt)*1000,
                city: checkin.venue.location.city,
                url: "https://foursquare.com/v/"+checkin.venue.id
            };
            cb(null,cachedResponse);
        })
    });
    req.end();
};