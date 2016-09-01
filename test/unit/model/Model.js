/* globals QUnit  */

sap.ui.require([
    'gizur/trailerapp/util/Util',
    'gizur/trailerapp/model/HomeModel'
  ],
  function (Common, HomeModel) {
    'use strict';

    QUnit.module('Model');
    console.log(HomeModel);

    QUnit.test('Should load event details', function (assert) {
      var done = assert.async();

      // Setup the model
      var oModel = new HomeModel();
      oModel.init(true);

      oModel._loadTrailers().then(function() {
        assert.ok(oModel.getProperty("/TrailerList").length > 0, 'Loaded event details');
        done();
      });
    });
  }
);
