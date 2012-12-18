define([
    "jquery",
    "backbone",
    "portfolio/glitch-text/glitch-text"],
    function ($,Backbone,GlitchText) {

    return Backbone.View.extend({

        initialize: function () {

            this.$el.removeClass("initially-hidden");
            this.$el.hide().fadeIn(2000);

            this.pEl = this.$el.find("p");
            this.origText = this.pEl.text();

            this.glitchText = new GlitchText(this.$el.find("p")[0],4000,2000,30);
            this.glitchText.start();

            setTimeout(function () {
                Backbone.Notifications.trigger("textIntroComplete");
            },3750);
        }
    });
});