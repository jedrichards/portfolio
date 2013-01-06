define(function (require) {

    var Backbone = require("backbone");

    return Backbone.View.extend({

        initialize: function () {
            this.$el.find("li").fadeTo(0,0);
        },

        fadeInList: function () {
            this.$el.find("li").each(function (index) {
                $(this).delay(index*100).fadeTo(250,1);
            });
        },

        showList: function () {
            this.$el.find("li").fadeTo(0,1);
        }
    });
});