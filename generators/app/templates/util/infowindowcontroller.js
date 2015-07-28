define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/on'

  ],

  function(
    declare, lang, topic, on
  ) {
    return declare([], {

      constructor: function(options) {
        this.setupClassVars(options);
        this.setupComponents(options);
        this.attachEventListeners();
      },

      setupClassVars: function(options) {
        this.map = options.map;
        this.infoWindow = this.map.infoWindow;
      },

      setupComponents: function(options) {

      },

      attachEventListeners: function() {
        topic.subscribe('infowindow/please/set-and-show', lang.hitch(this, this.setAndShowInfoWindow));
        topic.subscribe('infowindow/please/unset-and-hide', lang.hitch(this, this.unsetAndHideInfoWindow));
      },

      setAndShowInfoWindow: function(params) {
        this.setInfoWindow(params);
        this.showInfoWindow(params);
      },

      unsetAndHideInfoWindow: function() {
        this.infoWindow.clearFeatures();
        this.infoWindow.hide();
      },

      setInfoWindow: function(params) {
        if (params.graphics && _.isArray(params.graphics)) {
          this.infoWindow.setFeatures(params.graphics);
        } else if (params.graphic) {
          this.infoWindow.setFeatures([params.graphic]);
        } else {
          console.debug('no graphics to set');
        }
      },

      showInfoWindow: function(params) {
        this.infoWindow.show(this.getAnchor(params.geometry));
      },

      getAnchor: function(geo) {
        if (geo.type === 'point') {
          return geo;
        } else if (geo.getExtent) {
          return geo.getExtent().getCenter();
        } else if (geo.getCentroid) {
          return geo.getCentroid();
        } else {
          console.debug('nowhere to put anchor');
          return;
        }
      }

    });
  });
