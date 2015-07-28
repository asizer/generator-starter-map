define([
    'dojo/_base/lang',

    'app/views/headerView',
    'app/views/mapView',

    'dojo/text!../templates/layoutViewTemplate.html'
  ],

  function(
    lang,
    HeaderView, MapView,
    viewTemplate
  ) {
    return Backbone.View.extend({

      initialize: function(options) {
        this.template = _.template(viewTemplate);
        this.started = false;
        this.render();
        this.startup(options);
      },

      render: function() {
        this.$el.html(this.template);
        if (this.started) {
          this.headerView.render();
          this.mapView.render();
        }

        return this;
      },

      startup: function(options) {
        this.started = true;
        this.headerView = new HeaderView({
          el: $('header', this.$el),
          title: options.config.title,
          subtitle: options.config.subtitle
        });
        this.mapView = new MapView({
          el: $('.map-view', this.$el)
        });
      }

    });
  });
