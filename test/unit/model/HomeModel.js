/* globals QUnit  */

sap.ui.require(
  [
    'gizur/trailerapp/util/Common',
    'gizur/trailerapp/util/ServiceHelper',
    'gizur/trailerapp/model/HomeModel',
  ],
  function (Common, ServiceHelper, HomeModel) {
    'use strict';

    QUnit.module('HomeModel');

    //
    // Testing Locations List Methods
    //

    QUnit.test('Should load LocationList', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          var locations = oHomeModel.getProperty("/LocationList");
          assert.ok(locations.length == 21, "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);

    });

    QUnit.test('Should check validity of Locations', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          oHomeModel.setProperty("/sSelectedLocationField", "Tomteboda");
          var locations = oHomeModel.getProperty("/LocationList");
          assert.ok(oHomeModel.locationIsValid(), "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);

    });

    QUnit.test('Should check in-validity of Locations', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          var locations = oHomeModel.getProperty("/LocationList");
          oHomeModel.setProperty("/sSelectedLocationField", "New Delhi");
          assert.ok(oHomeModel.locationIsValid() === false, "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);
    });

    //
    // Testing Trailers List Methods
    //

    QUnit.test('Should load Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          assert.ok(trailers.length == 130, "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);
    });

    QUnit.test('Should check validity of Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          oHomeModel.setProperty("/sSelectedTrailerId", "BTL835KV");
          assert.ok(oHomeModel.trailerIsValid(), "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);
    });

    QUnit.test('Should check in-validity of Trailers', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

      var complete = function () {
          var trailers = oHomeModel.getProperty("/TrailerList");
          oHomeModel.setProperty("/sSelectedTrailerId", "DDD###22");
          assert.ok(oHomeModel.trailerIsValid() === false, "Passed!");
          done();
      };

      oHomeModel.init(true).then(complete);
    });

    //
    // Testing Loading of Damages
    //

    QUnit.skip('Should load Damages', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();

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

      oHomeModel.init(true).then(complete);
    });

  }
);
