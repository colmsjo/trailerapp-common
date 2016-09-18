/* globals $ _ gizur */
/* eslint consistent-this: ["error", "self"] */
/* eslint no-warning-comments: 0 */
/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/* eslint no-div-regex: 0 */

// Exports
// =======

jQuery.sap.declare("gizur.trailerapp.util.ServiceHelper");

// Imports
// =======

// TODO: Should rather set the common by calling a function or using a constructors
jQuery.sap.require("gizur.trailerapp.Config");
jQuery.sap.require("gizur.trailerapp.util.Common");

// The Common class
// ================

gizur.trailerapp.util.ServiceHelper = {
    _oCommon: gizur.trailerapp.util.Common,
    _oConfig: gizur.trailerapp.Config.appConfig,

    _loadTrailers: function(_oModel, _oProp) {
        var self = this;

        return self._oCommon.xhr(this._oConfig.serviceEndPonits.trailers, "GET", null, null, "assetname").then(
            function(result) {
                _oModel.setProperty(_oProp, result);
            }
        ).catch(
            function(error) {
                self._oCommon.error("Couldn't load trailers. Error: " + error);
                _oModel.setProperty(_oProp, null);
            }
        );
    },

    _loadLocations: function(_oModel, _oProp, done) {
        var self = this;

        return self._oCommon.xhr(this._oConfig.serviceEndPonits.locations, "GET", null, null, "location_id").then(
            function(result) {
                _oModel.setProperty(_oProp, result);
                done && done();
            }
        ).catch(
            function(error) {
                self._oCommon.error("Couldn't load locations. Error: " + error);
                _oModel.setProperty(_oProp, null);
            }
        );
    },

    _loadDamageTypes: function (_oModel, _oProp) {
        _oModel.setProperty(_oProp, [{
                "id": 1,
                "name": "Ciller",
                "positions": []
            }, {
                "id": 2,
                "name": "Cabinet Side",
                "positions": [4, 5]
            }, {
                "id": 3,
                "name": "Bumper",
                "positions": [6, 7, 8]
            }, {
                "id": 4,
                "name": "Rear Doors",
                "positions": [2, 3]
            }, {
                "id": 5,
                "name": "Cover",
                "positions": [9, 10, 11, 12]
            }, {
                "id": 6,
                "name": "Landing Legs",
                "positions": [6, 7]
            }, {
                "id": 7,
                "name": "Roof",
                "positions": []
            }]);
    },

    _loadDamagePositions: function(_oModel, _oProp) {
        _oModel.setProperty(_oProp, [{
                "id": 1,
                "name": "-NA-"
            }, {
                "id": 2,
                "name": "Right door"
            }, {
                "id": 3,
                "name": "Left door"
            }, {
                "id": 4,
                "name": "Right side"
            }, {
                "id": 5,
                "name": "Left side"
            }, {
                "id": 6,
                "name": "Right"
            }, {
                "id": 7,
                "name": "Left"
            }, {
                "id": 8,
                "name": "Back"
            }, {
                "id": 9,
                "name": "Left front"
            }, {
                "id": 10,
                "name": "Left back"
            }, {
                "id": 11,
                "name": "Right front"
            }, {
                "id": 12,
                "name": "Right back"
            }]);
    }
};
