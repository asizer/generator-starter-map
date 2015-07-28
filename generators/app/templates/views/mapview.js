define([
    'dojo/text!../templates/mapViewTemplate.html'
  ],

  function(
    viewTemplate
  ) {
    return Backbone.View.extend({

      initialize: function(options) {
        this.template = _.template(viewTemplate);
        this.render();
        this.startup();
      },

      render: function() {
        this.$el.html(this.template);
        return this;
      },

      startup: function() {

      }

    });
  });
