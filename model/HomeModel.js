/* globals _  */
/* eslint consistent-this: ["error", "self"] */
/* eslint no-warning-comments: 0 */

sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "gizur/trailerapp/util/ServiceHelper"
], function(JSONModel, ServiceHelper) {
  "use strict";

  return JSONModel.extend("gizur.trailerapp.model.HomeModel", {

    // Lifecycle operations
    // --------------------

    init: function(_useMockData) {
      this.setData({
          sSelectedTrailerId: null,
          sCoopOrRented: "Cooptrailer",
          sSelectedLocationId: null,
          sSelectedLocationField: null,
          TrailerList: null,
          LocationList: null,
          DamageListSelectedTrailer: null,
          sSealedOrNotSealed: "Sealed",
      });

      ServiceHelper._loadTrailers(this, '/TrailerList');
      ServiceHelper._loadLocations(this, '/LocationList');
    },

    setIsCooptrailer: function(cooptrailer) {
      if (cooptrailer) {
        this.setProperty("/sCoopOrRented", "Cooptrailer");
      } else {
        this.setProperty("/sCoopOrRented", "Hyrtrailer");
      }
    },

    setSealed: function(isSealed) {
      if (isSealed) {
        this.setProperty("/sSealedOrNotSealed", "Sealed");
      } else {
        this.setProperty("/sSealedOrNotSealed", "Not Sealed");
      }
    },

    trailerIsValid: function() {
        var trailer = this.getProperty("/sSelectedTrailerId");
        var trailerList = this.getProperty("/TrailerList");

        if (!trailer) return false;

        var found = false;
        for (var i = 0; i < trailerList.length; i++) {
            if (trailerList[i]["assetname"] == trailer) found = true;
        }
        if (!found) return false;

        return true;
    },

    fieldsAreValid: function() {
        return this.trailerIsValid() && this.locationIsValid();
    },

    locationIsValid: function() {
        var location = this.getProperty("/sSelectedLocationField");
        var locationList = this.getProperty("/LocationList");

        if (!location) return false;

        var found = false;
        for (var i = 0; i < locationList.length; i++) {
            if (locationList[i]["location"] == location) found = true;
        }
        return found;
    }

  });

});
