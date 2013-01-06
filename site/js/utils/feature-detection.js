define(function (require) {

    return {

        hasLocalStorage: function () {
            try {
                return "localStorage" in window && window["localStorage"] !== null;
            } catch ( err ) {
                return false;
            }
        },

        hasRequestAnimationFrame: function () {
            return ( window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ) === true;
        }
    };
});