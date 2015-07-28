/* global app:true */

define([
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/on',

    'app/util/signinUtil',
    'app/views/layoutView',
    'app/util/MapController',
    'app/util/InfoWindowController',

    'config/config',
    'esri/config'

  ],

  function(
    lang, topic, on,
    signinUtil, Layout, MapController, InfoWindowController,
    config, esriConfig
  ) {
    var Controller = {
      /**
       * This is the entry point for the application, called from main.js
       */
      startup: function(options) {
        app = this; // DEBUG
        this.options = options;
        this.initConfig();
        this.initLayout();
      },

      /**
       * Initialize esri configuration settings
       */
      initConfig: function() {
        // esriConfig.defaults.io.corsEnabledServers.push('');
        // esriConfig.defaults.geometryService = new GeometryService(config.geometryService.url);
        // esriConfig.defaults.io.proxyUrl = config.proxy.url;
        // esriConfig.defaults.io.alwaysUseProxy = config.proxy.alwaysUseProxy;
      },

      /**
       * Initialize the application layout by inserting top level nodes into the DOM
       */
      initLayout: function() {
        this.layout = new Layout({
          el: $('.main-container'),
          config: config
        });
        this.initMapController();
      },

      /**
       * Initialize the map and place it in #map
       */
      initMapController: function() {
        var handle = topic.subscribe('map/loaded', lang.hitch(this, function(result) {
          handle.remove();
          this.map = result.map;
          this.initUtils();
          this.initComponents(result);
          // in case any components need to resize themselves based on the map's dimensions
          this.mapController.publishSize();
        }));

        // #map is in mapViewTemplate.
        this.mapController = new MapController({
          mapDiv: 'map',
          mapSetup: config.mapSetup,
          portal: this.options && this.options.user && this.options.user.portal || null,
        });
      },

      /**
       * Initialize any other pieces of the app
       */
      initUtils: function() {
        this.infoWindowController = new InfoWindowController({
          map: this.map
        });
      },

      /**
       * Initialize components of the application, this is the last responsibility of the Controller
       */
      initComponents: function(mapLoadResult) {

      }
    };

    // Obtain OAuth credentials
    if (config.authentication && config.authentication.appId) {
      signinUtil.appSignin(config.authentication).then(function(response) {
        Controller.startup(response);
      }).otherwise(function() {
        console.error('trouble signing in', arguments);
      });
    } else {
      Controller.startup();
    }

    return Controller;
  });
