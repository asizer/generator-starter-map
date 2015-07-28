
define([
    'dojo/Deferred',
    'dojo/_base/lang',

    'esri/arcgis/OAuthInfo',
    'esri/IdentityManager',
    'esri/arcgis/Portal'
  ],

  function(
    Deferred, lang,
    OAuthInfo, esriID, arcgisPortal
  ) {
    return {

      portalUrl: null,
      appId: null,

      appSignin: function(options) {
        this._saveOptions(options);
        this._oauthSetup();


        var def = new Deferred();
        this._signIn(def);
        esriID.getCredential(this.portalUrl);
        return def;
      },

      _saveOptions: function(options) {
        lang.mixin(this, options);
      },

      _oauthSetup: function() {
        var info = new OAuthInfo({
          appId: this.appId,
          portalUrl: this.portalUrl,
          popup: false
        });

        esriID.registerOAuthInfos([info]);

        this.portalUrl = info.portalUrl;

      },

      _signIn: function(def) {
        // the actual portalUser information is available in the info object above,
        // but is an underscore property
        esriID.checkSignInStatus(this.portalUrl + '/sharing')
          .then(lang.hitch(this, this._handleSigninStatus, def))
          .otherwise(lang.hitch(this, this._rejectDeferred, def));
      },

      _handleSigninStatus: function(def, response) {
        // signin() below fires two requests to the portal, one without a token and one with.
        // https://www.arcgis.com/sharing/rest/accounts/self?culture=en-us&f=json
        new arcgisPortal.Portal(this.portalUrl).signIn()
          .then(lang.hitch(this, this._resolveWithAccess, def))
          .otherwise(lang.hitch(this, this._rejectDeferred, def));
      },

      _rejectDeferred: function(def, error) {
        def.reject();
        console.error(error);
      },

      _resolveWithAccess: function(def, user) {
        if (user) {
          def.resolve({
            user: user
          });
        } else {
          this._rejectDeferred(def);
        }
      }
    };
  });
