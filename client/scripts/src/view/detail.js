define(["backbone", "underscore", "routes", "utils"], function(B, _, routes, $u) {
    return B.View.extend({
        tagName: "div",
        className: "proposal-details",
        template: $u.templateWithId("proposal-details",
                                    {variable: "proposal"}),
        el: "#overlay",
        events: {
            "click a.close": "hide",
            "click": "dismiss"
        },

        initialize: function() {
            this.listenTo(this.collection, "change:selected",
                          this.selectionChanged);

            routes.getDispatcher().on("showDetails", _.bind(this.onShow, this));
        },

        selectionChanged: function(proposal) {
            if (this.model) {
                this.stopListening(this.model);
            }

            this.model = proposal;
            this.listenTo(proposal, "change", this.render);
            proposal.fetchIfNeeded();

            if (this.showing)
                this.render(proposal);
        },

        render: function() {
            var html = this.template(this.model.toJSON());

            this.$el.html(html);
        },

        hide: function() {
            this.$el.hide();
            this.showing = false;
        },

        /**
         * If the user clicks on the #overlay element itself (i.e., the
         * grayed-out margins), hide the details view.
         */
        dismiss: function(e) {
            if (e.target == e.currentTarget)
                this.hide();
        },

        onShow: function(id) {
            var proposal = this.collection.get(id);

            if (proposal) {
                this.show(proposal);
            }
        },

        show: function(proposal) {
            if (proposal && this.model &&
                this.model.get("id") !== proposal.get("id"))
            {
                this.selectionChanged(proposal);
            }

            this.render();
            this.$el.show();
            this.showing = true;
        }
    });
});
