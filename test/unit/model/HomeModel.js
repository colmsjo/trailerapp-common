/* globals QUnit  */

sap.ui.require(
  [
    'gizur/trailerapp/util/Util',
    'gizur/trailerapp/model/HomeModel'
  ],
  function (Common, HomeModel) {
    'use strict';

    QUnit.module('HomeModel');

    QUnit.test('Should load event details', function (assert) {
      var done = assert.async();

      // Setup the model
      var oHomeModel = new HomeModel();
      oHomeModel.init(true);

      oHomeModel.loadEventDetails2(1).then(function() {
        assert.ok(oHomeModel.getEventDetails().length === 2, 'Loaded event details');
        done();
      });
    });

  }
);
