define([
    "jquery",
    "backbone"],
    function ($,Backbone) {

    return Backbone.View.extend({

        initialize: function () {

            this.$el.removeClass("initially-hidden");
            this.$el.find("li").fadeTo(0,0);
            Backbone.Notifications.on("textIntroComplete",this.textIntroComplete,this);
        },

        textIntroComplete: function () {
            this.$el.find("li").each(function (index) {
                $(this).delay(index*150).fadeTo(250,1);
            });
        }
    });
});