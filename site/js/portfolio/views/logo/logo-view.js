define(function (require) {

    var Backbone = require("backbone");

    return Backbone.View.extend({

        doIntro: function () {
            var logoContainer = this.$el.parent().prepend("<div>").children().first();
            var logo = this.$el;

            logoContainer.append(logo);
            logoContainer.height(logoContainer.outerHeight());

            logo.css("position","relative");
            logo.css("top",-logo.outerHeight());
            logo.animate({"top":0},250);

            this.icon = logoContainer.append("<i></i>").children().last();
            this.icon.addClass("icon-refresh");
            this.icon.addClass("icon-spin");
            this.icon.css("display","inline-block");
            this.icon.css("margin-left",10);
        },

        hideIcon: function () {
            this.icon.fadeOut(750);
        }
    });
});