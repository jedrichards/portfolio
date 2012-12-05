var Cookies = require("cookies");
var config = require("../../config");

module.exports = function () {

    return function (req,res,next) {
        req.cookies = new Cookies(req,res);
        req.setCookie = function (cookies) {
            return function (key,value,httpOnly) {
                cookies.set(key,value,{overwrite:true,expires:getCookieExpirey(),httpOnly:httpOnly});
            };
        }(req.cookies);
        req.getCookie = function (cookies) {
            return function (key) {
                return cookies.get(key);
            };
        }(req.cookies);
        next();
    };

    function getCookieExpirey() {
        var expirey = new Date();
        expirey.setTime(expirey.getTime()+(1000*60*60*24*365));
        return expirey;
    }
};