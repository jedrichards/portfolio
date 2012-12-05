define([
    "jquery",
    "backbone",
    "mustache",
    "notes"],
    function ($,Backbone,Mustache,notes) {

    return Backbone.View.extend({

        events: {
            "click a": "onItemClicked"
        },

        initialize: function (options) {
            this.template = options.template;
            this.collection.on("reset",this.onCollectionReset,this);
            if ( this.collection.length === 0 ) {
                this.collection.fetch({
                    error: function (collection,xhr,options) {
                        var serverError = JSON.parse(xhr.responseText);
                        Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error "+xhr.status+" "+serverError.code,error:true,message:serverError.message});
                    }
                });
            } else {
                this.render();
            }
        },

        onCollectionReset: function () {
            this.render();
        },

        render: function () {
            this.$el.html(Mustache.render(this.template,this.collection.toJSON()));
        },

        onItemClicked: function (event) {
            Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:this.collection.name+"/"+$(event.target).attr("data-item-id")});
        },

        onDestroy: function () {
            this.collection.off("reset",this.onCollectionReset);
        }
    });
});