/* globals QUnit  */

sap.ui.require(
  [
    'gizur/trailerapp/util/Util',
    'gizur/trailerapp/model/HomeModel'
  ],
  function (Common, HomeModel) {
    'use strict';

    QUnit.module('HomeModel');

    //
    // Testing Locations List Methods
    //

    QUnit.test('Should load LocationList', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      var complete = function () {
          var locations = oHomeModel.getProperty("/LocationList");
          console.log("locations.length", locations.length)
          assert.ok(locations.length == 21, "Passed!");
          done();
      };

      oHomeModel._loadLocations(complete);
    });

    QUnit.test('Should check validity of Locations', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      oHomeModel.setProperty("/sSelectedLocationField", "Tomteboda")

      var complete = function () {
          var locations = oHomeModel.getProperty("/LocationList");
          assert.ok(oHomeModel._locationIsValid(), "Passed!");
          done();
      };

      oHomeModel._loadLocations(complete);
    });

    QUnit.test('Should check in-validity of Locations', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      oHomeModel.setProperty("/sSelectedLocationField", "New Delhi")

      var complete = function () {
          var locations = oHomeModel.getProperty("/LocationList");
          assert.ok(oHomeModel._locationIsValid() === false, "Passed!");
          done();
      };

      oHomeModel._loadLocations(complete);
    });

    //
    // Testing Trailers List Methods
    //

    QUnit.test('Should load Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          assert.ok(trailers.length == 130, "Passed!");
          done();
      };

      oHomeModel._loadTrailers(complete);
    });

    QUnit.test('Should check validity of Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      oHomeModel.setProperty("/sSelectedTrailerId", "BTL835KV")

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          assert.ok(oHomeModel._trailerIsValid(), "Passed!");
          done();
      };

      oHomeModel._loadTrailers(complete);
    });

    QUnit.test('Should check in-validity of Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      oHomeModel.setProperty("/sSelectedTrailerId", "DDD###22")

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          assert.ok(oHomeModel._trailerIsValid() === false, "Passed!");
          done();
      };

      oHomeModel._loadTrailers(complete);
    });

  }
);
