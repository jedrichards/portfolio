define(function (require) {

    var Backbone = require("backbone");
    var GlitchText = require("portfolio/glitch-text/glitch-text");
    var FeatureDetection = require("utils/feature-detection");
    var Polyfills = require("utils/polyfills");

    return Backbone.View.extend({

        doIntro: function () {
            if ( !FeatureDetection.hasRequestAnimationFrame() ) {
                Polyfills.requestAnimationFrame(false);
            }
            if ( FeatureDetection.hasRequestAnimationFrame() ) {
                this.$el.css("min-height",this.$el.height());
                this.$el.fadeTo(0,0).fadeTo(4000,1);
                this.glitchText = new GlitchText(this.$el.find("p")[0],4000,2000,30,function () {
                    Backbone.Notifications.trigger("introComplete");
                });
                this.glitchText.start();
            } else {
                Backbone.Notifications.trigger("introComplete");
            }
        }
    });
});