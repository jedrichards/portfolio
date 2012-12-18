define(["backbone"],function (Backbone) {

        return Backbone.Router.extend({

            initialize: function (options) {
                this.route("","root");
                this.route("projects/:id","project");
            }
        });
    }
);