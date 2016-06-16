/* globals _  */
/* eslint consistent-this: ["error", "self"] */
/* eslint no-warning-comments: 0 */

sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "gizur/trailerapp-common/util/Util",
  "gizur/trailerapp/Config"
], function(JSONModel, Common, Config) {
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

      this.setSizeLimit(200);

    },

    //
    // Should structure this better
    // ---------------------------

    _trailerIsValid: function() {
        var trailer = this._oModel.getProperty("/sSelectedTrailerId");
        var trailerList = this._oModel.getProperty("/TrailerList");

        if (!trailer) return false;

        var found = false;
        for (var i = 0; i < trailerList.length; i++) {
            if (trailerList[i]["assetname"] == trailer) found = true;
        }
        if (!found) return false;

        return true;
    },

    _locationIsValid: function() {
        var location = this._oModel.getProperty("/sSelectedLocationField");
        var locationList = this._oModel.getProperty("/LocationList");

        if (!location) return false;

        var found = false;
        for (var i = 0; i < locationList.length; i++) {
            if (locationList[i]["location"] == location) found = true;
        }
        if (!found) return false;

        return true;
    },

    _loadTrailers: function() {
        var self = this;

        Common.xhr("vwTrailers", "GET", null, null, "assetname").then(
            function(result) {
                self._oModel.setProperty("/TrailerList", result);
            }
        ).catch(
            function(error) {
                Common.error("Couldn't load trailers. Error: " + error);
            }
        );
    },

    _loadLocations: function() {
        var self = this;

        Common.xhr("vwLocations", "GET", null, null, "location_id").then(
            function(result) {
                self._oModel.setProperty("/LocationList", result);
            }
        ).catch(
            function(error) {
                Common.error("Couldn't load locations. Error: " + error);
            }
        );
    },

    _loadExistingDamages: function(trailerId) {
        var self = this;

        var trailer = self._oModel.getProperty("/sSelectedTrailerId");

        Common.xhr("vwExistingDamagaes", "GET", null, "trailer_id EQ '" + trailer + "' AND status EQ 'Open'", "ticketid").then(
            function(result) {
                self._oModel.setProperty("/DamageListSelectedTrailer", result);

                var damageReportIds = self._getDamageReportIds(result);
                var imagesPromises = [];

                for(var i = 0; i < damageReportIds.length; i++) {
                    imagesPromises.push(Common.xhr("vwTroubleTickeAttachments", "GET", null, "troubleticket_id EQ '" + damageReportIds[i] + "'"));
                }

                return Promise.all(imagesPromises);
            }
        ).then(
            function(imagesArray) {
                var images = [].concat.apply([], imagesArray);
                var damageReports = self._oModel.getProperty("/DamageListSelectedTrailer");

                self._addServerPath(images);
                self._addImagesToDamageReports(damageReports, images);

                self._oModel.setProperty("/DamageListSelectedTrailer", damageReports);
            }
        ).catch(
            function(error) {
                Common.error("Couldn't load damage reports or images. Error: " + error);
            }
        );
    },

    _addImagesToDamageReports: function(reports, images) {
        reports.forEach(
            function(report) {
                var found = images.find(
                    function(image) {
                        return image.troubleticket_id == report.ticketid;
                    }
                );

                if (found) {
                    report.image = found;
                }
            }
        );
    },

    _getDamageReportIds: function(reports) {
        var ids = [];
        reports.forEach(
            function(report) {
                ids.push(report.ticketid);
            }
        );

        return ids;
    },

    _addServerPath: function(images) {
        var path = gizur.trailerapp.Config.appConfig.imagesPath;

        images.forEach(
            function(image) {
                image.filename = path + image.filename;
            }
        );
    },

    _setAutocompleteFilters: function() {
        var self = this;

        this.getView().byId("trailer-autocomplete").setFilterFunction(
            function(sValue, oItem) {
                return oItem.getAdditionalText() == self._oModel.getProperty("/sCoopOrRented")
                    && ~oItem.getText().toLowerCase().indexOf(sValue.toLowerCase());
            }
        );

        this.getView().byId("location-autocomplete").setFilterFunction(
            function(sValue, oItem) {
                return ~oItem.getText().toLowerCase().indexOf(sValue.toLowerCase());
            }
        );
    }


  });

});
