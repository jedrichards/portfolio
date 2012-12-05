define([
    "underscore",
    "backbone"],
    function (_,Backbone) {

        return Backbone.Router.extend({

            initialize: function (options) {
                this.route("","root");
                _.each(options.collections,function (collection) {
                    this.route(collection.name,collection.name);
                    this.route(collection.name+"/:id",collection.name);
                    this.route(collection.name+"/new",collection.name);
                },this);
            }
        });
    }
);