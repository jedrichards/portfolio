define([
    "jquery",
    "backbone",
    "mustache",
    "text!portfolio/templates/tag-filters.mustache"],
    function ($,Backbone,Mustache,template) {

    return Backbone.View.extend({

        events: {
            "click li a": "onTagClick"
        },

        initialize: function () {
            this.collection.on("reset",this.render,this);
            this.collection.fetch();
        },

        render: function () {
            this.$el.html(Mustache.render(template,this.collection.toJSON()));
        },

        onTagClick: function (event) {
            var tags = [];
            if ( !this.firstClick ) {
                this.firstClick = true;
                this.$el.find("a").each(function (index) {
                    if ( $(event.target).parent().index() === index ) {
                        $(event.target).addClass("selected");
                    } else {
                        $(event.target).removeClass("selected");
                    }
                });
            } else {
                $(event.target).toggleClass("selected");
            }
            this.$el.find("a").each(function () {
                if ( $(this).hasClass("selected") ) {
                    tags.push($(this).attr("data-id"));
                }
            });
            Backbone.Notifications.trigger("filter",tags);
        }
    });
});