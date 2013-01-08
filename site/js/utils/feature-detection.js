define(function (require) {

    return {
        hasLocalStorage: function () {
            var key = "foobar";
            try {
                localStorage.setItem(key,key);
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        },

        hasRequestAnimationFrame: function () {
            return !!window.requestAnimationFrame;
        },

        hasXHR2: function () {
            return !!( window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest() )
        },

        hasXDR: function () {
            return !!window.XDomainRequest;
        }
    };
});