define(function() {
  return {

    /* include portalUrl and appId if this
     * is a registered app */
    authentication: {
      portalUrl: '',
      appId: ''
    },

    title: '<%= appTitle %>',
    subtitle: '<%= subtitle %>',

    mapSetup: {
      webmapId: '4778fee6371d4e83a22786029f30c7e1'
    },

    services: {
      geometry: 'https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
      print: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
    }

  };
});
