define(function (require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var Mustache = require("mustache");

    var template = require("text!portfolio/templates/projects/tag-buttons.mustache");

    return Backbone.View.extend({

        events: {
            "click li a": "tagButtonClick"
        },

        initialize: function (options) {
            this.isFirstClick = true;
            this.collection.on("reset",this.render,this);
        },

        render: function () {
            this.$el.html(Mustache.render(template,this.collection.toJSON()));
        },

        tagButtonClick: function (event) {
            if ( this.isFirstClick ) {
                this.isFirstClick = false;
                var clickedIndex = $(event.target).parent().index();
                this.$el.find("a").each(function (index) {
                    if ( clickedIndex === index ) {
                        $(this).addClass("selected");
                    } else {
                        $(this).removeClass("selected");
                    }
                });
            } else {
                $(event.target).toggleClass("selected");
            }
            var selectedTags = [];
            this.$el.find("a").each(function () {
                if ( $(this).hasClass("selected") ) {
                    selectedTags.push($(this).attr("data-id"));
                }
            });
            Backbone.Notifications.trigger("filterProjects",selectedTags);
        },

        fadeInList: function () {
            this.$el.find("li").fadeTo(0,0).each(function (index) {
                $(this).delay(index*100).fadeTo(250,1);
            });
        }
    });
});