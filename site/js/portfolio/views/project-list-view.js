define([
    "jquery",
    "backbone",
    "underscore",
    "mustache",
    "text!portfolio/templates/project-list.mustache"],
    function ($,Backbone,_,Mustache,template) {

    return Backbone.View.extend({

        events: {
            "click li a": "onProjectClick"
        },

        initialize: function () {
            Backbone.Notifications.on("filter",this.onFilter,this);
            this.collection.on("reset",this.render,this);
            this.collection.fetch();
            Backbone.Notifications.on("textIntroComplete",this.textIntroComplete,this);
        },

        textIntroComplete: function () {
            this.$el.find("li").each(function (index) {
                $(this).delay(index*75).fadeTo(250,1);
            });
        },

        render: function () {
            var templateData = this.collection.toJSON();
            var months = ["Jan","Feb","March","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            for ( var i=0; i<templateData.length; i++ ) {
                var date = new Date(templateData[i].date);
                templateData[i].dateText = months[date.getMonth()]+" "+date.getFullYear();
            }
            this.$el.html(Mustache.render(template,templateData));
            this.$el.find("li").fadeTo(0,0);
        },

        onProjectClick: function (event) {
            Backbone.Notifications.trigger("navigate","projects/"+$(event.target).attr("data-id"));
        },

        onFilter: function (activeTags) {
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
        }
    });
});