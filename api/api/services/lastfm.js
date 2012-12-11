var https = require("https");
var config = require("../../config");

var cacheTime = 1000*60*5; // 5mins
var cachedResponse;
var lastRequestTime;

/**
 * Returns a cached object literal with details about my most recent last.fm
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
        path: "/2.0/?method=user.getrecenttracks&user="+config.api.lastfm.user+"&api_key="+config.api.lastfm.apiKey+"&format=json&limit=1",
        hostname: "ws.audioscrobbler.com"
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
            var track = parsedData.recenttracks.track[0];
            cachedResponse = {
                track: track.name,
                artist: track.artist["#text"],
                url: track.url
            };
            if ( track["@attr"] && track["@attr"].nowplaying && track["@attr"].nowplaying === "true" ) {
                cachedResponse.date = new Date().getTime();
                cachedResponse.nowPlaying = "true";
            } else {
                cachedResponse.date = track.date.uts;
                cachedResponse.nowPlaying = "false";
            }
            cb(null,cachedResponse);
        })
    });
    req.end();
};