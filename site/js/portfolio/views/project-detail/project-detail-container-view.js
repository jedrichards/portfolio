define(function (require) {

    var Backbone = require("backbone");
    var Mustache = require("mustache");
    var ProjectDetailView = require("./project-detail-view");

    return Backbone.View.extend({

        initialize: function (options) {
            this.collection.on("reset",this.collectionReset,this);
        },

        collectionReset: function () {
            this.appendProject();
        },

        addProject: function (id) {
            this.currID = id;
            this.appendProject();
        },

        removeProject: function () {
            this.currID = null;
            if ( this.projectDetailView ) this.projectDetailView.destroy();
        },

        appendProject: function () {
            var model = this.collection.get(this.currID);
            if ( !model ) {
                Backbone.Notifications.trigger("navigate","");
                return;
            }
            this.projectDetailView = this.appendView(new ProjectDetailView({
                model: model
            }));
        }
    });
});