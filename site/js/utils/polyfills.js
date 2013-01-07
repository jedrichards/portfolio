define(function (require) {

    return {

        /**
         * Normalise the function naming for requestAnimationFrame and optionally
         * polyfill the functionality via setTimeout.
         */
        requestAnimationFrame: function (doPolyfill) {
            var lastTime = 0;
            var vendors = ["ms","moz","webkit","o"];
            for (var x=0; x<vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+"RequestAnimationFrame"];
                window.cancelAnimationFrame = window[vendors[x]+"CancelAnimationFrame"] || window[vendors[x]+"CancelRequestAnimationFrame"];
            }
            if ( doPolyfill ) {
                if ( !window.requestAnimationFrame ) {
                    window.requestAnimationFrame = function (callback,element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0,16 - (currTime - lastTime));
                        var id = window.setTimeout(function () {
                            callback(currTime+timeToCall);
                        },timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                }
                if ( !window.cancelAnimationFrame ) {
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                    };
                }
            }
        },

        /**
         * Tweak Backbone.sync() to always make CORS enabled requests.
         */
        backboneCORS: function (Backbone) {
            var sync = Backbone.sync;
            Backbone.sync = function (method,model,options) {
                options = options || {};
                options.crossDomain = true;
                options.xhrFields = {withCredentials:true};
                sync.apply(this,arguments);
            };
        },

        /**
         * Adjust jQuery's AJAX transport to use IE's XDomainRequest object.
         * Required for cross origin AJAX communication when the XMLHTTPRequest2
         * object is not available, but XDomainRequest is (IE versions less than
         * 10).
         */
        jqueryXDomainRequest: function (jQuery) {
            jQuery.ajaxTransport(function (s) {
                if ( s.crossDomain && s.async ) {
                    var xdr;
                    return {
                        send: function (_,complete) {
                            function callback(status,statusText,responses,responseHeaders) {
                                xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                                xdr = undefined;
                                complete(status,statusText,responses,responseHeaders);
                            }
                            xdr = new XDomainRequest();
                            xdr.open(s.type,s.url);
                            xdr.onload = function () {
                                callback(200,"OK",{text:xdr.responseText},"Content-Type: "+xdr.contentType);
                            };
                            xdr.onerror = jQuery.noop;
                            xdr.onprogress = jQuery.noop;
                            xdr.ontimeout = jQuery.noop;
                            setTimeout(function () {
                                xdr.send((s.hasContent && s.data ) || null );
                            },500);
                        }
                    };
                }
            });
        }
    };
});