define(function (require) {

    var Backbone = require("backbone");
    var Mustache = require("mustache");
    var DataFormatting = require("utils/data-formatting");

    var template = require("text!portfolio/templates/projects/project-list.mustache");

    return Backbone.View.extend({

        events: {
            "click li a": "onProjectClick"
        },

        initialize: function (options) {
            this.collection.on("reset",this.render,this);
        },

        render: function () {
            var data = this.collection.toJSON();
            for ( var i=0; i<data.length; i++ ) {
                var date = new Date(data[i].date);
                data[i].dateText = DataFormatting.formatMSTimestamp(data[i].date);
            }
            this.$el.html(Mustache.render(template,data));
        },

        onProjectClick: function (event) {
            Backbone.Notifications.trigger("navigate","projects/"+$(event.target).attr("data-id"));
        },

        filterProjects: function (activeTags) {
            var self = this;
            this.collection.each(function (model) {
                var found = false;
                _.each(model.get("tags"),function (tag) {
                    if ( _.indexOf(activeTags,tag._id) > -1 ) {
                        found = true;
                    }
                });
                var li = self.$el.find("a[data-id='"+model.id+"']").parent();
                if ( found ) {
                    li.fadeIn(250);
                } else {
                    li.fadeOut(250);
                }
            });
        },

        fadeInList: function (event) {
            this.$el.find("li").fadeTo(0,0).each(function (index) {
                $(this).delay(index*100).fadeTo(250,1);
            });
        }
    });
});