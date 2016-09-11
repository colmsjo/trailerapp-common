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

    //
    // Testing Loading of Damages
    //

    QUnit.test('Should load Damages', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      var complete = function () {

          var damageModelStructure = ["ticketid",
              "ticket_no",
              "groupname",
              "parent_id",
              "product_id",
              "priority",
              "severity",
              "status",
              "category",
              "title",
              "solution",
              "update_log",
              "version_id",
              "hours",
              "days",
              "from_portal",
              "trailer_id",
              "ticket_type",
              "sealed",
              "report_damage",
              "drive_cause_damage",
              "position_damage",
              "type_of_damage",
              "place",
              "plates",
              "straps",
              "anteckningar",
              "damage_status",
              "description1",
              "description2",
              "image"];
          var damageImageModelStructure = [
              "modified_by",
              "attachments_id",
              "crmid",
              "description",
              "notes_id",
              "note_no",
              "title",
              "filename",
              "notecontent",
              "folder_id",
              "filetype",
              "filelocationtype",
              "filedownloadcount",
              "filestatus",
              "filesize",
              "fileversion",
              "troubleticket_id"];

          var damageReports = oHomeModel.getProperty("/DamageListSelectedTrailer");
          assert.ok(damageReports.length === 6, "Passed!");

          for (var i in damageReports) {
              for (var j in damageModelStructure) {
                  assert.ok(damageReports[i].hasOwnProperty(damageModelStructure[j]), "Passed! " + damageModelStructure[j]);
              }
              for (var j in damageImageModelStructure) {
                  assert.ok(damageReports[i]["image"].hasOwnProperty(damageImageModelStructure[j]), "Passed! " + damageImageModelStructure[j]);
              }
          }

          done();
      };

      oHomeModel._loadExistingDamages("XXXTEST", complete);
    });

  }
);
