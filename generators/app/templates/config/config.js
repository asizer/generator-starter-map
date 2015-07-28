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
      basemap: 'dark-gray',
      center: [-77.25, 38.93],
      zoom: 14
    },

    services: {
      geometry: 'https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
      print: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
    }
  };
});
