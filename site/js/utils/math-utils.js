define(function (require) {
    return {
        easeOut: function (t,d,p) {
            return 1-Math.pow(1-(t/d),p);
        },
        randomInt: function (min,max) {
            return Math.floor(Math.random()*(max-min+1))+min;
        },
        limit: function (value,min,max) {
            return Math.min(max,Math.max(min,value));
        }
    };
});