define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/on',

    'esri/map'

  ],

  function(declare, lang, topic, on,
    Map) {

    return declare([], {

      map: null,

      constructor: function(options) {
        this.initMap(options);
      },

      initMap: function(options) {
        this.map = new Map(options.mapDiv, options.mapSetup);
        // this.handleMapCreation();
      },

      handleMapCreation: function() {
        this.attachEventListeners();
        if (this.map.loaded) {
          this.initialPublish();
        } else {
          on(this.map, 'load', lang.hitch(this, this.initialPublish));
        }
      },

      attachEventListeners: function() {
        on(this.map, 'resize', lang.partial(topic.publish, 'map/resize'));
        on(this.map, 'update-start', lang.partial(topic.publish, 'map/update-start'));
        on(this.map, 'update-end', lang.partial(topic.publish, 'map/update-end'));

        // listen for events from other widgets that will change the map
        topic.subscribe('map/please/add-layer', lang.hitch(this.map, this.map.addLayer));
        topic.subscribe('map/please/remove-layer', lang.hitch(this, this.removeLayer));
        topic.subscribe('map/please/set-extent', lang.hitch(this, this.setExtent));
        topic.subscribe('map/please/center-at', lang.hitch(this, this.centerAt));
        topic.subscribe('map/please/center-and-zoom', lang.hitch(this, this.centerAndZoom));
        topic.subscribe('map/please/ignore-clicks', lang.hitch(this, this.detachClickHandle));
        topic.subscribe('map/please/handle-clicks', lang.hitch(this, this.reattachClickHandle));
      },

      initialPublish: function() {
        topic.publish('map/loaded', {
          map: this.map
        });
      },

      publishSize: function() {
        topic.publish('map/resize', {
          height: this.map.height,
          width: this.map.width,
          extent: this.map.extent,
          target: this.map
        });
      },

      // accepts actual layer or layer id string
      removeLayer: function(layerOrId) {
        var layer = this.getLayer(layerOrId);
        this.map.removeLayer(layer);
      },

      getLayer: function(layerOrId) {
        // is it a string? then go get the layer.
        if (_.isString(layerOrId)) {
          return this.map.getLayer(layerOrId);
        }
        // otherwise it's already a layer.
        return layerOrId;
      },

      setExtent: function(options) {
        var extent = options.extent || options;
        var fit = options.fit || null;
        this.map.setExtent(extent, fit);
      },

      centerAt: function(centerPoint) {
        this.map.centerAt(centerPoint).then(function() {
          topic.publish('map/centered');
        });
      },

      centerAndZoom: function(options) {
        if (this.map.zoom >= 17 && !options.zoom) {
          this.centerAt(options.center);
          return;
        }
        this.map.centerAndZoom(options.center, options.zoom || 17).then(function() {
          topic.publish('map/centered-and-zoomed');
        });
      },

      detachClickHandle: function() {
        this.map.setInfoWindowOnClick(false);
      },

      reattachClickHandle: function() {
        this.map.setInfoWindowOnClick(true);
      }

    });
  });
