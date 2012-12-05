var vows = require("vows");
var assert = require("assert");
var http = require("http");

var host = "127.0.0.1";
var port = 8080;

function assertResponse () {
    return function (err,res,body) {
        assert.isNull(err);
    }
}

function assertStatus (code) {
    return function (err,res) {
        assert.equal(res.statusCode,code);
    };
}

function assertHeader (key) {
    return function (err,res) {
        assert.include(res.headers,key);
    }
}

function assertHeaderValue (key,value) {
    return function (err,res) {
        assert.equal(res.headers[key],value);
    }
}

function assertBodyIsJSONArray () {
    return function (err,res,body) {
        assert.isArray(JSON.parse(body));
    }
}

var api = {
    get: function (path) {
        return function () {
            var callback = this.callback;
            var options = {
                hostname: host,
                port: port,
                path: path,
                method: "GET"
            };
            var req = http.request(options,function (res) {
                res.setEncoding("utf8");
                var body = "";
                res.on("data",function (chunk) {
                    body += chunk;
                });
                res.on("end",function () {
                    callback(null,res,body);
                });
            });
            req.on("error", function (err) {
                callback(err);
            });
            req.end();
        };
    }
};

exports.suite = vows.describe("API Tests on "+host+":"+port).addBatch({
    "GET /projects": {
        topic: api.get("/projects"),
        "should not error": assertResponse(),
        "should respond with 200 OK": assertStatus(200),
        "should attempt to set a session cookie": assertHeader("set-cookie"),
        "should return 'application/json' content-type": assertHeaderValue("content-type","application/json"),
        "body should be JSON that parses to an array": assertBodyIsJSONArray()
    },
    "GET /tags": {
        topic: api.get("/tags"),
        "should respond with 200 OK": assertStatus(200)
    },
    "GET /users": {
        topic: api.get("/users"),
        "should respond with 403 Forbidden": assertStatus(403)
    },
    "GET /sessions": {
        topic: api.get("/sessions"),
        "should respond with 403 Forbidden": assertStatus(403)
    }
});